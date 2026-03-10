# CLAUDE.md — Agent Toolbox API

## Project Overview
Production REST API providing 13 data tools for AI agents. Also serves as an MCP server via SSE transport.

## Architecture
```
src/
├── index.ts          # Entry point — createServer() + getRequestListener() for raw SSE support
├── openapi.ts        # OpenAPI 3.0 spec (served at /v1/docs)
├── routes/           # Hono route handlers (one file per endpoint)
│   ├── search.ts     # /v1/search — DuckDuckGo web search
│   ├── extract.ts    # /v1/extract — URL content extraction (Readability)
│   ├── weather.ts    # /v1/weather — Open-Meteo forecasts
│   ├── finance.ts    # /v1/finance — Yahoo Finance quotes + exchange rates
│   ├── screenshot.ts # /v1/screenshot — Playwright browser screenshots
│   ├── email.ts      # /v1/validate-email — Email validation (MX, SMTP)
│   ├── translate.ts  # /v1/translate — Google Translate (free)
│   ├── geoip.ts      # /v1/geoip — ip-api.com geolocation
│   ├── news.ts       # /v1/news — Google News RSS
│   ├── whois.ts      # /v1/whois — Domain WHOIS lookup
│   ├── dns.ts        # /v1/dns — DNS record queries
│   ├── pdfExtract.ts # /v1/pdf-extract — PDF text extraction
│   ├── qrcode.ts     # /v1/qr — QR code generation
│   ├── auth.ts       # /v1/auth/* — API key registration + usage
│   ├── billing.ts    # /v1/billing/* — Creem subscription management
│   ├── landing.ts    # / — Landing page (HTML)
│   ├── docsPage.ts   # /docs — Interactive docs page (HTML)
│   ├── playground.ts # /playground — API playground (HTML)
│   └── seo.ts        # /robots.txt, /sitemap.xml
├── services/         # Business logic (one file per endpoint)
├── middleware/        # Auth, rate limiting, usage tracking
├── mcp-sse.ts        # MCP SSE server (13 tool definitions)
├── cache.ts          # LRU cache with TTL
└── db.ts             # SQLite via better-sqlite3
docs/
  openapi.json        # Static copy (NOT the served spec — src/openapi.ts is canonical)
data/
  agent-toolbox.db    # SQLite DB (api_keys, usage, monthly_usage tables)
integrations/
  langchain/          # langchain-agent-toolbox PyPI package
  llamaindex/         # llamaindex-agent-toolbox PyPI package
```

## Tech Stack
- **Runtime**: Node.js + TypeScript (ES2022, module: Node16)
- **Framework**: Hono
- **Database**: SQLite via better-sqlite3 (raw SQL, no ORM)
- **Browser**: Playwright (for screenshots)
- **Billing**: Creem (creem.io) — NOT Stripe
- **AI Backend**: AWS Bedrock (Claude 3 Haiku) — NOT OpenAI
- **Deployment**: PM2 (fork mode, port 3100) + Cloudflare tunnel
- **URL**: https://api.toolboxlite.com

## Build & Run
```bash
npx tsc                    # Compile TypeScript
pm2 restart agent-toolbox  # Restart the PM2 process
# OR for development:
npx tsx src/index.ts       # Run with tsx
```

## Key Conventions
- Every route handler uses `sendSuccess(c, data)` and `sendError(c, code, message)` helpers
- All data endpoints use LRU cache with TTL (see cache.ts)
- Auth supports both `Authorization: Bearer <key>` header and `?apiKey=xxx` query param
- New endpoints need: route file, service file, OpenAPI spec entry in src/openapi.ts, MCP tool in mcp-sse.ts, landing page card, docs page section
- The OpenAPI spec is served from `src/openapi.ts` (compiled). `docs/openapi.json` is a static copy for external tools only.
- No ORM — all database queries are raw SQL via better-sqlite3
- $0 operating cost per endpoint — use only free APIs/libraries

## Auth & Keys
- Test key: `atb_6175c4cbe4d9dde770ed3111953d9a37` (free plan)
- Playground demo key: `atb_playground_585ac168685ec4c3`
- Secrets in `.env` — NEVER edit or expose .env files
- `CREEM_API_BASE` defaults to test API; switch to `https://api.creem.io` for production

## Testing
- Currently no test suite (test gap — priority to add)
- Manual testing via curl or the /playground page
- Always run `npx tsc` after changes — zero TypeScript errors required

## Git
- Remote: https://github.com/Vincentwei1021/agent-toolbox.git
- Branch: master
- Commit messages: concise, prefixed (feat:, fix:, docs:)
- Always push after changes
