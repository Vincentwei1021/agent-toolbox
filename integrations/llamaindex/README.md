# 🧰 llamaindex-agent-toolbox

[![PyPI version](https://img.shields.io/badge/pypi-v0.1.0-blue)](https://pypi.org/project/llamaindex-agent-toolbox/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/Vincentwei1021/agent-toolbox/blob/master/LICENSE)

**LlamaIndex integration for [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox)** — 7 tools giving your LlamaIndex agents real-world superpowers.

| Tool | Endpoint | Description |
|------|----------|-------------|
| `AgentToolboxSearchTool` | `/v1/search` | Web search via DuckDuckGo |
| `AgentToolboxExtractTool` | `/v1/extract` | Extract content from any URL |
| `AgentToolboxScreenshotTool` | `/v1/screenshot` | Capture web page screenshots |
| `AgentToolboxWeatherTool` | `/v1/weather` | Current weather & forecasts |
| `AgentToolboxFinanceTool` | `/v1/finance` | Stock quotes & exchange rates |
| `AgentToolboxEmailValidatorTool` | `/v1/validate-email` | Email validation (MX + SMTP + disposable) |
| `AgentToolboxTranslateTool` | `/v1/translate` | Translation with auto-detect & glossary |

## Installation

```bash
pip install llamaindex-agent-toolbox
```

## Quick Start

### Get an API Key

```bash
curl -X POST https://api.sendtoclaw.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

### Set Environment Variable

```bash
export AGENT_TOOLBOX_API_KEY="atb_your_key_here"
```

### Use Tools Directly

```python
from llamaindex_agent_toolbox import AgentToolboxSearchTool, AgentToolboxWeatherTool

# Initialize
search = AgentToolboxSearchTool()
weather = AgentToolboxWeatherTool()

# Call directly
result = search.call(query="latest AI news", count=3)
print(result.content)

result = weather.call(location="Tokyo")
print(result.content)
```

### Use with a LlamaIndex Agent

```python
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from llamaindex_agent_toolbox import (
    AgentToolboxSearchTool,
    AgentToolboxExtractTool,
    AgentToolboxWeatherTool,
    AgentToolboxTranslateTool,
)

# Initialize tools
tools = [
    AgentToolboxSearchTool(),
    AgentToolboxExtractTool(),
    AgentToolboxWeatherTool(),
    AgentToolboxTranslateTool(),
]

# Create agent
llm = OpenAI(model="gpt-4o")
agent = ReActAgent.from_tools(tools, llm=llm, verbose=True)

# Run
response = agent.chat("What's the weather in Paris? Translate the summary to Japanese.")
print(response)
```

### Translation with Glossary

```python
from llamaindex_agent_toolbox import AgentToolboxTranslateTool

translate = AgentToolboxTranslateTool()

# Simple translation
result = translate.call(text="Hello, how are you?", target="zh")
print(result.content)  # 你好，你好吗？

# With glossary (preserve technical terms)
result = translate.call(
    text="The API endpoint returns JSON data.",
    target="zh",
    glossary={"API": "API", "JSON": "JSON", "endpoint": "端点"},
)
print(result.content)  # API 端点 返回 JSON 数据。
```

### Email Validation

```python
from llamaindex_agent_toolbox import AgentToolboxEmailValidatorTool

validator = AgentToolboxEmailValidatorTool()
result = validator.call(email="test@gmail.com")
print(result.content)
# {"email": "test@gmail.com", "verdict": "deliverable", "score": 0.95, ...}
```

### Async Support

All tools support async via `acall`:

```python
import asyncio
from llamaindex_agent_toolbox import AgentToolboxSearchTool

async def main():
    search = AgentToolboxSearchTool()
    result = await search.acall(query="async python", count=3)
    print(result.content)

asyncio.run(main())
```

## Configuration

### API Key

Set via environment variable (recommended):

```bash
export AGENT_TOOLBOX_API_KEY="atb_your_key_here"
```

Or pass directly:

```python
tool = AgentToolboxSearchTool(api_key="atb_your_key_here")
```

### Custom Base URL

For self-hosted instances:

```python
tool = AgentToolboxSearchTool(
    api_key="your-key",
    base_url="http://localhost:3100",
)
```

Or via environment variable:

```bash
export AGENT_TOOLBOX_BASE_URL="http://localhost:3100"
```

## Links

- [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox) — main project
- [LangChain Integration](https://github.com/Vincentwei1021/agent-toolbox/tree/master/integrations/langchain) — LangChain version
- [OpenAPI Spec](https://api.sendtoclaw.com/v1/docs) — full API documentation
- [LlamaIndex](https://docs.llamaindex.ai/) — LlamaIndex framework

## License

MIT
