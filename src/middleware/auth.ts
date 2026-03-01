import type { Context, Next } from "hono";
import { config } from "../config.js";
import { errorResponse } from "../utils/response.js";

const PUBLIC_PATHS = ["/health", "/v1/docs"];

export async function authMiddleware(c: Context, next: Next): Promise<Response | void> {
  const path = new URL(c.req.url).pathname;

  if (PUBLIC_PATHS.includes(path)) {
    return next();
  }

  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Missing or invalid Authorization header", path, Date.now()),
      401
    );
  }

  const key = authHeader.slice(7);
  if (!config.apiKeys.includes(key)) {
    return c.json(
      errorResponse("UNAUTHORIZED", "Invalid API key", path, Date.now()),
      401
    );
  }

  return next();
}
