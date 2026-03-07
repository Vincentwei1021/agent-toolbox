# 🔍 Research Agent

Automated research agent that investigates any topic using Agent Toolbox's search, extract, and news endpoints — then generates a structured markdown report.

## Setup (30 seconds)

```bash
cd examples/research-agent
npm install
```

## Usage

```bash
# Set your API key (free at https://api.toolboxlite.com/v1/auth/register)
export AGENT_TOOLBOX_API_KEY=atb_your_key_here

# Research any topic
node index.js "AI agents in production"
node index.js "electric vehicle market 2025"
node index.js "WebAssembly use cases"
```

## Output

Generates a `report.md` file with:
- **Web Search Results** — Top search results with summaries
- **Latest News** — Recent articles from Google News
- **Deep Dive** — Extracted content from the most relevant pages
- **Summary** — Key takeaways

## How It Works

1. Searches the web for the topic via `/v1/search`
2. Fetches latest news via `/v1/news`
3. Extracts full content from top results via `/v1/extract`
4. Combines everything into a structured report

## API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/v1/search` | Web search for the topic |
| `/v1/news` | Latest news articles |
| `/v1/extract` | Full page content extraction |

Built with [Agent Toolbox](https://github.com/Vincentwei1021/agent-toolbox) — 13 tools, 1 API key.
