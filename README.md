# Agent Toolbox API

A REST API + MCP Server providing web search, content extraction, weather, finance, screenshot, email validation, and translation tools for AI agents.

## Quick Start

```bash
# Install dependencies
npm install
npx playwright install chromium --with-deps

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Build and start
npm run build
npm start

# Or run in development mode
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3100` |
| `API_KEYS` | Comma-separated API keys | (required) |
| `NODE_ENV` | Environment | `development` |

## Authentication

All endpoints except `/health` and `/v1/docs` require a Bearer token:

```
Authorization: Bearer your-api-key
```

## Endpoints

### GET /health

Health check (no auth required).

```bash
curl http://localhost:3100/health
```

### POST /v1/search

Search the web via DuckDuckGo.

```bash
curl -X POST http://localhost:3100/v1/search \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"query": "TypeScript best practices", "count": 5}'
```

### POST /v1/extract

Extract content from a web page.

```bash
curl -X POST http://localhost:3100/v1/extract \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "format": "markdown"}'
```

### POST /v1/weather

Get weather forecast.

```bash
curl -X POST http://localhost:3100/v1/weather \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"location": "San Francisco"}'
```

### POST /v1/finance

Get stock quotes or exchange rates.

```bash
# Stock quote
curl -X POST http://localhost:3100/v1/finance \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "type": "quote"}'

# Exchange rate
curl -X POST http://localhost:3100/v1/finance \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"from": "USD", "to": "EUR", "amount": 100}'
```

### POST /v1/screenshot

Take a screenshot of a web page.

```bash
curl -X POST http://localhost:3100/v1/screenshot \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "width": 1280, "height": 720}'
```

### POST /v1/validate-email

Validate an email address — syntax check, MX record lookup, SMTP handshake verification, and disposable domain detection. Zero cost, no external APIs.

```bash
curl -X POST http://localhost:3100/v1/validate-email \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

Response includes `valid_syntax`, `mx_found`, `mx_records`, `smtp_reachable`, `is_disposable`, `score` (0–1), and `verdict` (`deliverable` | `risky` | `undeliverable` | `invalid`).

### POST /v1/translate

Translate text between languages with auto-detection, Markdown preservation, glossary support, and batch processing. Powered by Google Translate (free).

```bash
# Single text
curl -X POST http://localhost:3100/v1/translate \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "target": "zh"}'

# Batch
curl -X POST http://localhost:3100/v1/translate \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Hello", "Goodbye"], "target": "ja"}'

# With glossary (terms preserved as-is)
curl -X POST http://localhost:3100/v1/translate \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "The API endpoint returns JSON.", "target": "zh", "glossary": {"API": "API", "JSON": "JSON"}}'
```

Parameters:
- `text` (string) — single text to translate
- `texts` (string[]) — batch mode, max 20 items
- `target` (string, required) — target language code (e.g. `zh`, `ja`, `es`)
- `source` (string, default `auto`) — source language or `auto` for detection
- `glossary` (object) — term→translation mapping to preserve specific words

### GET /v1/docs

OpenAPI 3.0 specification (no auth required).

```bash
curl http://localhost:3100/v1/docs
```

## MCP Server

Run as an MCP server over stdio:

```bash
npm run mcp
```

Available tools: `search`, `extract`, `weather`, `finance`, `screenshot`, `validate-email`, `translate`

## Production Deployment

Using PM2:

```bash
npm install -g pm2
npm run build
pm2 start ecosystem.config.js
```

## Rate Limiting

60 requests per minute per API key. Returns HTTP 429 when exceeded.
