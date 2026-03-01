import type { Context, Next } from "hono";

function maskKey(key: string | undefined): string {
  if (!key) return "none";
  if (key.length <= 8) return "***";
  return key.slice(0, 4) + "***" + key.slice(-4);
}

export async function loggerMiddleware(c: Context, next: Next): Promise<void> {
  const start = Date.now();
  await next();
  const latency = Date.now() - start;

  const authHeader = c.req.header("Authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const path = new URL(c.req.url).pathname;

  console.log(
    `${c.req.method} ${path} ${c.res.status} ${latency}ms key=${maskKey(apiKey)}`
  );
}
