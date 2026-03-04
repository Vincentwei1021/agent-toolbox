import { Hono } from "hono";
import { lookupGeoIp } from "../services/geoip.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString } from "../utils/validation.js";

const geoipRouter = new Hono();

geoipRouter.post("/v1/geoip", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/geoip";

  try {
    const body = await c.req.json();
    const ip = requireString(body.ip, "ip");

    const result = await lookupGeoIp({ ip });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "GeoIP lookup failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "GEOIP_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { geoipRouter };
