import YahooFinance from "yahoo-finance2";

export interface StockQuoteInput {
  symbol: string;
  type: "quote" | "history";
}

export interface ExchangeRateInput {
  from: string;
  to: string;
  amount: number;
}

export interface StockQuoteResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: string;
  exchange: string;
}

export interface StockHistoryResult {
  symbol: string;
  history: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface ExchangeRateResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

// Instantiate yahoo-finance2 v3 with suppressed notices
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

export async function getStockQuote(input: StockQuoteInput): Promise<StockQuoteResult | StockHistoryResult> {
  const { symbol, type } = input;

  try {
    if (type === "quote") {
      const result = await yahooFinance.quote(symbol);
      return {
        symbol: result.symbol,
        name: result.shortName || result.longName || symbol,
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        currency: result.currency || "USD",
        marketState: result.marketState || "unknown",
        exchange: result.fullExchangeName || result.exchange || "unknown",
      };
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const result = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
      });

      return {
        symbol,
        history: result.map((row) => ({
          date: row.date.toISOString().split("T")[0],
          open: row.open,
          high: row.high,
          low: row.low,
          close: row.close,
          volume: row.volume,
        })),
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Yahoo Finance error for ${symbol}: ${message}`);
  }
}

export async function getExchangeRate(input: ExchangeRateInput): Promise<ExchangeRateResult> {
  const { from, to, amount } = input;

  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Exchange rate API returned status ${response.status}`);
  }

  const data = await response.json() as {
    base: string;
    date: string;
    rates: Record<string, number>;
  };

  const result = data.rates[to];
  if (result === undefined) {
    throw new Error(`No exchange rate found for ${from} to ${to}`);
  }

  return {
    from,
    to,
    amount,
    result,
    rate: result / amount,
    date: data.date,
  };
}
