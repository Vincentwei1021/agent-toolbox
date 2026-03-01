import type { Context } from "hono";
import { errorResponse } from "../utils/response.js";
import { ValidationError } from "../utils/validation.js";

export function errorHandler(err: Error, c: Context): Response {
  const path = new URL(c.req.url).pathname;

  if (err instanceof ValidationError) {
    return c.json(
      errorResponse("VALIDATION_ERROR", err.message, path, Date.now()),
      400
    );
  }

  console.error(`Unhandled error: ${err.message}`, err.stack);
  return c.json(
    errorResponse("INTERNAL_ERROR", "An unexpected error occurred", path, Date.now()),
    500
  );
}
