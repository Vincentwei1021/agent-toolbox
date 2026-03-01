# Agent Toolbox API - Build Task

Build a complete REST API + MCP Server project from scratch in this directory.

## Project Setup

1. Initialize with `npm init -y`
2. Install dependencies
3. Use TypeScript with strict mode
4. Use **Hono** as the web framework (lightweight, fast)
5. `git init` with proper `.gitignore`

## Tech Stack

- Runtime: Node.js 24
- Framework: Hono
- Language: TypeScript
- Browser automation: Playwright (chromium)
- Content extraction: @mozilla/readability + turndown
- Finance: yahoo-finance2
- MCP: @modelcontextprotocol/sdk

## Dependencies to install

```bash
npm install hono @hono/node-server typescript @types/node tsx playwright @mozilla/readability turndown @types/turndown yahoo-finance2 uuid @types/uuid @modelcontextprotocol/sdk jsdom @types/jsdom zod
```

After install, run: `npx playwright install chromium --with-deps`

## Project Structure

```
src/
  index.ts          # Main entry, Hono app setup, middleware
  config.ts         # Environment config
  middleware/
    auth.ts         # API key auth middleware
    rateLimit.ts    # Rate limiting middleware
    logger.ts       # Request logger
    errorHandler.ts # Error handler
  routes/
    health.ts       # GET /health
    search.ts       # POST /v1/search
    extract.ts      # POST /v1/extract
    weather.ts      # POST /v1/weather
    finance.ts      # POST /v1/finance
    screenshot.ts   # POST /v1/screenshot
    docs.ts         # GET /v1/docs
  services/
    search.ts       # DuckDuckGo search logic
    extract.ts      # Playwright + Readability extraction
    weather.ts      # Open-Meteo API calls
    finance.ts      # Yahoo Finance + exchange rate
    screenshot.ts   # Playwright screenshot
    browser.ts      # Shared Playwright browser instance
  utils/
    response.ts     # Unified response helpers
    validation.ts   # Input validation helpers
  mcp-server.ts     # MCP server entry point
  openapi.ts        # OpenAPI spec as JS object
tsconfig.json
package.json
.env.example
.gitignore
README.md
ecosystem.config.js  # PM2 config
```

## Detailed Implementation

### src/config.ts
- Load env vars: PORT (default 3100), API_KEYS (comma-separated), NODE_ENV
- Export typed config object

### src/utils/response.ts
- `successResponse(data, endpoint, startTime)` returns `{ success: true, data, meta: { requestId, latencyMs, endpoint, timestamp } }`
- `errorResponse(code, message, endpoint, startTime)` returns `{ success: false, error: { code, message }, meta: { ... } }`
- Use `crypto.randomUUID()` for requestId

### src/middleware/auth.ts
- Check `Authorization: Bearer <key>` header
- Validate key against config.apiKeys array
- Return 401 if missing/invalid
- Skip auth for GET /health and GET /v1/docs

### src/middleware/rateLimit.ts
- Simple in-memory rate limiter using Map
- Key: API key, Value: { count, resetTime }
- 60 requests/minute per key
- Return 429 with RATE_LIMIT_EXCEEDED error

### src/middleware/logger.ts
- Log: method, path, status, latency, API key (masked)

### src/services/browser.ts
- Singleton pattern for Playwright browser
- `getBrowser()` returns shared chromium instance (lazy init)
- `closeBrowser()` cleanup on shutdown
- Launch args: `['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']`

### POST /v1/search
- Input: query (required string), count (1-10, default 5), lang (default "en")
- Use DuckDuckGo HTML: fetch `https://html.duckduckgo.com/html/?q=<query>&kl=<lang>`
- Parse HTML to extract results (title, url, snippet) - results in `<a class="result__a">` and snippets in `<a class="result__snippet">`
- Return structured results array with title, url, snippet fields

### POST /v1/extract
- Input: url (required), format ("markdown"|"text"|"json", default "markdown")
- Use shared Playwright browser, navigate with 30s timeout
- Get page HTML, use JSDOM + @mozilla/readability to extract content
- markdown: Turndown to convert; text: strip tags; json: structured output
- Metadata: title, description, author, publishedDate, siteName
- Truncate content to 50KB max
- Close page after extraction

### POST /v1/weather
- Input: location (string) OR lat+lon (numbers)
- Geocode via `https://geocoding-api.open-meteo.com/v1/search?name=<location>&count=1`
- Forecast: `https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`
- Map weather codes to descriptions
- Return structured current + daily forecast

### POST /v1/finance
- Stock mode: `{ symbol, type: "quote"|"history" }` - use yahoo-finance2
- Exchange mode: `{ from, to, amount }` - use `https://api.frankfurter.app/latest?from=X&to=Y&amount=Z`
- Handle yahoo-finance2 errors gracefully

### POST /v1/screenshot
- Input: url (required), width (default 1280, max 1920), height (default 720, max 1080), fullPage (default false, max 10000px)
- Use shared Playwright, new page per request
- Screenshot as PNG, return base64
- Close page after

### GET /health - No auth, return status/uptime/version

### GET /v1/docs - No auth, return OpenAPI 3.0 JSON spec

### MCP Server (src/mcp-server.ts)
- Use `@modelcontextprotocol/sdk` with stdio transport
- Import service functions directly
- Register 5 tools with proper JSON Schema input definitions

### package.json scripts
```json
{
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx watch src/index.ts",
  "mcp": "node dist/mcp-server.js"
}
```

### tsconfig.json
- target: ES2022, module: Node16, moduleResolution: Node16
- outDir: ./dist, rootDir: ./src
- strict: true, esModuleInterop: true, skipLibCheck: true
- resolveJsonModule: true, declaration: true, sourceMap: true

### .env.example
```
PORT=3100
API_KEYS=your-api-key-1,your-api-key-2
NODE_ENV=production
```

### .gitignore
```
node_modules/
dist/
.env
*.log
```

### ecosystem.config.js (PM2)
```js
module.exports = {
  apps: [{
    name: 'agent-toolbox',
    script: 'dist/index.js',
    env: { NODE_ENV: 'production', PORT: 3100 },
    instances: 1,
    max_memory_restart: '1G'
  }]
}
```

### README.md - Project docs with quick start, env vars, endpoints, curl examples, MCP usage

## Final Steps

1. `npm run build` - must have 0 errors
2. Create `.env` with `PORT=3100` and `API_KEYS=test-key-123`
3. Start server and test each endpoint
4. `git init && git add -A && git commit -m "feat: initial MVP - Agent Toolbox API"`

## IMPORTANT
- Use ES module imports
- For DuckDuckGo, carefully parse the HTML response
- For Readability, use JSDOM to create document
- Handle ALL errors with try/catch
- Playwright browser must be lazy-initialized
- Close browser pages after use
- For yahoo-finance2, suppress notices/warnings
