# Agent Toolbox API

A REST API + MCP Server providing web search, content extraction, weather, finance, and screenshot tools for AI agents.

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

Available tools: `search`, `extract`, `weather`, `finance`, `screenshot`

## Production Deployment

Using PM2:

```bash
npm install -g pm2
npm run build
pm2 start ecosystem.config.js
```

## Rate Limiting

60 requests per minute per API key. Returns HTTP 429 when exceeded.
