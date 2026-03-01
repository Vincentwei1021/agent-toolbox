import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDuckDuckGo } from "./services/search.js";
import { extractContent } from "./services/extract.js";
import { getWeather } from "./services/weather.js";
import { getStockQuote, getExchangeRate } from "./services/finance.js";
import { takeScreenshot } from "./services/screenshot.js";

const server = new McpServer({
  name: "agent-toolbox",
  version: "1.0.0",
});

// Search tool
server.tool(
  "search",
  "Search the web using DuckDuckGo",
  {
    query: z.string().describe("Search query"),
    count: z.number().min(1).max(10).default(5).describe("Number of results"),
    lang: z.string().default("en").describe("Language code"),
  },
  async ({ query, count, lang }) => {
    const results = await searchDuckDuckGo({ query, count, lang });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
    };
  }
);

// Extract tool
server.tool(
  "extract",
  "Extract content from a web page using Readability",
  {
    url: z.string().url().describe("URL to extract content from"),
    format: z.enum(["markdown", "text", "json"]).default("markdown").describe("Output format"),
  },
  async ({ url, format }) => {
    const result = await extractContent({ url, format });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Weather tool
server.tool(
  "weather",
  "Get weather forecast for a location",
  {
    location: z.string().optional().describe("City or place name"),
    lat: z.number().optional().describe("Latitude"),
    lon: z.number().optional().describe("Longitude"),
  },
  async ({ location, lat, lon }) => {
    const result = await getWeather({ location, lat, lon });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Finance tool
server.tool(
  "finance",
  "Get stock quotes, history, or exchange rates",
  {
    symbol: z.string().optional().describe("Stock ticker symbol"),
    type: z.enum(["quote", "history"]).default("quote").describe("Data type for stocks"),
    from: z.string().optional().describe("Source currency for exchange rate"),
    to: z.string().optional().describe("Target currency for exchange rate"),
    amount: z.number().default(1).describe("Amount to convert"),
  },
  async ({ symbol, type, from, to, amount }) => {
    let result;
    if (from && to) {
      result = await getExchangeRate({ from, to, amount });
    } else if (symbol) {
      result = await getStockQuote({ symbol, type });
    } else {
      throw new Error("Provide 'symbol' for stock data or 'from'+'to' for exchange rates");
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Screenshot tool
server.tool(
  "screenshot",
  "Take a screenshot of a web page",
  {
    url: z.string().url().describe("URL to screenshot"),
    width: z.number().min(320).max(1920).default(1280).describe("Viewport width"),
    height: z.number().min(240).max(1080).default(720).describe("Viewport height"),
    fullPage: z.boolean().default(false).describe("Capture full page"),
  },
  async ({ url, width, height, fullPage }) => {
    const result = await takeScreenshot({ url, width, height, fullPage });
    return {
      content: [
        {
          type: "image" as const,
          data: result.base64,
          mimeType: "image/png",
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Agent Toolbox MCP server started on stdio");
}

main().catch((err) => {
  console.error("MCP server error:", err);
  process.exit(1);
});
