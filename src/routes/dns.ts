import { Hono } from "hono";
import { lookupDns } from "../services/dns.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalString } from "../utils/validation.js";

const dnsRouter = new Hono();

dnsRouter.post("/v1/dns", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/dns";
  try {
    const body = await c.req.json();
    const domain = requireString(body.domain, "domain");
    const type = optionalString(body.type, "A");
    const result = await lookupDns({ domain, type });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "DNS lookup failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "DNS_ERROR";
    return c.json(errorResponse(code, message, endpoint, startTime), code === "VALIDATION_ERROR" ? 400 : 500);
  }
});

export { dnsRouter };
