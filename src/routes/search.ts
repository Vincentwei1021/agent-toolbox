import { Hono } from "hono";
import { searchDuckDuckGo } from "../services/search.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalNumber, optionalString } from "../utils/validation.js";

const searchRouter = new Hono();

searchRouter.post("/v1/search", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/search";

  try {
    const body = await c.req.json();
    const query = requireString(body.query, "query");
    const count = optionalNumber(body.count, 5, 1, 10);
    const lang = optionalString(body.lang, "en");

    const results = await searchDuckDuckGo({ query, count, lang });
    return c.json(successResponse(results, endpoint, startTime));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "SEARCH_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { searchRouter };
