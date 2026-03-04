import { Hono } from "hono";
import { searchNews } from "../services/news.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalString, optionalNumber } from "../utils/validation.js";

const newsRouter = new Hono();

newsRouter.post("/v1/news", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/news";

  try {
    const body = await c.req.json();
    const query = requireString(body.query, "query");
    const language = optionalString(body.language, "en");
    const country = optionalString(body.country, "us");
    const category = body.category ? optionalString(body.category, "") : undefined;
    const limit = optionalNumber(body.limit, 10, 1, 50);

    const result = await searchNews({ query, language, country, category, limit });
    return c.json(successResponse(result, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "News search failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "NEWS_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { newsRouter };
