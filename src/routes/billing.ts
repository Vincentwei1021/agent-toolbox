import { Hono } from "hono";
import Stripe from "stripe";
import { config } from "../config.js";
import {
  findApiKeyByStripeCustomerId,
  updatePlan,
  updateStripeInfo,
  suspendKey,
  activateKey,
} from "../db.js";
import type { ApiKeyRow } from "../db.js";

const billingRouter = new Hono();

function getStripe(): Stripe {
  return new Stripe(config.stripeSecretKey);
}

const PLAN_PRICES: Record<string, string> = {
  pro: config.stripePricePro,
  scale: config.stripePriceScale,
};

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

  if (!plan || !PLAN_PRICES[plan]) {
    return c.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid plan. Choose 'pro' or 'scale'." },
      },
      400
    );
  }

  const stripe = getStripe();

  // Create or reuse Stripe customer
  let customerId = apiKey.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: apiKey.user_email,
      metadata: { api_key_id: String(apiKey.id) },
    });
    customerId = customer.id;
    updateStripeInfo(apiKey.id, customerId, apiKey.stripe_subscription_id || "");
  }

  const priceId = PLAN_PRICES[plan];
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { api_key_id: String(apiKey.id), plan },
    success_url: `${c.req.url.split("/v1")[0]}/v1/docs?checkout=success`,
    cancel_url: `${c.req.url.split("/v1")[0]}/v1/docs?checkout=cancelled`,
  });

  return c.json({
    success: true,
    data: { checkoutUrl: session.url },
  });
});

billingRouter.post("/v1/billing/webhook", async (c) => {
  const stripe = getStripe();
  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ success: false, error: { code: "INVALID_SIGNATURE", message: "Missing stripe-signature header" } }, 400);
  }

  const rawBody = await c.req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
  } catch {
    return c.json({ success: false, error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" } }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const apiKeyId = parseInt(session.metadata?.api_key_id || "0", 10);
      const plan = session.metadata?.plan;
      if (apiKeyId && plan) {
        updatePlan(apiKeyId, plan);
        if (session.customer && session.subscription) {
          updateStripeInfo(
            apiKeyId,
            session.customer as string,
            session.subscription as string
          );
        }
        activateKey(apiKeyId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const keyRow = findApiKeyByStripeCustomerId(customerId);
      if (keyRow) {
        // Check if subscription has a plan metadata or derive from price
        const item = subscription.items.data[0];
        if (item) {
          const priceId = item.price.id;
          let newPlan: string | null = null;
          if (priceId === config.stripePricePro) newPlan = "pro";
          else if (priceId === config.stripePriceScale) newPlan = "scale";
          if (newPlan) {
            updatePlan(keyRow.id, newPlan);
          }
        }
        if (subscription.status === "active") {
          activateKey(keyRow.id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const keyRow = findApiKeyByStripeCustomerId(customerId);
      if (keyRow) {
        updatePlan(keyRow.id, "free");
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const keyRow = findApiKeyByStripeCustomerId(customerId);
      if (keyRow) {
        suspendKey(keyRow.id);
      }
      break;
    }
  }

  return c.json({ received: true });
});

export { billingRouter };
