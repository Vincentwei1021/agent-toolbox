import { Hono } from "hono";
import { createApiKey, findApiKeyByEmail, getMonthlyUsage, getEndpointBreakdown } from "../db.js";
import type { ApiKeyRow } from "../db.js";

const PLAN_LIMITS: Record<string, number> = {
  free: 1_000,
  builder: Infinity,
  pro: 50_000,
  scale: 500_000,
};

const authRouter = new Hono();

authRouter.post("/v1/auth/register", async (c) => {
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Valid email is required" } },
      400
    );
  }

  const existing = findApiKeyByEmail(email);
  if (existing) {
    return c.json({
      success: true,
      data: {
        apiKey: existing.key,
        plan: existing.plan,
        limits: { monthly: PLAN_LIMITS[existing.plan] ?? 0 },
      },
    });
  }

  const keyRow = createApiKey(email);
  return c.json(
    {
      success: true,
      data: {
        apiKey: keyRow.key,
        plan: keyRow.plan,
        limits: { monthly: PLAN_LIMITS[keyRow.plan] ?? 0 },
      },
    },
    201
  );
});

authRouter.get("/v1/auth/usage", async (c) => {
  const apiKey = (c as unknown as { get(key: string): unknown }).get("apiKey") as ApiKeyRow | undefined;
  if (!apiKey) {
    return c.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "DB-backed API key required" } },
      401
    );
  }

  const month = new Date().toISOString().slice(0, 7);
  const calls = getMonthlyUsage(apiKey.id, month);
  const limit = PLAN_LIMITS[apiKey.plan] ?? 0;
  const endpoints = getEndpointBreakdown(apiKey.id, month);

  return c.json({
    success: true,
    data: {
      plan: apiKey.plan,
      usage: {
        month,
        calls,
        limit: limit === Infinity ? "unlimited" : limit,
      },
      endpoints,
    },
  });
});

export { authRouter };
