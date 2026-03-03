import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { config } from "./config.js";
import { getDb } from "./db.js";
import { migrateUsageTable } from "./db.js";
import { authMiddleware } from "./middleware/auth.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { usageTrackingMiddleware } from "./middleware/usageTracking.js";
import { errorHandler } from "./middleware/errorHandler.js";
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
import { usageRouter } from "./routes/usage.js";
import { closeBrowser } from "./services/browser.js";

// Initialize database on startup
getDb();
migrateUsageTable();

const app = new Hono();

// Middleware
app.use("*", loggerMiddleware);
app.use("*", authMiddleware);
app.use("*", rateLimitMiddleware);
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
app.route("/", usageRouter);
app.route("/", docsRouter);

// Error handler
app.onError(errorHandler);

// Start server
const server = serve({
  fetch: app.fetch,
  port: config.port,
});

console.log(`Agent Toolbox API running on http://localhost:${config.port}`);
console.log(`Environment: ${config.nodeEnv}`);

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
