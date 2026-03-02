import { Hono } from "hono";
import { translateText, translateBatch } from "../services/translate.js";
import { successResponse, errorResponse } from "../utils/response.js";

const translateRouter = new Hono();

translateRouter.post("/v1/translate", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/translate";

  try {
    const body = await c.req.json();
    const target = typeof body.target === "string" ? body.target.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "auto";
    const glossary = body.glossary && typeof body.glossary === "object" ? body.glossary as Record<string, string> : undefined;

    if (!target) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "Target language code is required (e.g. 'zh', 'es', 'ja')", endpoint, startTime),
        400
      );
    }

    // Batch mode
    if (Array.isArray(body.texts)) {
      const texts = body.texts.filter((t: unknown) => typeof t === "string") as string[];
      if (texts.length === 0) {
        return c.json(
          errorResponse("VALIDATION_ERROR", "texts array must contain at least one string", endpoint, startTime),
          400
        );
      }
      if (texts.length > 20) {
        return c.json(
          errorResponse("VALIDATION_ERROR", "Maximum 20 texts per batch request", endpoint, startTime),
          400
        );
      }
      const result = await translateBatch(texts, target, source, glossary);
      return c.json(successResponse(result, endpoint, startTime));
    }

    // Single mode
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "Either 'text' (string) or 'texts' (array) is required", endpoint, startTime),
        400
      );
    }
    if (text.length > 5000) {
      return c.json(
        errorResponse("VALIDATION_ERROR", "Text exceeds maximum length of 5000 characters", endpoint, startTime),
        400
      );
    }

    const result = await translateText(text, target, source, glossary);
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return c.json(errorResponse("TRANSLATE_ERROR", message, endpoint, startTime), 500);
  }
});

export { translateRouter };
