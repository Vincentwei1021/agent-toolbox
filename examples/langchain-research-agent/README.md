# 🔍 LangChain Research Agent

AI research agent powered by LangChain + Agent Toolbox. Searches the web, reads articles, and generates a research report.

## Setup

```bash
pip install langchain-agent-toolbox langchain-openai langchain
```

## Usage

```bash
export AGENT_TOOLBOX_API_KEY=atb_your_key
export OPENAI_API_KEY=sk-your_key

python research_agent.py "AI agents in production"
```

## How It Works

Uses 3 Agent Toolbox tools:
- `search` — Find relevant web pages
- `extract` — Read full page content
- `news` — Get latest news articles

The LangChain agent decides which tools to use based on the research topic.
