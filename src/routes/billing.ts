import { Hono } from "hono";
import { createHmac, timingSafeEqual } from "crypto";
import { config } from "../config.js";
import {
  findApiKeyByCreemCustomerId,
  updatePlan,
  updateCreemInfo,
  suspendKey,
  activateKey,
} from "../db.js";
import type { ApiKeyRow } from "../db.js";

const billingRouter = new Hono();

const PLAN_PRODUCTS: Record<string, string> = {
  pro: config.creemProductPro,
  // scale: config.creemProductScale, // TODO: add when Scale product is created
};

function getProductPlan(productId: string): string | null {
  for (const [plan, pid] of Object.entries(PLAN_PRODUCTS)) {
    if (pid === productId) return plan;
  }
  return null;
}

function verifyCreemSignature(payload: string, signature: string, secret: string): boolean {
  const computed = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

billingRouter.post("/v1/billing/checkout", async (c) => {
  const apiKey = (c as unknown as { get(key: string): unknown }).get("apiKey") as ApiKeyRow | undefined;
  if (!apiKey) {
    return c.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "DB-backed API key required" } },
      401
    );
  }

  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const plan = typeof body.plan === "string" ? body.plan : undefined;

  if (!plan || !PLAN_PRODUCTS[plan] || !PLAN_PRODUCTS[plan]) {
    return c.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid plan. Currently available: 'pro'." },
      },
      400
    );
  }

  const productId = PLAN_PRODUCTS[plan];

  // Call Creem API to create checkout session (with retry)
  const creemBase = config.creemApiBase || "https://test-api.creem.io";
  const checkoutPayload = JSON.stringify({
    product_id: productId,
    success_url: `${c.req.url.split("/v1")[0]}/?checkout=success`,
    customer: {
      email: apiKey.user_email,
    },
    metadata: {
      api_key_id: String(apiKey.id),
      plan,
    },
  });

  let creemResponse: Response | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    creemResponse = await fetch(`${creemBase}/v1/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": config.creemApiKey,
        "Content-Type": "application/json",
      },
      body: checkoutPayload,
    });
    if (creemResponse.ok || creemResponse.status < 500) break;
    if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
  }

  if (!creemResponse || !creemResponse.ok) {
    const errBody = await creemResponse?.text().catch(() => "unknown");
    console.error(`Creem checkout error (${creemResponse?.status}):`, errBody);
    return c.json(
      { success: false, error: { code: "CHECKOUT_ERROR", message: `Failed to create checkout session (${creemResponse?.status})` } },
      500
    );
  }

  const checkout = await creemResponse.json() as { checkout_url?: string; id?: string };

  return c.json({
    success: true,
    data: { checkoutUrl: checkout.checkout_url, checkoutId: checkout.id },
  });
});

billingRouter.post("/v1/billing/webhook", async (c) => {
  const signature = c.req.header("creem-signature");
  if (!signature) {
    return c.json(
      { success: false, error: { code: "INVALID_SIGNATURE", message: "Missing creem-signature header" } },
      400
    );
  }

  const rawBody = await c.req.text();

  if (!verifyCreemSignature(rawBody, signature, config.creemWebhookSecret)) {
    return c.json(
      { success: false, error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } },
      400
    );
  }

  const event = JSON.parse(rawBody) as {
    id: string;
    eventType: string;
    created_at: number;
    object: Record<string, unknown>;
  };

  const obj = event.object;
  const metadata = (obj.metadata || {}) as Record<string, string>;
  const apiKeyId = parseInt(metadata.api_key_id || "0", 10);
  const customerId = (obj.customer_id || obj.customer?.toString()) as string | undefined;
  const subscriptionId = (obj.subscription_id || obj.id?.toString()) as string | undefined;

  switch (event.eventType) {
    case "checkout.completed": {
      // Payment succeeded — upgrade plan
      if (apiKeyId) {
        const plan = metadata.plan || "pro";
        updatePlan(apiKeyId, plan);
        if (customerId && subscriptionId) {
          updateCreemInfo(apiKeyId, customerId, subscriptionId);
        }
        activateKey(apiKeyId);
      }
      break;
    }

    case "subscription.active":
    case "subscription.paid": {
      // Grant/renew access
      if (customerId) {
        const keyRow = findApiKeyByCreemCustomerId(customerId);
        if (keyRow) {
          activateKey(keyRow.id);
        }
      } else if (apiKeyId) {
        activateKey(apiKeyId);
      }
      break;
    }

    case "subscription.expired":
    case "subscription.canceled": {
      // Revoke access — downgrade to free
      if (customerId) {
        const keyRow = findApiKeyByCreemCustomerId(customerId);
        if (keyRow) {
          updatePlan(keyRow.id, "free");
        }
      } else if (apiKeyId) {
        updatePlan(apiKeyId, "free");
      }
      break;
    }

    case "subscription.paused": {
      // Suspend key
      if (customerId) {
        const keyRow = findApiKeyByCreemCustomerId(customerId);
        if (keyRow) {
          suspendKey(keyRow.id);
        }
      } else if (apiKeyId) {
        suspendKey(apiKeyId);
      }
      break;
    }

    case "subscription.past_due": {
      // Payment failed, keep active but log warning
      console.warn(`Subscription past_due for api_key_id=${apiKeyId}, customer=${customerId}`);
      break;
    }
  }

  return c.json({ received: true });
});

export { billingRouter };
