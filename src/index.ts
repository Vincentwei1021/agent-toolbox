import { Hono } from "hono";
import { getRequestListener } from "@hono/node-server";
import { createServer } from "node:http";
import { config } from "./config.js";
import { getDb } from "./db.js";
import { migrateUsageTable } from "./db.js";
import { authMiddleware } from "./middleware/auth.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { usageTrackingMiddleware } from "./middleware/usageTracking.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { cacheMiddleware } from "./middleware/cache.js";
import { timeoutMiddleware } from "./middleware/timeout.js";
import { healthRouter } from "./routes/health.js";
import { searchRouter } from "./routes/search.js";
import { extractRouter } from "./routes/extract.js";
import { weatherRouter } from "./routes/weather.js";
import { financeRouter } from "./routes/finance.js";
import { screenshotRouter } from "./routes/screenshot.js";
import { docsRouter } from "./routes/docs.js";
import { authRouter } from "./routes/auth.js";
import { billingRouter } from "./routes/billing.js";
import { landingRouter } from "./routes/landing.js";
import { emailRouter } from "./routes/email.js";
import { translateRouter } from "./routes/translate.js";
import { geoipRouter } from "./routes/geoip.js";
import { newsRouter } from "./routes/news.js";
import { whoisRouter } from "./routes/whois.js";
import { dnsRouter } from "./routes/dns.js";
import { pdfExtractRouter } from "./routes/pdfExtract.js";
import { qrcodeRouter } from "./routes/qrcode.js";
import { usageRouter } from "./routes/usage.js";
import { playgroundRouter } from "./routes/playground.js";
import { docsPageRouter } from "./routes/docsPage.js";
import { seoRouter } from "./routes/seo.js";
import { serverCardRouter } from "./routes/serverCard.js";
import { closeBrowser } from "./services/browser.js";
import { handleSseRequest, handleMessageRequest } from "./mcp-sse.js";

// Initialize database on startup
getDb();
migrateUsageTable();

const app = new Hono();

// Middleware
app.use("*", loggerMiddleware);
app.use("*", authMiddleware);
app.use("*", rateLimitMiddleware);
app.use("*", timeoutMiddleware);
app.use("*", cacheMiddleware);
app.use("*", usageTrackingMiddleware);

// Routes
app.route("/", landingRouter);
app.route("/", healthRouter);
app.route("/", authRouter);
app.route("/", billingRouter);
app.route("/", searchRouter);
app.route("/", extractRouter);
app.route("/", weatherRouter);
app.route("/", financeRouter);
app.route("/", screenshotRouter);
app.route("/", emailRouter);
app.route("/", translateRouter);
app.route("/", geoipRouter);
app.route("/", newsRouter);
app.route("/", whoisRouter);
app.route("/", dnsRouter);
app.route("/", pdfExtractRouter);
app.route("/", qrcodeRouter);
app.route("/", usageRouter);
app.route("/", playgroundRouter);
app.route("/", docsPageRouter);
app.route("/", seoRouter);
app.route("/", serverCardRouter);
app.route("/", docsRouter);

// Error handler
app.onError(errorHandler);

// Hono request handler for Node.js
const honoListener = getRequestListener(app.fetch);

// Raw Node HTTP server — intercepts MCP SSE paths, delegates rest to Hono
const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;

  // CORS preflight for MCP endpoints
  if ((path === "/sse" || path === "/messages") && req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  // MCP SSE connection
  if (path === "/sse" && req.method === "GET") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    try {
      await handleSseRequest(req, res);
    } catch (err) {
      console.error("[MCP-SSE] Error:", err);
      if (!res.headersSent) res.writeHead(500).end("Internal error");
    }
    return;
  }

  // MCP message endpoint
  if (path === "/messages" && req.method === "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      await handleMessageRequest(req, res);
    } catch (err) {
      console.error("[MCP-SSE] Message error:", err);
      if (!res.headersSent) res.writeHead(500).end("Internal error");
    }
    return;
  }

  // Everything else → Hono
  honoListener(req, res);
});

server.listen(config.port, () => {
  console.log(`Agent Toolbox API running on http://localhost:${config.port}`);
  console.log(`MCP SSE endpoint: http://localhost:${config.port}/sse`);
  console.log(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
function shutdown() {
  console.log("Shutting down...");
  closeBrowser()
    .then(() => {
      server.close();
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
