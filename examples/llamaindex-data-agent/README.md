# 📊 LlamaIndex Data Agent

Data investigation agent powered by LlamaIndex + Agent Toolbox. Looks up domains, IPs, DNS records, and more.

## Setup

```bash
pip install llamaindex-agent-toolbox llama-index-core llama-index-llms-openai
```

## Usage

```bash
export AGENT_TOOLBOX_API_KEY=atb_your_key
export OPENAI_API_KEY=sk-your_key

python data_agent.py "Investigate the domain openai.com"
```

## How It Works

Uses Agent Toolbox data tools:
- `whois` — Domain registration info
- `dns` — DNS records
- `geoip` — IP geolocation
- `extract` — Read web content
