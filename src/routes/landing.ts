import { Hono } from "hono";

const landingRouter = new Hono();

const landingHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Production-ready REST API with 13 tools for AI agents: search, extract, weather, finance, screenshot, translate, news, WHOIS, DNS, PDF, QR and more. Free tier, MCP server, LangChain & LlamaIndex integrations.">
<meta name="keywords" content="AI agent tools, API, MCP server, LangChain, LlamaIndex, web search, web scraping, screenshot API, weather API, translate API">
<meta property="og:title" content="Agent Toolbox — 13 Tools for AI Agents">
<meta property="og:description" content="Give your AI agents real-world superpowers. Search, extract, screenshot, translate, and more — one API key, zero complexity.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://api.sendtoclaw.com">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Agent Toolbox — 13 Tools for AI Agents">
<meta name="twitter:description" content="Production-ready REST API for AI agents. 13 endpoints, MCP server, LangChain integration. Free tier available.">
<link rel="canonical" href="https://api.sendtoclaw.com">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Toolbox — Production-Ready APIs for AI Agents</title>
  <meta name="description" content="Search the web, extract content, capture screenshots, get weather and financial data — all through a single, fast API built for developers and AI agents.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #09090b;
      --surface: #111113;
      --surface-2: #18181b;
      --border: #27272a;
      --text: #fafafa;
      --text-secondary: #a1a1aa;
      --accent: #6366f1;
      --accent-hover: #818cf8;
      --success: #22c55e;
      --warning: #f59e0b;
      --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', monospace;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-sans);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { color: inherit; text-decoration: none; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* ── Nav ── */
    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(9,9,11,0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    .nav-logo {
      font-weight: 800;
      font-size: 1.15rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-logo .icon { font-size: 1.1rem; }
    .nav-links { display: flex; align-items: center; gap: 32px; }
    .nav-links a {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color 0.15s;
    }
    .nav-links a:hover { color: var(--text); }
    .nav-cta {
      background: var(--accent) !important;
      color: #fff !important;
      padding: 8px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.875rem;
      transition: background 0.15s;
    }
    .nav-cta:hover { background: var(--accent-hover) !important; }

    /* Mobile nav */
    .nav-toggle { display: none; background: none; border: none; color: var(--text); font-size: 1.5rem; cursor: pointer; padding: 4px; }
    @media (max-width: 768px) {
      .nav-links { display: none; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); padding: 16px 24px; gap: 16px; }
      .nav-links.open { display: flex; }
      .nav-toggle { display: block; }
    }

    /* ── Buttons ── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: var(--font-sans);
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--accent);
      color: #fff;
      box-shadow: 0 0 20px rgba(99,102,241,0.25);
    }
    .btn-primary:hover {
      background: var(--accent-hover);
      box-shadow: 0 0 30px rgba(99,102,241,0.35);
      transform: translateY(-1px);
    }
    .btn-outline {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-outline:hover {
      border-color: var(--accent);
      color: var(--accent-hover);
    }

    /* ── Hero ── */
    .hero {
      text-align: center;
      padding: 100px 0 80px;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 600px;
      background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 50px;
      padding: 6px 16px 6px 12px;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 28px;
    }
    .hero-badge .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .hero h1 {
      font-size: clamp(2.5rem, 5.5vw, 4rem);
      font-weight: 800;
      color: var(--text);
      line-height: 1.1;
      margin-bottom: 20px;
      letter-spacing: -0.03em;
    }
    .hero h1 .gradient {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 50%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 640px;
      margin: 0 auto 36px;
      line-height: 1.7;
    }
    .hero-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 60px; }

    /* ── Hero Code Block ── */
    .hero-code {
      max-width: 740px;
      margin: 0 auto;
      text-align: left;
      position: relative;
    }
    .code-window {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    .code-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--surface-2);
      border-bottom: 1px solid var(--border);
    }
    .code-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #27272a;
    }
    .code-dot:nth-child(1) { background: #ef4444; }
    .code-dot:nth-child(2) { background: #f59e0b; }
    .code-dot:nth-child(3) { background: #22c55e; }
    .code-header-title {
      margin-left: 8px;
      font-size: 0.78rem;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }
    .code-copy {
      margin-left: auto;
      background: none;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.72rem;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all 0.15s;
    }
    .code-copy:hover { border-color: var(--accent); color: var(--text); }
    .code-body {
      padding: 20px;
      overflow-x: auto;
    }
    .code-body pre {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      line-height: 1.7;
      color: var(--text-secondary);
      white-space: pre;
      margin: 0;
    }
    .code-body .tk-cmd { color: var(--success); }
    .code-body .tk-flag { color: var(--accent-hover); }
    .code-body .tk-url { color: #f59e0b; }
    .code-body .tk-str { color: #f59e0b; }
    .code-body .tk-key { color: var(--accent-hover); }
    .code-body .tk-val { color: var(--success); }
    .code-body .tk-num { color: #f59e0b; }
    .code-body .tk-bool { color: #f97316; }
    .code-body .tk-null { color: #64748b; }
    .code-body .tk-punct { color: #52525b; }
    .code-body .tk-comment { color: #52525b; font-style: italic; }

    /* Response preview */
    .response-preview {
      margin-top: -1px;
      border-top: 1px solid var(--border);
    }
    .response-label {
      padding: 10px 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(34,197,94,0.05);
      border-bottom: 1px solid var(--border);
    }
    .response-label .status { color: var(--success); }

    /* ── Section Shared ── */
    .section { padding: 100px 0; }
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-header h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .section-header p {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 500px;
      margin: 0 auto;
    }
    .divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: 0;
    }

    /* ── Features / Endpoints ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .features-grid { grid-template-columns: 1fr; } }

    .feature-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 28px;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
    }
    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
      opacity: 0;
      transition: opacity 0.25s;
    }
    .feature-card:hover {
      border-color: rgba(99,102,241,0.4);
      box-shadow: 0 0 30px rgba(99,102,241,0.08);
      transform: translateY(-2px);
    }
    .feature-card:hover::before { opacity: 1; }
    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    .feature-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .feature-card .desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .endpoint-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 10px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      margin-bottom: 14px;
    }
    .endpoint-badge .method {
      color: var(--success);
      font-weight: 700;
    }
    .endpoint-badge .path { color: var(--text-secondary); }
    .feature-example {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.6;
      overflow-x: auto;
    }

    /* ── How It Works ── */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      position: relative;
    }
    @media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr; gap: 24px; } }
    .step-card {
      text-align: center;
      padding: 36px 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      position: relative;
    }
    .step-number {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-weight: 800;
      font-size: 1.1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .step-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .step-card p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .step-code {
      display: inline-block;
      margin-top: 12px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 10px;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-secondary);
    }

    /* ── Live Demo ── */
    .demo-container {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
    }
    .demo-tabs {
      display: flex;
      gap: 0;
      border-bottom: 1px solid var(--border);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .demo-tab {
      padding: 14px 24px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      border: none;
      background: none;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      font-family: var(--font-sans);
    }
    .demo-tab:hover { color: var(--text); }
    .demo-tab.active {
      color: var(--accent-hover);
      border-bottom-color: var(--accent);
      background: rgba(99,102,241,0.05);
    }
    .demo-panels { display: grid; grid-template-columns: 1fr 1fr; min-height: 340px; }
    @media (max-width: 768px) { .demo-panels { grid-template-columns: 1fr; } }
    .demo-panel {
      padding: 24px;
      overflow: auto;
    }
    .demo-panel-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    .demo-panel:first-child { border-right: 1px solid var(--border); }
    @media (max-width: 768px) { .demo-panel:first-child { border-right: none; border-bottom: 1px solid var(--border); } }
    .demo-content { display: none; }
    .demo-content.active { display: block; }
    .demo-pre {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.7;
      color: var(--text-secondary);
      white-space: pre;
      margin: 0;
    }

    /* ── Pricing ── */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      align-items: start;
    }
    @media (max-width: 900px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 550px) { .pricing-grid { grid-template-columns: 1fr; } }
    .pricing-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 32px 24px;
      text-align: center;
      position: relative;
      transition: all 0.25s;
    }
    .pricing-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .pricing-card.popular {
      border-color: var(--accent);
      box-shadow: 0 0 40px rgba(99,102,241,0.15);
    }
    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pricing-card h3 {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text);
    }
    .pricing-price {
      font-size: 2.8rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 2px;
    }
    .pricing-period {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 24px;
    }
    .pricing-features {
      list-style: none;
      text-align: left;
      margin-bottom: 28px;
    }
    .pricing-features li {
      font-size: 0.85rem;
      color: var(--text-secondary);
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pricing-features li:last-child { border-bottom: none; }
    .pricing-features .check { color: var(--success); font-size: 0.9rem; }
    .pricing-card .btn { width: 100%; }

    /* ── Code Examples ── */
    .code-tabs {
      display: flex;
      gap: 0;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 12px 12px 0 0;
      overflow-x: auto;
    }
    .code-tab {
      padding: 12px 24px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      border: none;
      background: none;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-family: var(--font-sans);
      border-bottom: 2px solid transparent;
    }
    .code-tab:hover { color: var(--text); }
    .code-tab.active {
      color: var(--accent-hover);
      border-bottom-color: var(--accent);
      background: rgba(99,102,241,0.05);
    }
    .code-tab-panel { display: none; }
    .code-tab-panel.active { display: block; }
    .code-examples-window {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0 0 12px 12px;
      overflow: hidden;
    }
    .code-examples-window .code-body { padding: 24px; }

    /* ── Get Started ── */
    .get-started {
      text-align: center;
      padding: 100px 0;
      position: relative;
    }
    .get-started::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 400px;
      background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .get-started h2 {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .get-started > p {
      color: var(--text-secondary);
      font-size: 1.05rem;
      margin-bottom: 40px;
    }
    .get-started .note {
      margin-top: 20px;
      color: var(--text-secondary);
      font-size: 0.88rem;
    }
    .get-started .note strong { color: var(--success); font-weight: 600; }

    /* ── Footer ── */
    footer {
      border-top: 1px solid var(--border);
      padding: 32px 0;
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-brand {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .footer-links { display: flex; gap: 24px; }
    .footer-links a {
      font-size: 0.85rem;
      color: var(--text-secondary);
      transition: color 0.15s;
    }
    .footer-links a:hover { color: var(--text); }
    @media (max-width: 550px) {
      .footer-inner { flex-direction: column; text-align: center; }
    }

    /* ── Utilities ── */
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

<!-- Navigation -->
<nav>
  <div class="container nav-inner">
    <a href="/" class="nav-logo"><span class="icon">&#9889;</span> Agent Toolbox</a>
    <button class="nav-toggle" aria-label="Toggle navigation" onclick="document.querySelector('.nav-links').classList.toggle('open')">&#9776;</button>
    <div class="nav-links">
      <a href="/docs">Docs</a>
      <a href="/playground">Playground</a>
      <a href="#pricing">Pricing</a>
      <a href="#get-started" class="nav-cta">Get API Key</a>
    </div>
  </div>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="container">
    <div class="hero-badge"><span class="dot"></span> v1 API — Stable &amp; Production Ready</div>
    <h1>Production-Ready APIs<br>for <span class="gradient">AI Agents</span></h1>
    <p>Search the web, extract content, capture screenshots, get weather and financial data &mdash; all through a single, fast API. Built for developers and AI agents.</p>
    <div class="hero-buttons">
      <a href="#get-started" class="btn btn-primary">Get Free API Key</a>
      <a href="/v1/docs" class="btn btn-outline">View Documentation</a>
    </div>
    <div class="hero-code">
      <div class="code-window">
        <div class="code-header">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-header-title">Terminal</span>
          <button class="code-copy" onclick="copyCode(this, 'hero-curl')">Copy</button>
        </div>
        <div class="code-body">
          <pre id="hero-curl"><span class="tk-cmd">curl</span> <span class="tk-flag">-X</span> POST <span class="tk-url">https://api.agenttoolbox.dev/v1/search</span> \\
  <span class="tk-flag">-H</span> <span class="tk-str">"Authorization: Bearer atb_your_key"</span> \\
  <span class="tk-flag">-H</span> <span class="tk-str">"Content-Type: application/json"</span> \\
  <span class="tk-flag">-d</span> <span class="tk-str">'{"query": "latest AI research", "count": 5}'</span></pre>
        </div>
        <div class="response-preview">
          <div class="response-label"><span class="status">200 OK</span> &mdash; Response</div>
          <div class="code-body">
            <pre><span class="tk-punct">{</span>
  <span class="tk-key">"results"</span><span class="tk-punct">:</span> <span class="tk-punct">[</span>
    <span class="tk-punct">{</span>
      <span class="tk-key">"title"</span><span class="tk-punct">:</span> <span class="tk-str">"Advances in Large Language Models 2025"</span><span class="tk-punct">,</span>
      <span class="tk-key">"url"</span><span class="tk-punct">:</span> <span class="tk-str">"https://arxiv.org/abs/2501.00001"</span><span class="tk-punct">,</span>
      <span class="tk-key">"snippet"</span><span class="tk-punct">:</span> <span class="tk-str">"A comprehensive survey of recent advances..."</span>
    <span class="tk-punct">}</span>
  <span class="tk-punct">]</span><span class="tk-punct">,</span>
  <span class="tk-key">"count"</span><span class="tk-punct">:</span> <span class="tk-num">5</span>
<span class="tk-punct">}</span></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- Features / Endpoints -->
<section class="section" id="features">
  <div class="container">
    <div class="section-header fade-in">
      <h2>Five Powerful Endpoints</h2>
      <p>Everything your AI agent needs in a single, unified API.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card fade-in">
        <div class="feature-icon">&#128269;</div>
        <h3>Web Search</h3>
        <p class="desc">Search the web via DuckDuckGo. Structured results with titles, URLs, and snippets.</p>
        <div class="endpoint-badge"><span class="method">POST</span> <span class="path">/v1/search</span></div>
        <div class="feature-example"><span class="tk-punct">{</span> <span class="tk-key">"query"</span>: <span class="tk-str">"latest AI news"</span>, <span class="tk-key">"count"</span>: <span class="tk-num">5</span> <span class="tk-punct">}</span></div>
      </div>
      <div class="feature-card fade-in">
        <div class="feature-icon">&#128196;</div>
        <h3>Content Extract</h3>
        <p class="desc">Extract clean, readable content from any URL. Markdown, text, or JSON output.</p>
        <div class="endpoint-badge"><span class="method">POST</span> <span class="path">/v1/extract</span></div>
        <div class="feature-example"><span class="tk-punct">{</span> <span class="tk-key">"url"</span>: <span class="tk-str">"https://example.com"</span>, <span class="tk-key">"format"</span>: <span class="tk-str">"markdown"</span> <span class="tk-punct">}</span></div>
      </div>
      <div class="feature-card fade-in">
        <div class="feature-icon">&#128248;</div>
        <h3>Screenshot</h3>
        <p class="desc">Capture full-page or viewport screenshots of any website as PNG.</p>
        <div class="endpoint-badge"><span class="method">POST</span> <span class="path">/v1/screenshot</span></div>
        <div class="feature-example"><span class="tk-punct">{</span> <span class="tk-key">"url"</span>: <span class="tk-str">"https://example.com"</span>, <span class="tk-key">"fullPage"</span>: <span class="tk-bool">true</span> <span class="tk-punct">}</span></div>
      </div>
      <div class="feature-card fade-in">
        <div class="feature-icon">&#9925;</div>
        <h3>Weather</h3>
        <p class="desc">Current conditions and 7-day forecasts for any location worldwide.</p>
        <div class="endpoint-badge"><span class="method">POST</span> <span class="path">/v1/weather</span></div>
        <div class="feature-example"><span class="tk-punct">{</span> <span class="tk-key">"location"</span>: <span class="tk-str">"San Francisco, CA"</span> <span class="tk-punct">}</span></div>
      </div>
      <div class="feature-card fade-in">
        <div class="feature-icon">&#128200;</div>
        <h3>Finance</h3>
        <p class="desc">Real-time stock quotes, historical data, and currency exchange rates.</p>
        <div class="endpoint-badge"><span class="method">POST</span> <span class="path">/v1/finance</span></div>
        <div class="feature-example"><span class="tk-punct">{</span> <span class="tk-key">"symbol"</span>: <span class="tk-str">"AAPL"</span>, <span class="tk-key">"type"</span>: <span class="tk-str">"quote"</span> <span class="tk-punct">}</span></div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- How It Works -->
<section class="section" id="how-it-works">
  <div class="container">
    <div class="section-header fade-in">
      <h2>How It Works</h2>
      <p>Three steps to integrate. No complex setup required.</p>
    </div>
    <div class="steps-grid">
      <div class="step-card fade-in">
        <div class="step-number">1</div>
        <h3>Get your API key</h3>
        <p>Register with your email. Your key is returned instantly &mdash; no approval wait.</p>
        <div class="step-code">POST /v1/auth/register</div>
      </div>
      <div class="step-card fade-in">
        <div class="step-number">2</div>
        <h3>Make requests</h3>
        <p>Use any HTTP client &mdash; curl, Python requests, fetch, or your favorite SDK.</p>
        <div class="step-code">Authorization: Bearer atb_***</div>
      </div>
      <div class="step-card fade-in">
        <div class="step-number">3</div>
        <h3>Build amazing things</h3>
        <p>Integrate into your AI agent, app, or workflow. Scale as you grow.</p>
        <div class="step-code">1,000 free calls/month</div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- Live Demo -->
<section class="section" id="demo">
  <div class="container">
    <div class="section-header fade-in">
      <h2>Try the API</h2>
      <p>Explore real request and response examples for each endpoint.</p>
    </div>
    <div class="demo-container fade-in">
      <div class="demo-tabs">
        <button class="demo-tab active" data-demo="search">&#128269; Search</button>
        <button class="demo-tab" data-demo="extract">&#128196; Extract</button>
        <button class="demo-tab" data-demo="weather">&#9925; Weather</button>
        <button class="demo-tab" data-demo="finance">&#128200; Finance</button>
        <button class="demo-tab" data-demo="screenshot">&#128248; Screenshot</button>
      </div>
      <div class="demo-panels">
        <div class="demo-panel">
          <div class="demo-panel-label">Request</div>
          <div class="demo-content active" data-demo="search">
            <pre class="demo-pre"><span class="tk-cmd">POST</span> <span class="tk-url">/v1/search</span>

<span class="tk-punct">{</span>
  <span class="tk-key">"query"</span><span class="tk-punct">:</span> <span class="tk-str">"latest AI research"</span><span class="tk-punct">,</span>
  <span class="tk-key">"count"</span><span class="tk-punct">:</span> <span class="tk-num">5</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="extract">
            <pre class="demo-pre"><span class="tk-cmd">POST</span> <span class="tk-url">/v1/extract</span>

<span class="tk-punct">{</span>
  <span class="tk-key">"url"</span><span class="tk-punct">:</span> <span class="tk-str">"https://openai.com/blog"</span><span class="tk-punct">,</span>
  <span class="tk-key">"format"</span><span class="tk-punct">:</span> <span class="tk-str">"markdown"</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="weather">
            <pre class="demo-pre"><span class="tk-cmd">POST</span> <span class="tk-url">/v1/weather</span>

<span class="tk-punct">{</span>
  <span class="tk-key">"location"</span><span class="tk-punct">:</span> <span class="tk-str">"San Francisco, CA"</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="finance">
            <pre class="demo-pre"><span class="tk-cmd">POST</span> <span class="tk-url">/v1/finance</span>

<span class="tk-punct">{</span>
  <span class="tk-key">"symbol"</span><span class="tk-punct">:</span> <span class="tk-str">"AAPL"</span><span class="tk-punct">,</span>
  <span class="tk-key">"type"</span><span class="tk-punct">:</span> <span class="tk-str">"quote"</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="screenshot">
            <pre class="demo-pre"><span class="tk-cmd">POST</span> <span class="tk-url">/v1/screenshot</span>

<span class="tk-punct">{</span>
  <span class="tk-key">"url"</span><span class="tk-punct">:</span> <span class="tk-str">"https://github.com"</span><span class="tk-punct">,</span>
  <span class="tk-key">"fullPage"</span><span class="tk-punct">:</span> <span class="tk-bool">false</span><span class="tk-punct">,</span>
  <span class="tk-key">"width"</span><span class="tk-punct">:</span> <span class="tk-num">1280</span>
<span class="tk-punct">}</span></pre>
          </div>
        </div>
        <div class="demo-panel">
          <div class="demo-panel-label">Response</div>
          <div class="demo-content active" data-demo="search">
            <pre class="demo-pre"><span class="tk-punct">{</span>
  <span class="tk-key">"results"</span><span class="tk-punct">:</span> <span class="tk-punct">[</span>
    <span class="tk-punct">{</span>
      <span class="tk-key">"title"</span><span class="tk-punct">:</span> <span class="tk-str">"Advances in LLMs 2025"</span><span class="tk-punct">,</span>
      <span class="tk-key">"url"</span><span class="tk-punct">:</span> <span class="tk-str">"https://arxiv.org/..."</span><span class="tk-punct">,</span>
      <span class="tk-key">"snippet"</span><span class="tk-punct">:</span> <span class="tk-str">"A survey of recent..."</span>
    <span class="tk-punct">}</span>
  <span class="tk-punct">]</span><span class="tk-punct">,</span>
  <span class="tk-key">"count"</span><span class="tk-punct">:</span> <span class="tk-num">5</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="extract">
            <pre class="demo-pre"><span class="tk-punct">{</span>
  <span class="tk-key">"title"</span><span class="tk-punct">:</span> <span class="tk-str">"OpenAI Blog"</span><span class="tk-punct">,</span>
  <span class="tk-key">"content"</span><span class="tk-punct">:</span> <span class="tk-str">"# Latest Updates\\n\\n..."</span><span class="tk-punct">,</span>
  <span class="tk-key">"format"</span><span class="tk-punct">:</span> <span class="tk-str">"markdown"</span><span class="tk-punct">,</span>
  <span class="tk-key">"wordCount"</span><span class="tk-punct">:</span> <span class="tk-num">1243</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="weather">
            <pre class="demo-pre"><span class="tk-punct">{</span>
  <span class="tk-key">"location"</span><span class="tk-punct">:</span> <span class="tk-str">"San Francisco, CA"</span><span class="tk-punct">,</span>
  <span class="tk-key">"current"</span><span class="tk-punct">:</span> <span class="tk-punct">{</span>
    <span class="tk-key">"temp"</span><span class="tk-punct">:</span> <span class="tk-num">62</span><span class="tk-punct">,</span>
    <span class="tk-key">"condition"</span><span class="tk-punct">:</span> <span class="tk-str">"Partly Cloudy"</span><span class="tk-punct">,</span>
    <span class="tk-key">"humidity"</span><span class="tk-punct">:</span> <span class="tk-num">72</span>
  <span class="tk-punct">}</span><span class="tk-punct">,</span>
  <span class="tk-key">"forecast"</span><span class="tk-punct">:</span> <span class="tk-punct">[</span><span class="tk-comment">/* 7 days */</span><span class="tk-punct">]</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="finance">
            <pre class="demo-pre"><span class="tk-punct">{</span>
  <span class="tk-key">"symbol"</span><span class="tk-punct">:</span> <span class="tk-str">"AAPL"</span><span class="tk-punct">,</span>
  <span class="tk-key">"price"</span><span class="tk-punct">:</span> <span class="tk-num">198.52</span><span class="tk-punct">,</span>
  <span class="tk-key">"change"</span><span class="tk-punct">:</span> <span class="tk-num">+2.34</span><span class="tk-punct">,</span>
  <span class="tk-key">"changePercent"</span><span class="tk-punct">:</span> <span class="tk-str">"+1.19%"</span><span class="tk-punct">,</span>
  <span class="tk-key">"volume"</span><span class="tk-punct">:</span> <span class="tk-num">54123890</span>
<span class="tk-punct">}</span></pre>
          </div>
          <div class="demo-content" data-demo="screenshot">
            <pre class="demo-pre"><span class="tk-punct">{</span>
  <span class="tk-key">"url"</span><span class="tk-punct">:</span> <span class="tk-str">"https://github.com"</span><span class="tk-punct">,</span>
  <span class="tk-key">"image"</span><span class="tk-punct">:</span> <span class="tk-str">"data:image/png;base64,..."</span><span class="tk-punct">,</span>
  <span class="tk-key">"width"</span><span class="tk-punct">:</span> <span class="tk-num">1280</span><span class="tk-punct">,</span>
  <span class="tk-key">"height"</span><span class="tk-punct">:</span> <span class="tk-num">800</span>
<span class="tk-punct">}</span></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- Pricing -->
<section class="section" id="pricing">
  <div class="container">
    <div class="section-header fade-in">
      <h2>Simple, Transparent Pricing</h2>
      <p>Start free. Scale when you're ready.</p>
    </div>
    <div class="pricing-grid fade-in">
      <div class="pricing-card">
        <h3>Free</h3>
        <div class="pricing-price">$0</div>
        <div class="pricing-period">forever</div>
        <ul class="pricing-features">
          <li><span class="check">&#10003;</span> 1,000 calls / month</li>
          <li><span class="check">&#10003;</span> 60 requests / min</li>
          <li><span class="check">&#10003;</span> All 5 endpoints</li>
          <li><span class="check">&#10003;</span> Community support</li>
        </ul>
        <a href="#get-started" class="btn btn-outline">Get Started Free</a>
      </div>
      <div class="pricing-card">
        <h3>Builder</h3>
        <div class="pricing-price">$0</div>
        <div class="pricing-period">pay as you go</div>
        <ul class="pricing-features">
          <li><span class="check">&#10003;</span> Unlimited calls</li>
          <li><span class="check">&#10003;</span> 60 requests / min</li>
          <li><span class="check">&#10003;</span> $0.005 per call</li>
          <li><span class="check">&#10003;</span> Email support</li>
        </ul>
        <a href="#get-started" class="btn btn-outline">$0.005 / call</a>
      </div>
      <div class="pricing-card popular">
        <div class="popular-badge">Most Popular</div>
        <h3>Pro</h3>
        <div class="pricing-price">$29</div>
        <div class="pricing-period">/ month</div>
        <ul class="pricing-features">
          <li><span class="check">&#10003;</span> 50,000 calls / month</li>
          <li><span class="check">&#10003;</span> 120 requests / min</li>
          <li><span class="check">&#10003;</span> All 5 endpoints</li>
          <li><span class="check">&#10003;</span> Priority support</li>
        </ul>
        <a href="#get-started" class="btn btn-primary">Start Pro Trial</a>
      </div>
      <div class="pricing-card">
        <h3>Scale</h3>
        <div class="pricing-price">$99</div>
        <div class="pricing-period">/ month</div>
        <ul class="pricing-features">
          <li><span class="check">&#10003;</span> 500,000 calls / month</li>
          <li><span class="check">&#10003;</span> 300 requests / min</li>
          <li><span class="check">&#10003;</span> All 5 endpoints</li>
          <li><span class="check">&#10003;</span> Dedicated support</li>
        </ul>
        <a href="#get-started" class="btn btn-outline">Contact Sales</a>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- Code Examples -->
<section class="section" id="examples">
  <div class="container">
    <div class="section-header fade-in">
      <h2>Works With Everything</h2>
      <p>Use any language or tool you prefer.</p>
    </div>
    <div class="fade-in">
      <div class="code-tabs">
        <button class="code-tab active" data-lang="curl">curl</button>
        <button class="code-tab" data-lang="python">Python</button>
        <button class="code-tab" data-lang="javascript">JavaScript</button>
      </div>
      <div class="code-examples-window">
        <div class="code-body">
          <div class="code-tab-panel active" data-lang="curl">
            <pre><span class="tk-cmd">curl</span> <span class="tk-flag">-X</span> POST <span class="tk-url">https://api.agenttoolbox.dev/v1/search</span> \\
  <span class="tk-flag">-H</span> <span class="tk-str">"Authorization: Bearer atb_your_key"</span> \\
  <span class="tk-flag">-H</span> <span class="tk-str">"Content-Type: application/json"</span> \\
  <span class="tk-flag">-d</span> <span class="tk-str">'{"query": "latest AI research", "count": 5}'</span></pre>
          </div>
          <div class="code-tab-panel" data-lang="python">
            <pre><span class="tk-flag">import</span> requests

response <span class="tk-punct">=</span> requests<span class="tk-punct">.</span>post<span class="tk-punct">(</span>
    <span class="tk-str">"https://api.agenttoolbox.dev/v1/search"</span><span class="tk-punct">,</span>
    headers<span class="tk-punct">={</span>
        <span class="tk-str">"Authorization"</span><span class="tk-punct">:</span> <span class="tk-str">"Bearer atb_your_key"</span><span class="tk-punct">,</span>
        <span class="tk-str">"Content-Type"</span><span class="tk-punct">:</span> <span class="tk-str">"application/json"</span>
    <span class="tk-punct">},</span>
    json<span class="tk-punct">={</span>
        <span class="tk-str">"query"</span><span class="tk-punct">:</span> <span class="tk-str">"latest AI research"</span><span class="tk-punct">,</span>
        <span class="tk-str">"count"</span><span class="tk-punct">:</span> <span class="tk-num">5</span>
    <span class="tk-punct">}</span>
<span class="tk-punct">)</span>

data <span class="tk-punct">=</span> response<span class="tk-punct">.</span>json<span class="tk-punct">()</span>
<span class="tk-flag">print</span><span class="tk-punct">(</span>data<span class="tk-punct">[</span><span class="tk-str">"results"</span><span class="tk-punct">])</span></pre>
          </div>
          <div class="code-tab-panel" data-lang="javascript">
            <pre><span class="tk-flag">const</span> response <span class="tk-punct">=</span> <span class="tk-flag">await</span> <span class="tk-cmd">fetch</span><span class="tk-punct">(</span>
  <span class="tk-str">"https://api.agenttoolbox.dev/v1/search"</span><span class="tk-punct">,</span>
  <span class="tk-punct">{</span>
    method<span class="tk-punct">:</span> <span class="tk-str">"POST"</span><span class="tk-punct">,</span>
    headers<span class="tk-punct">:</span> <span class="tk-punct">{</span>
      <span class="tk-str">"Authorization"</span><span class="tk-punct">:</span> <span class="tk-str">"Bearer atb_your_key"</span><span class="tk-punct">,</span>
      <span class="tk-str">"Content-Type"</span><span class="tk-punct">:</span> <span class="tk-str">"application/json"</span>
    <span class="tk-punct">},</span>
    body<span class="tk-punct">:</span> JSON<span class="tk-punct">.</span>stringify<span class="tk-punct">({</span>
      query<span class="tk-punct">:</span> <span class="tk-str">"latest AI research"</span><span class="tk-punct">,</span>
      count<span class="tk-punct">:</span> <span class="tk-num">5</span>
    <span class="tk-punct">})</span>
  <span class="tk-punct">}</span>
<span class="tk-punct">);</span>

<span class="tk-flag">const</span> data <span class="tk-punct">=</span> <span class="tk-flag">await</span> response<span class="tk-punct">.</span>json<span class="tk-punct">();</span>
console<span class="tk-punct">.</span>log<span class="tk-punct">(</span>data<span class="tk-punct">.</span>results<span class="tk-punct">);</span></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<hr class="divider">

<!-- Get Started -->
<section class="get-started" id="get-started">
  <div class="container">
    <h2 class="fade-in">Start building in 30 seconds</h2>
    <p class="fade-in">Register for a free API key with a single request.</p>
    <div class="hero-code fade-in" style="max-width:680px;margin:0 auto;">
      <div class="code-window">
        <div class="code-header">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-header-title">Terminal</span>
          <button class="code-copy" onclick="copyCode(this, 'register-curl')">Copy</button>
        </div>
        <div class="code-body">
          <pre id="register-curl"><span class="tk-cmd">curl</span> <span class="tk-flag">-X</span> POST <span class="tk-url">https://api.agenttoolbox.dev/v1/auth/register</span> \\
  <span class="tk-flag">-H</span> <span class="tk-str">"Content-Type: application/json"</span> \\
  <span class="tk-flag">-d</span> <span class="tk-str">'{"email": "you@example.com"}'</span></pre>
        </div>
        <div class="response-preview">
          <div class="response-label"><span class="status">200 OK</span> &mdash; Response</div>
          <div class="code-body">
            <pre><span class="tk-punct">{</span>
  <span class="tk-key">"apiKey"</span><span class="tk-punct">:</span> <span class="tk-str">"atb_live_a1b2c3d4e5f6..."</span><span class="tk-punct">,</span>
  <span class="tk-key">"message"</span><span class="tk-punct">:</span> <span class="tk-str">"API key created successfully"</span>
<span class="tk-punct">}</span></pre>
          </div>
        </div>
      </div>
    </div>
    <p class="note fade-in"><strong>No credit card required.</strong> Your API key is returned instantly.</p>
  </div>
</section>

<!-- Footer -->
<footer>
  <div class="container footer-inner">
    <div class="footer-brand">&#9889; Agent Toolbox &copy; 2025</div>
    <div class="footer-links">
      <a href="/docs">Docs</a>
      <a href="/playground">Playground</a>
      <a href="https://github.com/agenttoolbox">GitHub</a>
      <a href="#pricing">Pricing</a>
    </div>
  </div>
</footer>

<script>
  // Tab switching for demo section
  document.querySelectorAll('.demo-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var key = this.getAttribute('data-demo');
      document.querySelectorAll('.demo-tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.demo-content').forEach(function(c) { c.classList.remove('active'); });
      document.querySelectorAll('.demo-content[data-demo="' + key + '"]').forEach(function(c) { c.classList.add('active'); });
    });
  });

  // Tab switching for code examples
  document.querySelectorAll('.code-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var lang = this.getAttribute('data-lang');
      document.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.code-tab-panel').forEach(function(p) { p.classList.remove('active'); });
      document.querySelectorAll('.code-tab-panel[data-lang="' + lang + '"]').forEach(function(p) { p.classList.add('active'); });
    });
  });

  // Copy to clipboard
  function copyCode(btn, id) {
    var el = document.getElementById(id);
    if (el) {
      var text = el.textContent || el.innerText;
      navigator.clipboard.writeText(text).then(function() {
        btn.textContent = 'Copied!';
        setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
      });
    }
  }

  // Fade-in on scroll
  (function() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
  })();
</script>
</body>
</html>`;

landingRouter.get("/", (c) => {
  return c.html(landingHTML);
});

export { landingRouter };
