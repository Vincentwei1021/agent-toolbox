import { Hono } from "hono";
import { validateEmail } from "../services/email.js";
import { successResponse, errorResponse } from "../utils/response.js";

const emailRouter = new Hono();

emailRouter.post("/v1/validate-email", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/validate-email";

  try {
    const body = await c.req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "Email is required", endpoint, startTime),
        400
      );
    }

    const result = await validateEmail(email);
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email validation failed";
    return c.json(errorResponse("VALIDATION_ERROR", message, endpoint, startTime), 500);
  }
});

export { emailRouter };
