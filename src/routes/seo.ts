import { Hono } from "hono";

const seoRouter = new Hono();

const BASE_URL = "https://api.toolboxlite.com";

seoRouter.get("/robots.txt", (c) => {
  c.header("Content-Type", "text/plain");
  return c.body(`User-agent: *
Allow: /
Allow: /docs
Allow: /playground
Allow: /openapi.json

Sitemap: ${BASE_URL}/sitemap.xml

# Agent Toolbox API — 13 tools for AI agents
# https://github.com/Vincentwei1021/agent-toolbox
`);
});

seoRouter.get("/sitemap.xml", (c) => {
  const now = new Date().toISOString().split("T")[0];
  c.header("Content-Type", "application/xml");
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/docs</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/playground</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/openapi.json</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`);
});

export { seoRouter };
