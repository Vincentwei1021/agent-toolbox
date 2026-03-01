import { Hono } from "hono";
import { getStockQuote, getExchangeRate } from "../services/finance.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { requireString, optionalNumber } from "../utils/validation.js";

const financeRouter = new Hono();

financeRouter.post("/v1/finance", async (c) => {
  const startTime = Date.now();
  const endpoint = "/v1/finance";

  try {
    const body = await c.req.json();

    // Exchange rate mode
    if (body.from && body.to) {
      const from = requireString(body.from, "from");
      const to = requireString(body.to, "to");
      const amount = optionalNumber(body.amount, 1, 0.01, 1_000_000_000);
      const result = await getExchangeRate({ from, to, amount });
      return c.json(successResponse(result, endpoint, startTime));
    }

    // Stock mode
    if (body.symbol) {
      const symbol = requireString(body.symbol, "symbol");
      const type = (body.type === "history" ? "history" : "quote") as "quote" | "history";
      const result = await getStockQuote({ symbol, type });
      return c.json(successResponse(result, endpoint, startTime));
    }

    return c.json(
      errorResponse("VALIDATION_ERROR", "Provide 'symbol' for stock data or 'from'+'to' for exchange rates", endpoint, startTime),
      400
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Finance lookup failed";
    const code = err instanceof Error && err.name === "ValidationError" ? "VALIDATION_ERROR" : "FINANCE_ERROR";
    const status = code === "VALIDATION_ERROR" ? 400 : 500;
    return c.json(errorResponse(code, message, endpoint, startTime), status);
  }
});

export { financeRouter };
