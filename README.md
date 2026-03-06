<div align="center">

# ⚡ Agent Toolbox

**13 production-ready tools for AI agents — one API key, zero complexity.**

[![npm](https://img.shields.io/npm/v/agent-toolbox-mcp?color=6366f1&label=npm)](https://www.npmjs.com/package/agent-toolbox-mcp)
[![PyPI](https://img.shields.io/pypi/v/langchain-agent-toolbox?color=10b981&label=langchain)](https://pypi.org/project/langchain-agent-toolbox/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Endpoints](https://img.shields.io/badge/endpoints-13-brightgreen)](https://api.sendtoclaw.com/docs)
[![Glama](https://glama.ai/mcp/servers/@Vincentwei1021/agent-toolbox/badge)](https://glama.ai/mcp/servers/@Vincentwei1021/agent-toolbox)

[Docs](https://api.sendtoclaw.com/docs) · [Playground](https://api.sendtoclaw.com/playground) · [OpenAPI Spec](https://api.sendtoclaw.com/openapi.json) · [npm](https://www.npmjs.com/package/agent-toolbox-mcp)

</div>

---

## Why Agent Toolbox?

Building AI agents that interact with the real world? You'd normally need:

| Without Agent Toolbox | With Agent Toolbox |
|---|---|
| 6+ API keys (Google, OpenWeatherMap, Yahoo Finance, ...) | **1 API key** |
| Different auth methods per service | **Unified Bearer auth** |
| Parse different response formats | **Consistent JSON responses** |
| Handle rate limits per provider | **Built-in rate limiting** |
| No caching, redundant calls | **Smart LRU caching** |
| Pay $50-200+/mo for APIs | **Free tier: 1,000 calls/mo** |

## Quick Start (30 seconds)

### 1. Get your free API key

```bash
curl -X POST https://api.sendtoclaw.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

### 2. Make your first call

```bash
curl -X POST https://api.sendtoclaw.com/v1/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "best AI agent frameworks"}'
```

### 3. That's it! 🎉

No credit card. No setup. 13 endpoints ready to use.

## 13 Endpoints

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `POST /v1/search` | Web search via DuckDuckGo | 5 min |
| `POST /v1/extract` | Extract content from any URL | 5 min |
| `POST /v1/screenshot` | Capture webpage screenshots | 1 hr |
| `POST /v1/weather` | Weather & forecast | 15 min |
| `POST /v1/finance` | Stock quotes & exchange rates | 15 min |
| `POST /v1/validate-email` | Email validation (MX + SMTP) | 1 hr |
| `POST /v1/translate` | Translate 100+ languages | 1 hr |
| `POST /v1/geoip` | IP geolocation lookup | 1 hr |
| `POST /v1/news` | News article search | 5 min |
| `POST /v1/whois` | Domain WHOIS lookup | 1 hr |
| `POST /v1/dns` | DNS record queries | 5 min |
| `POST /v1/pdf-extract` | Extract text from PDFs | 1 hr |
| `POST /v1/qr` | Generate QR codes | 24 hr |

## MCP Server

Use Agent Toolbox as an MCP server in Claude Desktop, Cursor, or Windsurf:

```bash
npm install -g agent-toolbox-mcp
```

Add to Claude Desktop config:

```json
{
  "mcpServers": {
    "agent-toolbox": {
      "command": "agent-toolbox-mcp"
    }
  }
}
```

See [MCP Quickstart Guide](examples/mcp-quickstart/) for full setup instructions.

## SDK Integrations

### Python — LangChain

```bash
pip install langchain-agent-toolbox
```

```python
from langchain_agent_toolbox import AgentToolboxSearchTool

search = AgentToolboxSearchTool()
result = search.invoke({"query": "AI agents", "count": 3})
```

### Python — LlamaIndex

```bash
pip install llamaindex-agent-toolbox
```

```python
from llamaindex_agent_toolbox import AgentToolboxSearchTool

search = AgentToolboxSearchTool()
result = search.call(query="AI agents", count=3)
```

## Examples

| Example | Description |
|---------|-------------|
| [Research Agent](examples/research-agent/) | Auto-research any topic → markdown report |
| [Website Monitor](examples/website-monitor/) | Monitor sites with DNS + screenshots + content |
| [MCP Quickstart](examples/mcp-quickstart/) | Claude Desktop / Cursor / Windsurf setup |

## Pricing

| Plan | Price | Calls/month | Rate Limit |
|------|-------|-------------|------------|
| **Free** | $0 | 1,000 | 60/min |
| **Pro** | $29/mo | 50,000 | 120/min |
| **Scale** | $99/mo | 500,000 | 300/min |

All plans include all 13 endpoints. No feature gating.

## Self-Hosting

```bash
git clone https://github.com/Vincentwei1021/agent-toolbox.git
cd agent-toolbox
npm install && npm run build
cp .env.example .env  # Add your config
npm start
```

Or with Docker:

```bash
docker build -t agent-toolbox .
docker run -p 3100:3100 --env-file .env agent-toolbox
```

## Used By

> *Building with Agent Toolbox? [Open an issue](https://github.com/Vincentwei1021/agent-toolbox/issues) to get listed here.*

## License

MIT © [Vincentwei1021](https://github.com/Vincentwei1021)
