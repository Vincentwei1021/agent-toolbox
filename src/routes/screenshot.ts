import { Hono } from "hono";
import { takeScreenshot } from "../services/screenshot.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalNumber, optionalBoolean } from "../utils/validation.js";

const screenshotRouter = new Hono();

screenshotRouter.post("/v1/screenshot", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/screenshot";

  try {
    const body = await c.req.json();
    const url = requireString(body.url, "url");
    const width = optionalNumber(body.width, 1280, 320, 1920);
    const height = optionalNumber(body.height, 720, 240, 1080);
    const fullPage = optionalBoolean(body.fullPage, false);

    const result = await takeScreenshot({ url, width, height, fullPage });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Screenshot failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "SCREENSHOT_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { screenshotRouter };
