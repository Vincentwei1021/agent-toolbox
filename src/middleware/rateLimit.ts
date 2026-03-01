import type { Context, Next } from "hono";
import { errorResponse } from "../utils/response.js";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const limits = new Map<string, RateLimitEntry>();
const MAX_REQUESTS = 60;
const WINDOW_MS = 60_000;

export async function rateLimitMiddleware(c: Context, next: Next): Promise<Response | void> {
  const authHeader = c.req.header("Authorization");
  const key = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "anonymous";
  const now = Date.now();
  const path = new URL(c.req.url).pathname;

  let entry = limits.get(key);
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + WINDOW_MS };
    limits.set(key, entry);
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return c.json(
      errorResponse("RATE_LIMIT_EXCEEDED", "Too many requests. Limit: 60 per minute.", path, Date.now()),
      429
    );
  }

  return next();
}
