import { Hono } from "hono";
import { lookupWhois } from "../services/whois.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString } from "../utils/validation.js";

const whoisRouter = new Hono();

whoisRouter.post("/v1/whois", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/whois";
  try {
    const body = await c.req.json();
    const domain = requireString(body.domain, "domain");
    const result = await lookupWhois({ domain });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "WHOIS lookup failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "WHOIS_ERROR";
    return c.json(errorResponse(code, message, endpoint, startTime), code === "VALIDATION_ERROR" ? 400 : 500);
  }
});

export { whoisRouter };
