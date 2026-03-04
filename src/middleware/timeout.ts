import type { Context, Next } from "hono";

const REQUEST_TIMEOUT_MS = 30_000;

export async function timeoutMiddleware(c: Context, next: Next): Promise<Response | void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const result = await Promise.race([
      next(),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(new Error("TIMEOUT"));
        });
      }),
    ]);
    clearTimeout(timer);
    return result;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.message === "TIMEOUT") {
      return c.json(
        {
          success: false,
          error: {
            code: "TIMEOUT",
            message: "Request timed out after 30 seconds",
          },
        },
        504
      );
    }
    throw err;
  }
}
