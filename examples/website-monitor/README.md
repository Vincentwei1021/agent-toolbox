# 🖥️ Website Monitor

Monitor websites for changes, downtime, and DNS issues using Agent Toolbox's screenshot, extract, and DNS endpoints.

## Setup

```bash
cd examples/website-monitor
npm install
```

## Usage

```bash
export AGENT_TOOLBOX_API_KEY=atb_your_key_here

# Monitor a single site
node index.js https://example.com

# Monitor multiple sites (create sites.json)
echo '["https://example.com", "https://news.ycombinator.com"]' > sites.json
node index.js --file sites.json
```

## What It Checks

| Check | Endpoint | What It Does |
|-------|----------|--------------|
| DNS Health | `/v1/dns` | Verifies DNS records resolve correctly |
| Content | `/v1/extract` | Extracts page content, detects changes |
| Screenshot | `/v1/screenshot` | Captures visual snapshot |

## Output

Creates a `reports/` directory with:
- `{domain}-dns.json` — DNS records
- `{domain}-content.txt` — Extracted text content
- `{domain}-screenshot.png` — Visual screenshot
- `{domain}-report.json` — Full monitoring report

Built with [Agent Toolbox](https://github.com/Vincentwei1021/agent-toolbox) — 13 tools, 1 API key.
