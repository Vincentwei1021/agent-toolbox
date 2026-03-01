import { Hono } from "hono";
import { config } from "../config.js";

const healthRouter = new Hono();

const startedAt = Date.now();

healthRouter.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: Math.round((Date.now() - startedAt) / 1000),
    version: config.version,
    timestamp: new Date().toISOString(),
  });
});

export { healthRouter };
