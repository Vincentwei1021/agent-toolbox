import type { Context, Next } from "hono";
import { responseCache, CACHE_TTL, LRUCache } from "../services/cache.js";

export async function cacheMiddleware(c: Context, next: Next): Promise<Response | void> {
  // Only cache POST data endpoints
  const path = new URL(c.req.url).pathname;
  const ttl = CACHE_TTL[path];
  if (!ttl || c.req.method !== "POST") {
    return next();
  }

  // Respect Cache-Control: no-cache
  const cacheControl = c.req.header("Cache-Control") || "";
  if (cacheControl.includes("no-cache") || cacheControl.includes("no-store")) {
    return next();
  }

  // Build cache key from endpoint + body
  let body: Record<string, unknown> = {};
  try {
    body = await c.req.json();
    // Store body for downstream handlers
    c.set("parsedBody", body);
  } catch {
    return next();
  }

  const cacheKey = LRUCache.makeKey(path, body);
  const cached = responseCache.get(cacheKey);

  if (cached) {
    // Return cached response with header
    const response = cached as { status: number; body: unknown };
    c.header("X-Cache", "HIT");
    return c.json(response.body as Record<string, unknown>, response.status as 200);
  }

  // Miss — proceed, then cache the response
  c.header("X-Cache", "MISS");
  await next();

  // Only cache successful responses
  if (c.res && c.res.status >= 200 && c.res.status < 300) {
    try {
      const resBody = await c.res.clone().json();
      responseCache.set(cacheKey, { status: c.res.status, body: resBody }, ttl);
    } catch {
      // Can't cache non-JSON responses
    }
  }
}
