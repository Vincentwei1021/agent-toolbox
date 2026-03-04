import type { Context, Next } from "hono";
import { config } from "../config.js";
import { errorResponse } from "../utils/response.js";
import { findApiKeyByKey, getMonthlyUsage } from "../db.js";
import type { ApiKeyRow } from "../db.js";

const PUBLIC_PATHS = ["/health", "/v1/docs", "/v1/auth/register", "/v1/billing/webhook", "/v1/usage/summary", "/playground", "/docs", "/", "/sse", "/messages", "/.well-known/mcp/server-card.json"];

const PLAN_LIMITS: Record<string, number> = {
  free: 1_000,
  builder: Infinity,
  pro: 50_000,
  scale: 500_000,
};

export async function authMiddleware(c: Context, next: Next): Promise<Response | void> {
  const url = new URL(c.req.url);
  const path = url.pathname;

  if (PUBLIC_PATHS.includes(path)) {
    return next();
  }

  // Try Authorization header first, then fall back to ?apiKey= query param
  let key: string | undefined;
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    key = authHeader.slice(7);
  } else {
    key = url.searchParams.get("apiKey") || undefined;
  }

  if (!key) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Missing or invalid Authorization header", path, Date.now()),
      401
    );
  }

  // Admin/env key fallback — treat as unlimited
  if (config.apiKeys.includes(key)) {
    c.set("isAdminKey", true);
    return next();
  }

  // DB-backed key lookup
  const keyRow = findApiKeyByKey(key);
  if (!keyRow) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Invalid API key", path, Date.now()),
      401
    );
  }

  if (keyRow.status !== "active") {
    return c.json(
      errorResponse("UNAUTHORIZED", "API key is suspended", path, Date.now()),
      403
    );
  }

  // Check monthly usage limits
  const limit = PLAN_LIMITS[keyRow.plan] ?? 0;
  const used = getMonthlyUsage(keyRow.id);

  if (used >= limit) {
    return c.json(
      {
        success: false,
        error: {
          code: "USAGE_LIMIT_EXCEEDED",
          message: `Monthly usage limit exceeded. Current plan: ${keyRow.plan}. Upgrade at /v1/billing/checkout`,
          limit,
          used,
        },
      },
      429
    );
  }

  c.set("apiKey", keyRow as ApiKeyRow);
  return next();
}
