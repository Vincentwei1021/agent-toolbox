import { Hono } from "hono";
import { openApiSpec } from "../openapi.js";

const docsRouter = new Hono();

docsRouter.get("/v1/docs", (c) => {
  return c.json(openApiSpec);
});

docsRouter.get("/openapi.json", (c) => {
  return c.json(openApiSpec);
});

export { docsRouter };