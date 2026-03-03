# 🧰 langchain-agent-toolbox

[![PyPI version](https://img.shields.io/badge/pypi-v0.1.0-blue)](https://pypi.org/project/langchain-agent-toolbox/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/Vincentwei1021/agent-toolbox/blob/master/LICENSE)

**LangChain integration for [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox)** — 7 tools giving your LangChain agents real-world superpowers.

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
pip install langchain-agent-toolbox
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

### Use with LangChain

```python
from langchain_agent_toolbox import AgentToolboxSearchTool, AgentToolboxWeatherTool

# Initialize tools
search = AgentToolboxSearchTool()
weather = AgentToolboxWeatherTool()

# Use directly
results = search.invoke({"query": "latest AI news", "count": 3})
print(results)

forecast = weather.invoke({"location": "Tokyo"})
print(forecast)
```

### Use with a LangChain Agent

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_agent_toolbox import (
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
llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to web tools."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run
result = executor.invoke({
    "input": "What's the weather in Paris? Also search for top restaurants there."
})
print(result["output"])
```

### Translation with Glossary

```python
from langchain_agent_toolbox import AgentToolboxTranslateTool

translate = AgentToolboxTranslateTool()

# Simple translation
result = translate.invoke({
    "text": "Hello, how are you?",
    "target": "zh",
})
print(result)  # 你好，你好吗？

# With glossary (preserve technical terms)
result = translate.invoke({
    "text": "The API endpoint returns JSON data.",
    "target": "zh",
    "glossary": {"API": "API", "JSON": "JSON", "endpoint": "端点"},
})
print(result)  # API 端点 返回 JSON 数据。
```

### Email Validation

```python
from langchain_agent_toolbox import AgentToolboxEmailValidatorTool

validator = AgentToolboxEmailValidatorTool()

result = validator.invoke({"email": "test@gmail.com"})
print(result)
# {
#   "email": "test@gmail.com",
#   "valid_syntax": true,
#   "mx_found": true,
#   "is_disposable": false,
#   "verdict": "deliverable",
#   "score": 0.95
# }
```

### Finance: Stocks & Exchange Rates

```python
from langchain_agent_toolbox import AgentToolboxFinanceTool

finance = AgentToolboxFinanceTool()

# Stock quote
quote = finance.invoke({"symbol": "AAPL"})
print(quote)

# Currency exchange
rate = finance.invoke({
    "from_currency": "USD",
    "to_currency": "EUR",
    "amount": 100,
    "type": "exchange",
})
print(rate)
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

## Async Support

All tools support async out of the box:

```python
import asyncio
from langchain_agent_toolbox import AgentToolboxSearchTool

async def main():
    search = AgentToolboxSearchTool()
    result = await search.ainvoke({"query": "async python", "count": 3})
    print(result)

asyncio.run(main())
```

## API Reference

All tools accept these common parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | `str` | `$AGENT_TOOLBOX_API_KEY` | API key for authentication |
| `base_url` | `str` | `https://api.sendtoclaw.com` | API base URL |

## Links

- [Agent Toolbox API](https://github.com/Vincentwei1021/agent-toolbox) — main project
- [OpenAPI Spec](https://api.sendtoclaw.com/v1/docs) — full API documentation
- [LangChain](https://python.langchain.com/) — LangChain framework

## License

MIT
