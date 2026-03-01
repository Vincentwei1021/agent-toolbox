import { Hono } from "hono";
import { getWeather } from "../services/weather.js";
import { successResponse, errorResponse } from "../utils/response.js";

const weatherRouter = new Hono();

weatherRouter.post("/v1/weather", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/weather";

  try {
    const body = await c.req.json();

    if (!body.location && (body.lat === undefined || body.lon === undefined)) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "Either 'location' (string) or 'lat' and 'lon' (numbers) must be provided", endpoint, startTime),
        400
      );
    }

    const result = await getWeather({
      location: body.location,
      lat: body.lat !== undefined ? Number(body.lat) : undefined,
      lon: body.lon !== undefined ? Number(body.lon) : undefined,
    });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Weather lookup failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "WEATHER_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { weatherRouter };
