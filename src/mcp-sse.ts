import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import type { IncomingMessage, ServerResponse } from "node:http";

import { searchDuckDuckGo } from "./services/search.js";
import { extractContent } from "./services/extract.js";
import { getWeather } from "./services/weather.js";
import { getStockQuote, getExchangeRate } from "./services/finance.js";
import { takeScreenshot } from "./services/screenshot.js";
import { validateEmail } from "./services/email.js";
import { translateText, translateBatch } from "./services/translate.js";
import { lookupGeoIp } from "./services/geoip.js";
import { searchNews } from "./services/news.js";

// Track active transports by sessionId
const transports = new Map<string, SSEServerTransport>();

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "agent-toolbox",
    version: "1.0.0",
  });

  server.tool(
    "search",
    "Search the web using DuckDuckGo",
    { query: z.string(), count: z.number().min(1).max(10).default(5), lang: z.string().default("en") },
    async ({ query, count, lang }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await searchDuckDuckGo({ query, count, lang }), null, 2) }],
    })
  );

  server.tool(
    "extract",
    "Extract readable content from a web page",
    { url: z.string().url(), format: z.enum(["markdown", "text", "json"]).default("markdown") },
    async ({ url, format }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await extractContent({ url, format }), null, 2) }],
    })
  );

  server.tool(
    "weather",
    "Get weather forecast for a location",
    { location: z.string().optional(), lat: z.number().optional(), lon: z.number().optional() },
    async ({ location, lat, lon }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await getWeather({ location, lat, lon }), null, 2) }],
    })
  );

  server.tool(
    "finance",
    "Get stock quotes or exchange rates",
    {
      symbol: z.string().optional(),
      type: z.enum(["quote", "history"]).default("quote"),
      from: z.string().optional(),
      to: z.string().optional(),
      amount: z.number().default(1),
    },
    async ({ symbol, type, from, to, amount }) => {
      const result = from && to
        ? await getExchangeRate({ from, to, amount })
        : symbol
          ? await getStockQuote({ symbol, type })
          : (() => { throw new Error("Provide 'symbol' or 'from'+'to'"); })();
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "screenshot",
    "Take a screenshot of a web page",
    {
      url: z.string().url(),
      width: z.number().min(320).max(1920).default(1280),
      height: z.number().min(240).max(1080).default(720),
      fullPage: z.boolean().default(false),
    },
    async ({ url, width, height, fullPage }) => {
      const result = await takeScreenshot({ url, width, height, fullPage });
      return { content: [{ type: "image" as const, data: result.base64, mimeType: "image/png" }] };
    }
  );

  server.tool(
    "validate_email",
    "Validate an email address (syntax, MX, SMTP, disposable detection)",
    { email: z.string().email() },
    async ({ email }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await validateEmail(email), null, 2) }],
    })
  );

  server.tool(
    "translate",
    "Translate text between 100+ languages",
    {
      text: z.string().optional(),
      texts: z.array(z.string()).optional(),
      target: z.string(),
      source: z.string().default("auto"),
      glossary: z.record(z.string(), z.string()).optional(),
    },
    async ({ text, texts, target, source, glossary }) => {
      if (texts && texts.length > 0) {
        const result = await translateBatch(texts, target, source, glossary as Record<string, string> | undefined);
        return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
      }
      const result = await translateText(text || "", target, source, glossary as Record<string, string> | undefined);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "geoip",
    "IP geolocation lookup — country, city, coordinates, timezone, ISP",
    { ip: z.string() },
    async ({ ip }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await lookupGeoIp({ ip }), null, 2) }],
    })
  );


  server.tool(
    "news",
    "Search news articles from Google News",
    {
      query: z.string().describe("News search query"),
      language: z.string().default("en").describe("Language code"),
      country: z.string().default("us").describe("Country code"),
      category: z.enum(["business", "technology", "science", "health", "sports", "entertainment", "general"]).optional().describe("News category"),
      limit: z.number().min(1).max(50).default(10).describe("Number of results"),
    },
    async ({ query, language, country, category, limit }) => ({
      content: [{ type: "text" as const, text: JSON.stringify(await searchNews({ query, language, country, category, limit }), null, 2) }],
    })
  );
  return server;
}

export async function handleSseRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  console.log(`[MCP-SSE] New SSE connection from ${req.socket.remoteAddress}`);

  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);

  const server = createMcpServer();

  res.on("close", () => {
    console.log(`[MCP-SSE] Session ${sessionId} closed`);
    transports.delete(sessionId);
  });

  await server.connect(transport);
}

export async function handleMessageRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    res.writeHead(400).end("Missing sessionId");
    return;
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    res.writeHead(404).end("Session not found");
    return;
  }

  await transport.handlePostMessage(req, res);
}
