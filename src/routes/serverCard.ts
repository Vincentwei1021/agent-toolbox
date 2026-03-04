import { Hono } from "hono";

export const serverCardRouter = new Hono();

serverCardRouter.get("/.well-known/mcp/server-card.json", (c) => {
  return c.json({
    serverInfo: {
      name: "agent-toolbox",
      version: "1.0.0",
    },
    tools: [
      {
        name: "search",
        description: "Search the web using DuckDuckGo. Returns titles, URLs, and snippets.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            count: { type: "number", description: "Number of results (1-10)", default: 5 },
            lang: { type: "string", description: "Language code", default: "en" },
          },
          required: ["query"],
        },
      },
      {
        name: "extract",
        description: "Extract readable content from any web page using Mozilla Readability.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL to extract content from" },
            format: { type: "string", enum: ["markdown", "text", "json"], default: "markdown" },
          },
          required: ["url"],
        },
      },
      {
        name: "screenshot",
        description: "Capture screenshots of any web page as PNG.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "URL to screenshot" },
            width: { type: "number", default: 1280 },
            height: { type: "number", default: 720 },
          },
          required: ["url"],
        },
      },
      {
        name: "weather",
        description: "Get current conditions and 7-day forecasts for any location worldwide.",
        inputSchema: {
          type: "object",
          properties: {
            location: { type: "string", description: "City name or coordinates" },
          },
          required: ["location"],
        },
      },
      {
        name: "finance",
        description: "Real-time stock quotes, historical data, and currency exchange rates.",
        inputSchema: {
          type: "object",
          properties: {
            symbol: { type: "string", description: "Stock ticker or currency pair" },
            type: { type: "string", enum: ["quote", "history", "exchange"], default: "quote" },
          },
          required: ["symbol"],
        },
      },
      {
        name: "validate_email",
        description: "Validate email addresses for format, DNS, and deliverability.",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string", description: "Email address to validate" },
          },
          required: ["email"],
        },
      },
      {
        name: "translate",
        description: "Translate text between any languages.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to translate" },
            to: { type: "string", description: "Target language code" },
            from: { type: "string", description: "Source language code (auto-detect if omitted)" },
          },
          required: ["text", "to"],
        },
      },
      {
        name: "geoip",
        description: "Look up geographic location information for an IP address.",
        inputSchema: {
          type: "object",
          properties: {
            ip: { type: "string", description: "IP address to look up" },
          },
          required: ["ip"],
        },
      },
    ],
    resources: [],
    prompts: [],
  });
});
