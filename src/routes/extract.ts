import { Hono } from "hono";
import { extractContent } from "../services/extract.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalString } from "../utils/validation.js";

const extractRouter = new Hono();

extractRouter.post("/v1/extract", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/extract";

  try {
    const body = await c.req.json();
    const url = requireString(body.url, "url");
    const format = optionalString(body.format, "markdown") as "markdown" | "text" | "json";

    if (!["markdown", "text", "json"].includes(format)) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "format must be 'markdown', 'text', or 'json'", endpoint, startTime),
        400
      );
    }

    const result = await extractContent({ url, format });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "EXTRACT_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { extractRouter };
