import { Hono } from "hono";

const docsPageRouter = new Hono();

const docsHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="description" content="Complete API documentation for Agent Toolbox — 13 endpoints with curl, Python, and JavaScript examples. MCP server, LangChain, and LlamaIndex integration guides.">
<meta property="og:title" content="Agent Toolbox Documentation">
<meta property="og:description" content="API reference for 13 AI agent tools with interactive code examples in curl, Python, and JavaScript.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://api.toolboxlite.com/docs">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Agent Toolbox Documentation">
<meta name="twitter:description" content="Complete API docs for 13 AI agent tools — search, extract, weather, screenshot, translate, and more.">
<link rel="canonical" href="https://api.toolboxlite.com/docs">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documentation — Agent Toolbox</title>
<style>
:root{--bg:#09090b;--surface:#16162a;--surface2:#1e1e32;--border:#2a2a4a;--text:#e0e0e0;--muted:#a1a1aa;--dim:#71717a;--accent:#6366f1;--green:#10b981;--yellow:#f59e0b;--red:#f85149;--pink:#f472b6}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif;line-height:1.6}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
code{font-family:'SF Mono','Fira Code',monospace;font-size:0.9em}
pre{font-family:'SF Mono','Fira Code',monospace;font-size:13px;line-height:1.7}

/* Nav */
.nav{background:#0f0f13;border-bottom:1px solid var(--border);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.nav-brand{font-size:18px;font-weight:700;color:#fff;display:flex;align-items:center;gap:8px}
.nav-links{display:flex;gap:20px;font-size:14px}
.nav-links a{color:var(--muted)}
.nav-links a:hover,.nav-links a.active{color:#fff;text-decoration:none}

/* Layout */
.layout{display:grid;grid-template-columns:240px 1fr;max-width:1400px;margin:0 auto;min-height:calc(100vh - 57px)}
.sidebar{border-right:1px solid var(--border);padding:24px 16px;position:sticky;top:57px;height:calc(100vh - 57px);overflow-y:auto}
.sidebar h4{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--dim);margin:20px 0 8px;font-weight:600}
.sidebar h4:first-child{margin-top:0}
.sidebar a{display:block;padding:6px 12px;font-size:13px;color:var(--muted);border-radius:6px;margin:1px 0}
.sidebar a:hover{background:var(--surface);color:var(--text);text-decoration:none}
.sidebar a.active{background:var(--accent)20;color:var(--accent)}
.main{padding:40px 48px;max-width:900px}

/* Content */
h1{font-size:32px;font-weight:700;margin-bottom:8px}
h2{font-size:24px;font-weight:700;margin:48px 0 16px;padding-top:24px;border-top:1px solid var(--border)}
h2:first-of-type{border-top:none;margin-top:32px}
h3{font-size:18px;font-weight:600;margin:32px 0 12px;color:#fff}
p{margin:8px 0;color:var(--muted)}
.subtitle{font-size:16px;color:var(--muted);margin-bottom:32px}

/* Code blocks */
.code-block{background:#0f0f1a;border:1px solid var(--border);border-radius:10px;overflow:hidden;margin:16px 0}
.code-header{background:var(--surface2);padding:8px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);font-size:12px;color:var(--dim)}
.code-header .lang{color:var(--accent);font-weight:600}
.code-body{padding:16px;overflow-x:auto}
.code-body pre{color:var(--text);white-space:pre;tab-size:2}

/* Tabs */
.tabs{display:flex;gap:4px;margin:16px 0 0}
.tab{padding:6px 16px;font-size:13px;cursor:pointer;border-radius:8px 8px 0 0;background:var(--surface2);color:var(--dim);border:1px solid var(--border);border-bottom:none}
.tab.active{background:var(--surface);color:var(--accent);border-color:var(--accent)}
.tab-content{display:none}
.tab-content.active{display:block}

/* Table */
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
th{text-align:left;padding:10px 14px;background:var(--surface);color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid var(--border)}
td{padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text)}
td code{background:var(--surface);padding:2px 6px;border-radius:4px;font-size:12px}

/* Badge */
.badge{display:inline-block;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:600;font-family:monospace}
.badge-post{background:#10b98120;color:var(--green)}
.badge-get{background:#6366f120;color:var(--accent)}

/* Endpoint card */
.endpoint{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:24px;margin:16px 0}
.endpoint-path{font-family:monospace;font-size:15px;font-weight:600;color:#fff;margin:4px 0}
.endpoint p{font-size:14px}

/* Alert */
.alert{background:var(--surface);border-left:3px solid var(--accent);padding:14px 18px;border-radius:0 8px 8px 0;margin:16px 0;font-size:14px}
.alert.warn{border-left-color:var(--yellow)}
.alert.tip{border-left-color:var(--green)}

/* Response example */
.json-key{color:var(--accent)}
.json-str{color:var(--green)}
.json-num{color:var(--yellow)}
.json-bool{color:var(--pink)}

@media(max-width:768px){
  .layout{grid-template-columns:1fr}
  .sidebar{display:none}
  .main{padding:24px 16px}
}
</style>
</head>
<body>

<nav class="nav">
  <a href="/" class="nav-brand">&#9889; Agent Toolbox</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/docs" class="active">Docs</a>
    <a href="/playground">Playground</a>
    <a href="/v1/docs">OpenAPI</a>
  </div>
</nav>

<div class="layout">
<aside class="sidebar">
  <h4>Getting Started</h4>
  <a href="#quickstart">Quick Start</a>
  <a href="#authentication">Authentication</a>
  <a href="#errors">Errors &amp; Rate Limits</a>
  <h4>Endpoints</h4>
  <a href="#search">Search</a>
  <a href="#extract">Extract</a>
  <a href="#screenshot">Screenshot</a>
  <a href="#weather">Weather</a>
  <a href="#finance">Finance</a>
  <a href="#validate-email">Email Validation</a>
  <a href="#translate">Translate</a>
  <a href="#news">News</a>
  <h4>Integrations</h4>
  <a href="#mcp">MCP Server</a>
  <a href="#langchain">LangChain</a>
  <a href="#llamaindex">LlamaIndex</a>
  <h4>Reference</h4>
  <a href="#caching">Caching</a>
  <a href="#pricing">Pricing</a>
</aside>

<main class="main">

<h1>Agent Toolbox Documentation</h1>
<p class="subtitle">Everything you need to give your AI agents real-world superpowers. From first API call to production in under 2 minutes.</p>

<!-- QUICK START -->
<h2 id="quickstart">Quick Start</h2>
<p>Get from zero to your first API call in 3 steps:</p>

<h3>1. Get your API key (free)</h3>
<div class="code-block"><div class="code-header"><span class="lang">curl</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email": "you@example.com"}'</pre></div></div>
<p>Response:</p>
<div class="code-block"><div class="code-header"><span class="lang">JSON</span></div><div class="code-body"><pre>{
  <span class="json-key">"success"</span>: <span class="json-bool">true</span>,
  <span class="json-key">"data"</span>: {
    <span class="json-key">"apiKey"</span>: <span class="json-str">"atb_a1b2c3d4e5f6..."</span>,
    <span class="json-key">"plan"</span>: <span class="json-str">"free"</span>,
    <span class="json-key">"limits"</span>: { <span class="json-key">"monthly"</span>: <span class="json-num">1000</span> }
  }
}</pre></div></div>

<h3>2. Make your first call</h3>
<div class="tabs" data-group="quickstart">
  <div class="tab active" onclick="switchTab(this,'qs')">curl</div>
  <div class="tab" onclick="switchTab(this,'qs')">Python</div>
  <div class="tab" onclick="switchTab(this,'qs')">JavaScript</div>
</div>
<div class="tab-content active" data-group="qs">
<div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "best AI frameworks 2025"}'</pre></div></div>
</div>
<div class="tab-content" data-group="qs">
<div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>import httpx

resp = httpx.post(
    "https://api.toolboxlite.com/v1/search",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"query": "best AI frameworks 2025"}
)
print(resp.json())</pre></div></div>
</div>
<div class="tab-content" data-group="qs">
<div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const resp = await fetch("https://api.toolboxlite.com/v1/search", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: "best AI frameworks 2025" }),
});
const data = await resp.json();
console.log(data);</pre></div></div>
</div>

<h3>3. You're done! &#127881;</h3>
<p>Free tier includes 1,000 requests/month. No credit card required.</p>
<div class="alert tip">&#128161; <strong>Pro tip:</strong> Try endpoints instantly in the <a href="/playground">API Playground</a> — no setup needed.</div>

<!-- AUTHENTICATION -->
<h2 id="authentication">Authentication</h2>
<p>All data endpoints require a Bearer token in the Authorization header:</p>
<div class="code-block"><div class="code-body"><pre>Authorization: Bearer atb_your_api_key_here</pre></div></div>
<p>Public endpoints (no auth): <code>/health</code>, <code>/v1/docs</code>, <code>/v1/auth/register</code>, <code>/playground</code>, <code>/docs</code></p>

<!-- ERRORS & RATE LIMITS -->
<h2 id="errors">Errors &amp; Rate Limits</h2>
<h3>Error Format</h3>
<p>All errors return a consistent JSON structure:</p>
<div class="code-block"><div class="code-header"><span class="lang">JSON</span></div><div class="code-body"><pre>{
  <span class="json-key">"success"</span>: <span class="json-bool">false</span>,
  <span class="json-key">"error"</span>: {
    <span class="json-key">"code"</span>: <span class="json-str">"VALIDATION_ERROR"</span>,
    <span class="json-key">"message"</span>: <span class="json-str">"Query is required"</span>
  },
  <span class="json-key">"meta"</span>: {
    <span class="json-key">"requestId"</span>: <span class="json-str">"abc-123"</span>,
    <span class="json-key">"endpoint"</span>: <span class="json-str">"/v1/search"</span>
  }
}</pre></div></div>

<h3>Error Codes</h3>
<table>
<tr><th>Code</th><th>HTTP</th><th>Description</th></tr>
<tr><td><code>UNAUTHORIZED</code></td><td>401</td><td>Missing or invalid API key</td></tr>
<tr><td><code>VALIDATION_ERROR</code></td><td>400</td><td>Invalid request parameters</td></tr>
<tr><td><code>RATE_LIMITED</code></td><td>429</td><td>Rate limit exceeded</td></tr>
<tr><td><code>QUOTA_EXCEEDED</code></td><td>429</td><td>Monthly quota exhausted</td></tr>
<tr><td><code>QUEUE_FULL</code></td><td>408</td><td>Too many concurrent requests</td></tr>
<tr><td><code>TIMEOUT</code></td><td>504</td><td>Request timed out (30s limit)</td></tr>
<tr><td><code>INTERNAL_ERROR</code></td><td>500</td><td>Unexpected server error</td></tr>
</table>

<h3>Rate Limits</h3>
<table>
<tr><th>Plan</th><th>Requests/min</th><th>Requests/month</th><th>Concurrent Playwright</th></tr>
<tr><td>Free</td><td>60</td><td>1,000</td><td>3</td></tr>
<tr><td>Builder</td><td>60</td><td>Unlimited</td><td>3</td></tr>
<tr><td>Pro</td><td>120</td><td>50,000</td><td>3</td></tr>
<tr><td>Scale</td><td>300</td><td>500,000</td><td>3</td></tr>
</table>
<p>Rate limit headers are included in responses: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>.</p>

<!-- SEARCH -->
<h2 id="search">POST /v1/search</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/search</div>
  <p>Search the web via DuckDuckGo. Returns titles, URLs, and snippets.</p>
</div>

<h3>Parameters</h3>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>query</code></td><td>string</td><td>Yes</td><td>Search query</td></tr>
<tr><td><code>count</code></td><td>integer</td><td>No</td><td>Results (1-10, default 5)</td></tr>
<tr><td><code>lang</code></td><td>string</td><td>No</td><td>Language code (default "en")</td></tr>
</table>

<div class="tabs" data-group="search">
  <div class="tab active" onclick="switchTab(this,'search')">curl</div>
  <div class="tab" onclick="switchTab(this,'search')">Python</div>
  <div class="tab" onclick="switchTab(this,'search')">JavaScript</div>
</div>
<div class="tab-content active" data-group="search">
<div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "OpenAI GPT-5", "count": 3}'</pre></div></div>
</div>
<div class="tab-content" data-group="search">
<div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>import httpx

resp = httpx.post("https://api.toolboxlite.com/v1/search",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"query": "OpenAI GPT-5", "count": 3})
results = resp.json()["data"]
for r in results:
    print(f"{r['title']} — {r['url']}")</pre></div></div>
</div>
<div class="tab-content" data-group="search">
<div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const resp = await fetch("https://api.toolboxlite.com/v1/search", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ query: "OpenAI GPT-5", count: 3 })
});
const { data } = await resp.json();
data.forEach(r => console.log(r.title, r.url));</pre></div></div>
</div>

<h3>Response</h3>
<div class="code-block"><div class="code-header"><span class="lang">JSON</span></div><div class="code-body"><pre>{
  <span class="json-key">"success"</span>: <span class="json-bool">true</span>,
  <span class="json-key">"data"</span>: [
    {
      <span class="json-key">"title"</span>: <span class="json-str">"OpenAI GPT-5 Release Details"</span>,
      <span class="json-key">"url"</span>: <span class="json-str">"https://example.com/gpt5"</span>,
      <span class="json-key">"snippet"</span>: <span class="json-str">"GPT-5 brings significant improvements..."</span>
    }
  ],
  <span class="json-key">"meta"</span>: { <span class="json-key">"requestId"</span>: <span class="json-str">"abc"</span>, <span class="json-key">"latencyMs"</span>: <span class="json-num">420</span>, <span class="json-key">"endpoint"</span>: <span class="json-str">"/v1/search"</span> }
}</pre></div></div>

<!-- EXTRACT -->
<h2 id="extract">POST /v1/extract</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/extract</div>
  <p>Extract readable content from any web page. Powered by Playwright + Readability.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>url</code></td><td>string</td><td>Yes</td><td>URL to extract from</td></tr>
<tr><td><code>format</code></td><td>string</td><td>No</td><td>"markdown" (default), "text", or "json"</td></tr>
</table>
<div class="tabs" data-group="extract"><div class="tab active" onclick="switchTab(this,'extract')">curl</div><div class="tab" onclick="switchTab(this,'extract')">Python</div><div class="tab" onclick="switchTab(this,'extract')">JavaScript</div></div>
<div class="tab-content active" data-group="extract"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "format": "markdown"}'</pre></div></div></div>
<div class="tab-content" data-group="extract"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/extract",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"url": "https://example.com", "format": "markdown"})
print(resp.json()["data"]["content"])</pre></div></div></div>
<div class="tab-content" data-group="extract"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/extract", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" })
}).then(r => r.json());
console.log(data.content);</pre></div></div></div>

<!-- SCREENSHOT -->
<h2 id="screenshot">POST /v1/screenshot</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/screenshot</div>
  <p>Capture a screenshot of any web page. Returns base64 PNG.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>url</code></td><td>string</td><td>Yes</td><td>URL to capture</td></tr>
<tr><td><code>width</code></td><td>integer</td><td>No</td><td>Viewport width (default 1280, max 1920)</td></tr>
<tr><td><code>height</code></td><td>integer</td><td>No</td><td>Viewport height (default 720, max 1080)</td></tr>
<tr><td><code>fullPage</code></td><td>boolean</td><td>No</td><td>Full page screenshot (default false)</td></tr>
</table>
<div class="tabs" data-group="ss"><div class="tab active" onclick="switchTab(this,'ss')">curl</div><div class="tab" onclick="switchTab(this,'ss')">Python</div><div class="tab" onclick="switchTab(this,'ss')">JavaScript</div></div>
<div class="tab-content active" data-group="ss"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/screenshot \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://news.ycombinator.com", "width": 1280, "height": 720}'</pre></div></div></div>
<div class="tab-content" data-group="ss"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>import base64
resp = httpx.post("https://api.toolboxlite.com/v1/screenshot",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"url": "https://news.ycombinator.com"})
img_b64 = resp.json()["data"]["base64"]
with open("screenshot.png", "wb") as f:
    f.write(base64.b64decode(img_b64))</pre></div></div></div>
<div class="tab-content" data-group="ss"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/screenshot", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://news.ycombinator.com" })
}).then(r => r.json());
// data.base64 contains the PNG image
fs.writeFileSync("screenshot.png", Buffer.from(data.base64, "base64"));</pre></div></div></div>

<!-- WEATHER -->
<h2 id="weather">POST /v1/weather</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/weather</div>
  <p>Current weather and forecast from Open-Meteo. Free, no API key needed on our side.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>location</code></td><td>string</td><td>Yes</td><td>City name or location</td></tr>
</table>
<div class="tabs" data-group="weather"><div class="tab active" onclick="switchTab(this,'weather')">curl</div><div class="tab" onclick="switchTab(this,'weather')">Python</div><div class="tab" onclick="switchTab(this,'weather')">JavaScript</div></div>
<div class="tab-content active" data-group="weather"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/weather \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"location": "San Francisco"}'</pre></div></div></div>
<div class="tab-content" data-group="weather"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/weather",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"location": "San Francisco"})
w = resp.json()["data"]["current"]
print(f"{w['temperature']}°C, {w['description']}")</pre></div></div></div>
<div class="tab-content" data-group="weather"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/weather", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ location: "San Francisco" })
}).then(r => r.json());
console.log(data.current.temperature + "°C");</pre></div></div></div>

<!-- FINANCE -->
<h2 id="finance">POST /v1/finance</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/finance</div>
  <p>Stock quotes and currency exchange rates via Yahoo Finance.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>symbol</code></td><td>string</td><td>For quotes</td><td>Stock ticker (e.g. "AAPL")</td></tr>
<tr><td><code>type</code></td><td>string</td><td>No</td><td>"quote" (default) or "exchange"</td></tr>
<tr><td><code>from</code></td><td>string</td><td>For exchange</td><td>Source currency (e.g. "USD")</td></tr>
<tr><td><code>to</code></td><td>string</td><td>For exchange</td><td>Target currency (e.g. "EUR")</td></tr>
<tr><td><code>amount</code></td><td>number</td><td>No</td><td>Amount to convert (default 1)</td></tr>
</table>
<div class="tabs" data-group="fin"><div class="tab active" onclick="switchTab(this,'fin')">curl (stock)</div><div class="tab" onclick="switchTab(this,'fin')">curl (exchange)</div><div class="tab" onclick="switchTab(this,'fin')">Python</div></div>
<div class="tab-content active" data-group="fin"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/finance \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol": "AAPL", "type": "quote"}'</pre></div></div></div>
<div class="tab-content" data-group="fin"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/finance \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"from": "USD", "to": "EUR", "amount": 100}'</pre></div></div></div>
<div class="tab-content" data-group="fin"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/finance",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"symbol": "AAPL", "type": "quote"})
q = resp.json()["data"]
print(f"AAPL: \{q['price']} ({q['changePercent']}%)")</pre></div></div></div>

<!-- VALIDATE EMAIL -->
<h2 id="validate-email">POST /v1/validate-email</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/validate-email</div>
  <p>Validate email: syntax, MX records, SMTP handshake, disposable domain detection. Zero cost.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>email</code></td><td>string</td><td>Yes</td><td>Email address to validate</td></tr>
</table>
<div class="tabs" data-group="email"><div class="tab active" onclick="switchTab(this,'email')">curl</div><div class="tab" onclick="switchTab(this,'email')">Python</div><div class="tab" onclick="switchTab(this,'email')">JavaScript</div></div>
<div class="tab-content active" data-group="email"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/validate-email \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@gmail.com"}'</pre></div></div></div>
<div class="tab-content" data-group="email"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/validate-email",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"email": "test@gmail.com"})
v = resp.json()["data"]
print(f"Verdict: {v['verdict']}, Score: {v['score']}, Disposable: {v['is_disposable']}")</pre></div></div></div>
<div class="tab-content" data-group="email"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/validate-email", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@gmail.com" })
}).then(r => r.json());
console.log(data.verdict, data.score);</pre></div></div></div>
<p>Verdicts: <code>deliverable</code> | <code>risky</code> | <code>undeliverable</code> | <code>invalid</code></p>

<!-- TRANSLATE -->
<h2 id="translate">POST /v1/translate</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/translate</div>
  <p>Translate text between 100+ languages. Auto-detection, Markdown preservation, glossary support, batch mode.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>text</code></td><td>string</td><td>Yes*</td><td>Text to translate (single mode)</td></tr>
<tr><td><code>texts</code></td><td>string[]</td><td>Yes*</td><td>Array of texts (batch mode, max 20)</td></tr>
<tr><td><code>target</code></td><td>string</td><td>Yes</td><td>Target language (ISO 639-1: zh, ja, es, fr...)</td></tr>
<tr><td><code>source</code></td><td>string</td><td>No</td><td>Source language (default "auto")</td></tr>
<tr><td><code>glossary</code></td><td>object</td><td>No</td><td>Term mapping, e.g. {"API": "API"}</td></tr>
</table>
<p>* Provide either <code>text</code> or <code>texts</code>, not both.</p>
<div class="tabs" data-group="translate"><div class="tab active" onclick="switchTab(this,'translate')">curl</div><div class="tab" onclick="switchTab(this,'translate')">Python (glossary)</div><div class="tab" onclick="switchTab(this,'translate')">JavaScript (batch)</div></div>
<div class="tab-content active" data-group="translate"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/translate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello, how are you?", "target": "zh"}'</pre></div></div></div>
<div class="tab-content" data-group="translate"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/translate",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "text": "The API endpoint returns JSON data.",
        "target": "zh",
        "glossary": {"API": "API", "JSON": "JSON", "endpoint": "&#31471;&#28857;"}
    })
print(resp.json()["data"]["translation"])
# API &#31471;&#28857; &#36820;&#22238; JSON &#25968;&#25454;&#12290;</pre></div></div></div>
<div class="tab-content" data-group="translate"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/translate", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ texts: ["Hello", "Goodbye"], target: "ja" })
}).then(r => r.json());
data.translations.forEach(t => console.log(t.translation));
// &#12371;&#12435;&#12395;&#12385;&#12399;
// &#12373;&#12424;&#12358;&#12394;&#12425;</pre></div></div></div>

<!-- NEWS -->
<h2 id="news">POST /v1/news</h2>
<div class="endpoint">
  <span class="badge badge-post">POST</span>
  <div class="endpoint-path">/v1/news</div>
  <p>Search and aggregate news articles from Google News. Filter by language, country, and category.</p>
</div>
<table>
<tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
<tr><td><code>query</code></td><td>string</td><td>Yes</td><td>News search query</td></tr>
<tr><td><code>language</code></td><td>string</td><td>No</td><td>Language code (default "en")</td></tr>
<tr><td><code>country</code></td><td>string</td><td>No</td><td>Country code (default "us")</td></tr>
<tr><td><code>category</code></td><td>string</td><td>No</td><td>business, technology, science, health, sports, entertainment, general</td></tr>
<tr><td><code>limit</code></td><td>integer</td><td>No</td><td>Results count (1-50, default 10)</td></tr>
</table>
<div class="tabs" data-group="news"><div class="tab active" onclick="switchTab(this,'news')">curl</div><div class="tab" onclick="switchTab(this,'news')">Python</div><div class="tab" onclick="switchTab(this,'news')">JavaScript</div></div>
<div class="tab-content active" data-group="news"><div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>curl -X POST https://api.toolboxlite.com/v1/news \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "artificial intelligence", "category": "technology", "limit": 5}'</pre></div></div></div>
<div class="tab-content" data-group="news"><div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>resp = httpx.post("https://api.toolboxlite.com/v1/news",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"query": "artificial intelligence", "category": "technology", "limit": 5})
for article in resp.json()["data"]["results"]:
    print(f"{article['source']}: {article['title']}")</pre></div></div></div>
<div class="tab-content" data-group="news"><div class="code-block"><div class="code-header"><span class="lang">JavaScript</span></div><div class="code-body"><pre>const { data } = await fetch("https://api.toolboxlite.com/v1/news", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({ query: "artificial intelligence", category: "technology", limit: 5 })
}).then(r => r.json());
data.results.forEach(a => console.log(a.source + ": " + a.title));</pre></div></div></div>

<!-- MCP SERVER -->
<h2 id="mcp">MCP Server Integration</h2>
<p>Use Agent Toolbox as an <a href="https://modelcontextprotocol.io">MCP server</a> in Claude Desktop, Cursor, Windsurf, or any MCP client.</p>

<h3>Install</h3>
<div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>npm install -g agent-toolbox-mcp</pre></div></div>

<h3>Claude Desktop</h3>
<p>Add to <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>:</p>
<div class="code-block"><div class="code-header"><span class="lang">JSON</span></div><div class="code-body"><pre>{
  <span class="json-key">"mcpServers"</span>: {
    <span class="json-key">"agent-toolbox"</span>: {
      <span class="json-key">"command"</span>: <span class="json-str">"agent-toolbox-mcp"</span>,
      <span class="json-key">"env"</span>: {}
    }
  }
}</pre></div></div>

<h3>Cursor</h3>
<p>Add to <code>.cursor/mcp.json</code>:</p>
<div class="code-block"><div class="code-header"><span class="lang">JSON</span></div><div class="code-body"><pre>{
  <span class="json-key">"mcpServers"</span>: {
    <span class="json-key">"agent-toolbox"</span>: {
      <span class="json-key">"command"</span>: <span class="json-str">"agent-toolbox-mcp"</span>
    }
  }
}</pre></div></div>

<h3>Available MCP Tools</h3>
<table>
<tr><th>Tool</th><th>Description</th></tr>
<tr><td><code>search</code></td><td>Web search</td></tr>
<tr><td><code>extract</code></td><td>Page content extraction</td></tr>
<tr><td><code>screenshot</code></td><td>Page screenshot</td></tr>
<tr><td><code>weather</code></td><td>Weather &amp; forecast</td></tr>
<tr><td><code>finance</code></td><td>Stocks &amp; exchange</td></tr>
<tr><td><code>validate_email</code></td><td>Email validation</td></tr>
<tr><td><code>translate</code></td><td>Text translation</td></tr>
<tr><td><code>news</code></td><td>News article search</td></tr>
</table>

<!-- LANGCHAIN -->
<h2 id="langchain">LangChain Integration</h2>
<div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>pip install langchain-agent-toolbox</pre></div></div>
<div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>import os
os.environ["AGENT_TOOLBOX_API_KEY"] = "atb_your_key"

from langchain_agent_toolbox import (
    AgentToolboxSearchTool,
    AgentToolboxWeatherTool,
    AgentToolboxTranslateTool,
)

# Use directly
search = AgentToolboxSearchTool()
result = search.invoke({"query": "LangChain agents", "count": 3})
print(result)

# Use with an agent
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

tools = [AgentToolboxSearchTool(), AgentToolboxWeatherTool(), AgentToolboxTranslateTool()]
llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with web tools."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)
print(executor.invoke({"input": "Weather in Tokyo, translated to French"}))</pre></div></div>

<!-- LLAMAINDEX -->
<h2 id="llamaindex">LlamaIndex Integration</h2>
<div class="code-block"><div class="code-header"><span class="lang">bash</span></div><div class="code-body"><pre>pip install llamaindex-agent-toolbox</pre></div></div>
<div class="code-block"><div class="code-header"><span class="lang">Python</span></div><div class="code-body"><pre>import os
os.environ["AGENT_TOOLBOX_API_KEY"] = "atb_your_key"

from llamaindex_agent_toolbox import AgentToolboxSearchTool, AgentToolboxWeatherTool

# Use directly
search = AgentToolboxSearchTool()
result = search.call(query="LlamaIndex agents", count=3)
print(result.content)

# Use with ReActAgent
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI

tools = [AgentToolboxSearchTool(), AgentToolboxWeatherTool()]
agent = ReActAgent.from_tools(tools, llm=OpenAI(model="gpt-4o"), verbose=True)
response = agent.chat("What's the weather in Berlin?")
print(response)</pre></div></div>

<!-- CACHING -->
<h2 id="caching">Caching</h2>
<p>Responses are cached server-side for identical requests. Cache behavior:</p>
<table>
<tr><th>Endpoint</th><th>Cache TTL</th></tr>
<tr><td>search, extract</td><td>5 minutes</td></tr>
<tr><td>weather, finance</td><td>15 minutes</td></tr>
<tr><td>screenshot, validate-email, translate</td><td>1 hour</td></tr>
</table>
<p>Check the <code>X-Cache</code> response header: <code>HIT</code> (cached) or <code>MISS</code> (fresh).</p>
<p>To bypass cache, send <code>Cache-Control: no-cache</code> header.</p>

<!-- PRICING -->
<h2 id="pricing">Pricing</h2>
<table>
<tr><th>Plan</th><th>Price</th><th>Requests/mo</th><th>Rate Limit</th></tr>
<tr><td><strong>Free</strong></td><td>$0</td><td>1,000</td><td>60/min</td></tr>
<tr><td><strong>Builder</strong></td><td>$0.005/call</td><td>Unlimited</td><td>60/min</td></tr>
<tr><td><strong>Pro</strong></td><td>$29/mo</td><td>50,000</td><td>120/min</td></tr>
<tr><td><strong>Scale</strong></td><td>$99/mo</td><td>500,000</td><td>300/min</td></tr>
</table>
<div class="alert">All plans include all 7 endpoints. No feature gating. The only difference is volume.</div>

</main>
</div>

<script>
function switchTab(el, group) {
  const tabs = el.parentElement.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const idx = Array.from(tabs).indexOf(el);
  const contents = document.querySelectorAll('.tab-content[data-group="'+group+'"]');
  contents.forEach((c, i) => c.classList.toggle('active', i === idx));
}
// Highlight sidebar on scroll
const sections = document.querySelectorAll('h2[id]');
const navLinks = document.querySelectorAll('.sidebar a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
});
</script>
</body>
</html>`;

docsPageRouter.get("/docs", (c) => {
  return c.html(docsHTML);
});

export { docsPageRouter };
