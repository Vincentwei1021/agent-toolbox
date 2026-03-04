# URGENT TASK: Add MCP SSE Transport + Query Param Auth

## Context
Smithery requires SSE transport to connect to our MCP server. Currently we only have Stdio transport (mcp-server.ts). Our HTTP API (Hono) has no SSE endpoint. Vincent is blocked waiting for this.

## Step 1: Auth middleware — support query param apiKey
File: src/middleware/auth.ts
Add fallback: if no Authorization header exists, check for query param apiKey from the URL and treat it as Bearer token. Smithery passes auth as ?apiKey=xxx.

## Step 2: Create MCP SSE route  
Create: src/routes/mcp-sse.ts
- Use SSEServerTransport from @modelcontextprotocol/sdk/server/sse.js
- Create an McpServer with all tools (search, extract, weather, finance, screenshot, validate-email, translate, geoip)
- Reference existing service implementations in src/services/
- Expose GET /sse for SSE connection and POST /messages for client messages
- Must work with Hono framework

## Step 3: Mount in index.ts
Import and mount the new MCP SSE route.

## Step 4: Build + Deploy
- npm run build
- pm2 restart agent-toolbox
- Verify with curl

## DO NOT break existing REST API endpoints!
