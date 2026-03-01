import type { Context, Next } from "hono";
import { recordUsage } from "../db.js";
import type { ApiKeyRow } from "../db.js";

export async function usageTrackingMiddleware(c: Context, next: Next): Promise<Response | void> {
  const startTime = Date.now();

  await next();

  // Only track for DB-authenticated keys (skip admin/env keys)
  const apiKey = c.get("apiKey") as ApiKeyRow | undefined;
  if (!apiKey) {
    return;
  }

  const path = new URL(c.req.url).pathname;
  const responseTimeMs = Date.now() - startTime;

  try {
    recordUsage(apiKey.id, path, responseTimeMs);
  } catch {
    // Don't fail the request if usage tracking fails
    console.error("Failed to record usage for key", apiKey.id);
  }
}
