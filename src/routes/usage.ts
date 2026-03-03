import { Hono } from "hono";
import { config } from "../config.js";
import {
  getMonthlyUsage,
  getEndpointBreakdown,
  getDailyTrend,
  getStatusCodeBreakdown,
  getGlobalSummary,
} from "../db.js";
import type { ApiKeyRow } from "../db.js";

const PLAN_LIMITS: Record<string, number> = {
  free: 1_000,
  builder: Infinity,
  pro: 50_000,
  scale: 500_000,
};

const usageRouter = new Hono();

// Per-user usage analytics
usageRouter.get("/v1/usage", async (c) => {
  const apiKey = (c as unknown as { get(key: string): unknown }).get("apiKey") as ApiKeyRow | undefined;
  if (!apiKey) {
    return c.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "DB-backed API key required" } },
      401
    );
  }

  const month = (c.req.query("month") || new Date().toISOString().slice(0, 7));
  const calls = getMonthlyUsage(apiKey.id, month);
  const limit = PLAN_LIMITS[apiKey.plan] ?? 0;
  const endpoints = getEndpointBreakdown(apiKey.id, month);
  const daily = getDailyTrend(apiKey.id, month);
  const statusCodes = getStatusCodeBreakdown(apiKey.id, month);

  return c.json({
    success: true,
    data: {
      plan: apiKey.plan,
      month,
      total_calls: calls,
      limit: limit === Infinity ? "unlimited" : limit,
      remaining: limit === Infinity ? "unlimited" : Math.max(0, limit - calls),
      endpoints,
      status_codes: statusCodes,
      daily_trend: daily,
    },
  });
});

// Admin-only global summary
usageRouter.get("/v1/usage/summary", async (c) => {
  // Check for admin key (env API_KEYS)
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "") || "";
  const adminKeys = config.apiKeys as string[];

  if (!adminKeys.includes(token)) {
    return c.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
      403
    );
  }

  const summary = getGlobalSummary();

  return c.json({
    success: true,
    data: summary,
  });
});

export { usageRouter };
