import { Hono } from "hono";
import { extractPdf } from "../services/pdfExtract.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalNumber } from "../utils/validation.js";

const pdfExtractRouter = new Hono();

pdfExtractRouter.post("/v1/pdf-extract", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/pdf-extract";
  try {
    const body = await c.req.json();
    const url = requireString(body.url, "url");
    const maxPages = body.maxPages ? optionalNumber(body.maxPages, 0, 1, 500) : undefined;
    const result = await extractPdf({ url, maxPages });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF extraction failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "PDF_ERROR";
    return c.json(errorResponse(code, message, endpoint, startTime), code === "VALIDATION_ERROR" ? 400 : 500);
  }
});

export { pdfExtractRouter };
