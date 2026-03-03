<p align="center">
  <h1 align="center">🧰 Agent Toolbox</h1>
  <p align="center">
    <strong>REST API + MCP Server giving AI agents real-world superpowers</strong>
  </p>
  <p align="center">
    Web search · Content extraction · Screenshots · Weather · Finance · Email validation · Translation
  </p>
  <p align="center">
    <a href="#"><img src="https://img.shields.io/badge/npm-v1.0.0-blue?logo=npm" alt="npm version"></a>
    <a href="https://github.com/Vincentwei1021/agent-toolbox/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
    <a href="https://api.agenttoolbox.dev/health"><img src="https://img.shields.io/badge/API-online-brightgreen" alt="API Status"></a>
    <a href="#mcp-server"><img src="https://img.shields.io/badge/MCP-compatible-purple" alt="MCP Compatible"></a>
  </p>
</p>

---

## What is Agent Toolbox?

Agent Toolbox is a **7-endpoint API** and **MCP server** that gives AI agents access to real-world data and actions — web search, page scraping, screenshots, weather, finance, email validation, and translation. Zero AI cost: all endpoints use free, open-source backends.

**Use it as:**
- 🔌 **MCP Server** — plug into Claude Desktop, Cursor, Windsurf, or any MCP-compatible client
- 🌐 **REST API** — call from any language, any framework, any agent
- 🐳 **Self-hosted** — run on your own infrastructure with full control

---

## Quick Start

### Option 1: MCP Server (Recommended for Claude/Cursor)

```bash
# Clone and build
git clone https://github.com/Vincentwei1021/agent-toolbox.git
cd agent-toolbox
npm install
npx playwright install chromium --with-deps
npm run build
```

#### Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "node",
      "args": ["/absolute/path/to/agent-toolbox/dist/mcp-server.js"],
      "env": {}
    }
  }
}
```

#### Cursor Configuration

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "node",
      "args": ["/absolute/path/to/agent-toolbox/dist/mcp-server.js"]
    }
  }
}
```

#### Windsurf / Continue / Other MCP Clients

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "node",
      "args": ["/absolute/path/to/agent-toolbox/dist/mcp-server.js"]
    }
  }
}
```

### Option 2: REST API (Self-hosted)

```bash
git clone https://github.com/Vincentwei1021/agent-toolbox.git
cd agent-toolbox
npm install
npx playwright install chromium --with-deps

# Configure
cp .env.example .env
# Edit .env with your settings

# Build and run
npm run build
npm start
# → API running at http://localhost:3100
```

### Option 3: npm (coming soon)

```bash
npx @agent-toolbox/mcp-server
```

---

## MCP Server

The MCP server exposes **7 tools** over stdio, compatible with the [Model Context Protocol](https://modelcontextprotocol.io):

| Tool | Description |
|------|-------------|
| `search` | Search the web via DuckDuckGo |
| `extract` | Extract readable content from any URL |
| `screenshot` | Capture a full-page screenshot |
| `weather` | Get current weather and forecasts |
| `finance` | Stock quotes and currency exchange rates |
| `validate_email` | Validate email addresses (MX + SMTP + disposable check) |
| `translate` | Translate text with auto-detection and glossary support |

### Example: Claude Desktop using Agent Toolbox

```
User: What's the weather in Tokyo and take a screenshot of the forecast?

Claude: I'll check the weather and capture a screenshot for you.

[Using agent-toolbox:weather] → Tokyo: 12°C, Clear skies, Wind 15 km/h
[Using agent-toolbox:screenshot] → Captured screenshot of weather.com/tokyo
```

---

## REST API Endpoints

All endpoints require Bearer authentication (except `/health` and `/v1/docs`).

```
Authorization: Bearer your-api-key
```

### POST /v1/search

Search the web via DuckDuckGo. Returns titles, URLs, and snippets.

```bash
curl -X POST https://api.agenttoolbox.dev/v1/search \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "best AI agent frameworks 2025", "count": 5}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": [
    {
      "title": "Top AI Agent Frameworks in 2025",
      "url": "https://example.com/ai-frameworks",
      "snippet": "A comprehensive comparison of the leading AI agent frameworks..."
    }
  ],
  "meta": {
    "requestId": "a1b2c3d4",
    "latencyMs": 420,
    "endpoint": "/v1/search"
  }
}
```
</details>

### POST /v1/extract

Extract readable content from any web page. Supports markdown, text, and JSON output.

```bash
curl -X POST https://api.agenttoolbox.dev/v1/extract \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "format": "markdown"}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": {
    "content": "# Example Domain\n\nThis domain is for use in illustrative examples...",
    "metadata": {
      "title": "Example Domain",
      "length": 1234,
      "excerpt": "This domain is for use in illustrative examples..."
    }
  },
  "meta": {
    "requestId": "e5f6g7h8",
    "latencyMs": 850,
    "endpoint": "/v1/extract"
  }
}
```
</details>

### POST /v1/screenshot

Capture a full-page screenshot using headless Chromium. Returns base64-encoded PNG.

```bash
curl -X POST https://api.agenttoolbox.dev/v1/screenshot \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "width": 1280, "height": 720}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": {
    "base64": "iVBORw0KGgoAAAANSUhEUg...",
    "width": 1280,
    "height": 720,
    "format": "png"
  },
  "meta": {
    "requestId": "i9j0k1l2",
    "latencyMs": 2100,
    "endpoint": "/v1/screenshot"
  }
}
```
</details>

### POST /v1/weather

Get current weather and forecasts from Open-Meteo (free, no API key needed).

```bash
curl -X POST https://api.agenttoolbox.dev/v1/weather \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"location": "San Francisco"}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": {
    "location": "San Francisco, California, United States",
    "current": {
      "temperature": 15.2,
      "feelsLike": 13.8,
      "humidity": 72,
      "description": "Partly cloudy",
      "windSpeed": 18.5
    },
    "forecast": [
      { "date": "2026-03-03", "high": 17.0, "low": 10.2, "description": "Partly cloudy" }
    ]
  },
  "meta": {
    "requestId": "m3n4o5p6",
    "latencyMs": 310,
    "endpoint": "/v1/weather"
  }
}
```
</details>

### POST /v1/finance

Get real-time stock quotes and currency exchange rates via Yahoo Finance.

```bash
# Stock quote
curl -X POST https://api.agenttoolbox.dev/v1/finance \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "type": "quote"}'

# Exchange rate
curl -X POST https://api.agenttoolbox.dev/v1/finance \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from": "USD", "to": "EUR", "amount": 100}'
```

<details>
<summary>Response (stock quote)</summary>

```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 178.52,
    "change": 2.35,
    "changePercent": 1.33,
    "currency": "USD"
  },
  "meta": {
    "requestId": "q7r8s9t0",
    "latencyMs": 450,
    "endpoint": "/v1/finance"
  }
}
```
</details>

### POST /v1/validate-email

Validate email addresses with syntax check, MX record lookup, SMTP handshake, and disposable domain detection. Zero cost — no external APIs.

```bash
curl -X POST https://api.agenttoolbox.dev/v1/validate-email \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

<details>
<summary>Response</summary>

```json
{
  "success": true,
  "data": {
    "email": "test@gmail.com",
    "valid_syntax": true,
    "mx_found": true,
    "mx_records": [
      { "exchange": "gmail-smtp-in.l.google.com", "priority": 5 }
    ],
    "smtp_reachable": true,
    "smtp_response": "250 2.1.5 OK",
    "is_disposable": false,
    "score": 0.95,
    "verdict": "deliverable"
  },
  "meta": {
    "requestId": "u1v2w3x4",
    "latencyMs": 1200,
    "endpoint": "/v1/validate-email"
  }
}
```
</details>

Verdicts: `deliverable` | `risky` | `undeliverable` | `invalid`

### POST /v1/translate

Translate text between 100+ languages with auto-detection, Markdown preservation, glossary support, and batch processing. Free.

```bash
# Single text
curl -X POST https://api.agenttoolbox.dev/v1/translate \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "target": "zh"}'

# Batch translation
curl -X POST https://api.agenttoolbox.dev/v1/translate \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Hello", "Goodbye"], "target": "ja"}'

# With glossary (terms preserved as-is)
curl -X POST https://api.agenttoolbox.dev/v1/translate \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "The API endpoint returns JSON.", "target": "zh", "glossary": {"API": "API", "JSON": "JSON"}}'
```

<details>
<summary>Response (single)</summary>

```json
{
  "success": true,
  "data": {
    "text": "Hello, how are you?",
    "translation": "你好，你好吗？",
    "detectedLanguage": { "code": "en", "confidence": 0.98 },
    "target": "zh"
  },
  "meta": {
    "requestId": "y5z6a7b8",
    "latencyMs": 180,
    "endpoint": "/v1/translate"
  }
}
```
</details>

<details>
<summary>Response (batch)</summary>

```json
{
  "success": true,
  "data": {
    "translations": [
      { "text": "Hello", "translation": "こんにちは", "detectedLanguage": { "code": "en", "confidence": 1.0 }, "target": "ja" },
      { "text": "Goodbye", "translation": "さようなら", "detectedLanguage": { "code": "en", "confidence": 1.0 }, "target": "ja" }
    ],
    "target": "ja"
  },
  "meta": {
    "requestId": "c9d0e1f2",
    "latencyMs": 350,
    "endpoint": "/v1/translate"
  }
}
```
</details>

Parameters: `text` | `texts` (max 20) | `target` (required, ISO 639-1) | `source` (default: auto) | `glossary` (optional)

### Utility Endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /health` | No | Health check |
| `GET /v1/docs` | No | OpenAPI 3.0 spec (JSON) |
| `POST /v1/auth/register` | No | Register for a free API key |
| `GET /v1/auth/usage` | Yes | Check your usage stats |
| `POST /v1/billing/checkout` | Yes | Upgrade plan via Creem |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3100` |
| `API_KEYS` | Comma-separated admin API keys | (required) |
| `NODE_ENV` | Environment | `development` |
| `CREEM_API_KEY` | Creem payment API key | — |
| `CREEM_API_BASE` | Creem API base URL | `https://test-api.creem.io` |
| `CREEM_WEBHOOK_SECRET` | Creem webhook HMAC secret | — |
| `CREEM_PRODUCT_PRO` | Creem Pro plan product ID | — |

---

## Pricing

| Plan | Price | Requests/mo | Rate Limit |
|------|-------|-------------|------------|
| **Free** | $0 | 1,000 | 60/min |
| **Builder** | $0.005/call | Unlimited | 60/min |
| **Pro** | $29/mo | 50,000 | 120/min |
| **Scale** | $99/mo | 500,000 | 300/min |

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** [Hono](https://hono.dev) (ultrafast web framework)
- **MCP SDK:** [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Browser:** Playwright (Chromium)
- **Search:** DuckDuckGo (free, no API key)
- **Weather:** Open-Meteo (free, no API key)
- **Finance:** Yahoo Finance
- **Translation:** Google Translate (free)
- **Email:** Native DNS + SMTP + [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains)
- **Database:** SQLite (better-sqlite3)
- **Payments:** [Creem](https://creem.io) (Merchant of Record)

---

## Production Deployment

```bash
# Using PM2
npm install -g pm2
npm run build
pm2 start ecosystem.config.js
```

---

## Contributing

Issues and PRs welcome. Please open an issue first to discuss what you'd like to change.

## License

[MIT](LICENSE)
