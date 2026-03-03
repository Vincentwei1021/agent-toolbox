import type { Context, Next } from "hono";
import { recordUsage } from "../db.js";
import type { ApiKeyRow } from "../db.js";

// Paths that should not count toward usage quota
const EXCLUDED_PATHS = [
  "/v1/auth/register",
  "/v1/auth/usage",
  "/v1/usage",
  "/v1/usage/summary",
  "/v1/billing/checkout",
  "/v1/billing/webhook",
  "/v1/docs",
  "/health",
];

export async function usageTrackingMiddleware(c: Context, next: Next): Promise<Response | void> {
  const startTime = Date.now();

  await next();

  // Only track for DB-authenticated keys (skip admin/env keys)
  const apiKey = c.get("apiKey") as ApiKeyRow | undefined;
  if (!apiKey) {
    return;
  }

  const path = new URL(c.req.url).pathname;

  // Skip non-data endpoints from usage tracking
  if (EXCLUDED_PATHS.includes(path)) {
    return;
  }

  const responseTimeMs = Date.now() - startTime;
  const statusCode = c.res?.status ?? 0;
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";
  const userAgent = c.req.header("user-agent") || "";

  try {
    recordUsage(apiKey.id, path, responseTimeMs, statusCode, ip, userAgent);
  } catch {
    console.error("Failed to record usage for key", apiKey.id);
  }
}
