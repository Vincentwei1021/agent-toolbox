# Agent Toolbox MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that provides AI agents with production-ready tools for web search, content extraction, weather forecasts, financial data, and web page screenshots.

## Tools

| Tool | Description |
|------|-------------|
| `search` | Search the web via DuckDuckGo. Returns titles, URLs, and snippets. |
| `extract` | Extract clean content from any URL using Mozilla Readability. Supports markdown, text, and JSON output. |
| `weather` | Get current conditions and 7-day forecasts for any location worldwide (Open-Meteo). |
| `finance` | Real-time stock quotes, historical data, and currency exchange rates (Yahoo Finance). |
| `screenshot` | Capture screenshots of any web page as PNG (Playwright/Chromium). |

## Installation

```bash
npm install -g @agent-toolbox/mcp-server
```

## Usage

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "agent-toolbox-mcp"
    }
  }
}
```

### With npx (no install)

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "npx",
      "args": ["-y", "@agent-toolbox/mcp-server"]
    }
  }
}
```

### Standalone

```bash
agent-toolbox-mcp
```

The server communicates over stdio using the MCP protocol.

## Tool Details

### search

```json
{
  "query": "OpenAI latest news",
  "count": 5,
  "lang": "en"
}
```

### extract

```json
{
  "url": "https://example.com",
  "format": "markdown"
}
```

### weather

```json
{
  "location": "Tokyo"
}
```

Or by coordinates:

```json
{
  "lat": 35.6895,
  "lon": 139.6917
}
```

### finance

Stock quote:
```json
{
  "symbol": "AAPL"
}
```

Exchange rate:
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```

### screenshot

```json
{
  "url": "https://example.com",
  "width": 1280,
  "height": 720,
  "fullPage": false
}
```

## Requirements

- Node.js >= 18
- Playwright browsers installed (`npx playwright install chromium`)

## License

MIT
