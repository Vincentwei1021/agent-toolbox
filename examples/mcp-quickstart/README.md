# ⚡ MCP Quickstart

Get Agent Toolbox running as an MCP server in Claude Desktop, Cursor, or Windsurf in under 60 seconds.

## Install

```bash
npm install -g agent-toolbox-mcp
```

## Configure

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "agent-toolbox-mcp",
      "env": {}
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "agent-toolbox-mcp"
    }
  }
}
```

### Windsurf

Add to `~/.windsurf/mcp.json`:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "agent-toolbox-mcp"
    }
  }
}
```

## Available Tools (13)

Once connected, your AI assistant can use these tools:

| Tool | What It Does |
|------|-------------|
| `search` | Web search via DuckDuckGo |
| `extract` | Extract content from any URL |
| `screenshot` | Capture webpage screenshots |
| `weather` | Weather forecasts |
| `finance` | Stock quotes & exchange rates |
| `validate_email` | Email address validation |
| `translate` | Translate text (100+ languages) |
| `geoip` | IP geolocation lookup |
| `news` | Search news articles |
| `whois` | Domain WHOIS lookup |
| `dns` | DNS record queries |
| `pdf_extract` | Extract text from PDFs |
| `qr_generate` | Generate QR codes |

## Try It

After configuring, ask Claude:

> "Search for the latest AI news and summarize the top 3 articles"

> "Take a screenshot of news.ycombinator.com"

> "What's the weather in Tokyo? Translate the result to Japanese."

> "Look up the WHOIS info for openai.com"

## SSE Transport (Remote)

For remote connections (e.g., Smithery), use the SSE endpoint:

```
URL: https://api.sendtoclaw.com/sse
Auth: ?apiKey=atb_your_key_here
```

Built with [Agent Toolbox](https://github.com/Vincentwei1021/agent-toolbox) — 13 tools, 1 API key.
