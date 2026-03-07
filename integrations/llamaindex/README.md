# 🦙 LlamaIndex × Agent Toolbox

**13 production-ready tools for LlamaIndex agents — one API key, zero complexity.**

[![PyPI](https://img.shields.io/pypi/v/llamaindex-agent-toolbox?color=10b981)](https://pypi.org/project/llamaindex-agent-toolbox/)
[![License](https://img.shields.io/badge/license-MIT-blue)](../../LICENSE)

## Install

```bash
pip install llamaindex-agent-toolbox
```

## Quick Start

```python
from llamaindex_agent_toolbox import AgentToolbox

# Get all 13 tools with one line
tools = AgentToolbox(api_key="atb_xxx").get_tools()

# Use with LlamaIndex agent
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI

llm = OpenAI(model="gpt-4")
agent = ReActAgent.from_tools(tools, llm=llm)
response = agent.chat("Search for the latest AI news and summarize")
```

## Use Individual Tools

```python
from llamaindex_agent_toolbox import (
    AgentToolboxSearchTool,
    AgentToolboxNewsTool,
    AgentToolboxDnsTool,
)

search = AgentToolboxSearchTool(api_key="atb_xxx")
result = search.call(query="AI agents 2025", count=3)
print(result.content)
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
tools = AgentToolbox(api_key="atb_xxx", base_url="https://api.toolboxlite.com").get_tools()

# Or via environment variable
import os
os.environ["AGENT_TOOLBOX_API_KEY"] = "atb_xxx"
tools = AgentToolbox().get_tools()
```

## Get a Free API Key

```bash
curl -X POST https://api.toolboxlite.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

Free tier: **1,000 calls/month**, all 13 endpoints.

## Links

- [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox)
- [API Docs](https://api.toolboxlite.com/docs)
- [Playground](https://api.toolboxlite.com/playground)

## License

MIT
