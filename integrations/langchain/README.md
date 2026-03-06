# 🦜🔗 LangChain × Agent Toolbox

**13 production-ready tools for LangChain agents — one API key, zero complexity.**

[![PyPI](https://img.shields.io/pypi/v/langchain-agent-toolbox?color=6366f1)](https://pypi.org/project/langchain-agent-toolbox/)
[![License](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Install

```bash
pip install langchain-agent-toolbox
```

## Quick Start

```python
from langchain_agent_toolbox import AgentToolbox

# Get all 13 tools with one line
tools = AgentToolbox(api_key="atb_xxx").get_tools()

# Use with any LangChain agent
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4")
agent = initialize_agent(tools, llm, agent=AgentType.OPENAI_FUNCTIONS)
agent.run("Search for the latest AI news and summarize the top 3 articles")
```

## Use Individual Tools

```python
from langchain_agent_toolbox import (
    AgentToolboxSearchTool,
    AgentToolboxNewsTool,
    AgentToolboxWhoisTool,
)

search = AgentToolboxSearchTool(api_key="atb_xxx")
result = search.invoke({"query": "AI agents 2025", "count": 3})
```

## All 13 Tools

| Tool Class | Endpoint | Description |
|-----------|----------|-------------|
| `AgentToolboxSearchTool` | `/v1/search` | Web search (DuckDuckGo) |
| `AgentToolboxExtractTool` | `/v1/extract` | Extract web page content |
| `AgentToolboxScreenshotTool` | `/v1/screenshot` | Capture screenshots |
| `AgentToolboxWeatherTool` | `/v1/weather` | Weather & forecast |
| `AgentToolboxFinanceTool` | `/v1/finance` | Stock quotes & FX rates |
| `AgentToolboxEmailValidatorTool` | `/v1/validate-email` | Email validation |
| `AgentToolboxTranslateTool` | `/v1/translate` | 100+ language translation |
| `AgentToolboxGeoIPTool` | `/v1/geoip` | IP geolocation |
| `AgentToolboxNewsTool` | `/v1/news` | News article search |
| `AgentToolboxWhoisTool` | `/v1/whois` | Domain WHOIS lookup |
| `AgentToolboxDnsTool` | `/v1/dns` | DNS record queries |
| `AgentToolboxPdfExtractTool` | `/v1/pdf-extract` | PDF text extraction |
| `AgentToolboxQrTool` | `/v1/qr` | QR code generation |

## Configuration

```python
# Via constructor
tools = AgentToolbox(api_key="atb_xxx", base_url="https://api.sendtoclaw.com").get_tools()

# Or via environment variable
import os
os.environ["AGENT_TOOLBOX_API_KEY"] = "atb_xxx"
tools = AgentToolbox().get_tools()
```

## Get a Free API Key

```bash
curl -X POST https://api.sendtoclaw.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

Free tier: **1,000 calls/month**, all 13 endpoints.

## Links

- [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox)
- [API Docs](https://api.sendtoclaw.com/docs)
- [Playground](https://api.sendtoclaw.com/playground)

## License

MIT
