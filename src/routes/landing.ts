import { Hono } from "hono";

const landingRouter = new Hono();

const landingHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Toolbox API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    a { color: #60a5fa; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    /* Hero */
    .hero {
      text-align: center;
      padding: 80px 0 60px;
      border-bottom: 1px solid #1e1e1e;
    }
    .hero h1 {
      font-size: 2.8rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
    }
    .hero h1 span { color: #60a5fa; }
    .hero p {
      font-size: 1.15rem;
      color: #999;
      max-width: 600px;
      margin: 0 auto 32px;
    }
    .hero-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity .15s;
    }
    .btn:hover { opacity: 0.85; text-decoration: none; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-secondary { background: #1e1e1e; color: #e0e0e0; border: 1px solid #333; }

    /* Features */
    .features { padding: 64px 0; border-bottom: 1px solid #1e1e1e; }
    .features h2 { text-align: center; font-size: 1.8rem; color: #fff; margin-bottom: 40px; }
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .feature-card {
      background: #111;
      border: 1px solid #1e1e1e;
      border-radius: 12px;
      padding: 24px;
    }
    .feature-card h3 { color: #fff; margin-bottom: 8px; font-size: 1.05rem; }
    .feature-card p { color: #888; font-size: 0.9rem; }
    .feature-card .icon { font-size: 1.6rem; margin-bottom: 12px; }

    /* Pricing */
    .pricing { padding: 64px 0; border-bottom: 1px solid #1e1e1e; }
    .pricing h2 { text-align: center; font-size: 1.8rem; color: #fff; margin-bottom: 40px; }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }
    .pricing-card {
      background: #111;
      border: 1px solid #1e1e1e;
      border-radius: 12px;
      padding: 28px;
      text-align: center;
    }
    .pricing-card.highlight { border-color: #2563eb; }
    .pricing-card h3 { color: #fff; font-size: 1.2rem; margin-bottom: 8px; }
    .pricing-card .price { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .pricing-card .period { color: #666; font-size: 0.85rem; margin-bottom: 16px; }
    .pricing-card .limit { color: #999; font-size: 0.95rem; margin-bottom: 20px; }
    .pricing-card .btn { width: 100%; text-align: center; }

    /* CTA */
    .cta { padding: 64px 0; text-align: center; }
    .cta h2 { font-size: 1.6rem; color: #fff; margin-bottom: 12px; }
    .cta p { color: #888; margin-bottom: 24px; }
    .cta code {
      display: inline-block;
      background: #1a1a2e;
      color: #60a5fa;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 24px;
    }

    footer {
      text-align: center;
      padding: 32px 0;
      color: #555;
      font-size: 0.85rem;
      border-top: 1px solid #1e1e1e;
    }
  </style>
</head>
<body>
  <div class="container">
    <section class="hero">
      <h1>Agent <span>Toolbox</span> API</h1>
      <p>Production-ready tools for AI agents. Search, extract, screenshot, weather &amp; finance APIs.</p>
      <div class="hero-buttons">
        <a href="/v1/docs" class="btn btn-primary">API Docs</a>
        <a href="#pricing" class="btn btn-secondary">View Pricing</a>
      </div>
    </section>

    <section class="features">
      <h2>Endpoints</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">&#128269;</div>
          <h3>Web Search</h3>
          <p>Search the web via DuckDuckGo. Returns structured results with titles, URLs, and snippets.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128196;</div>
          <h3>Content Extract</h3>
          <p>Extract clean content from any URL. Markdown, text, or structured JSON output.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128247;</div>
          <h3>Screenshot</h3>
          <p>Capture full-page or viewport screenshots of any website as PNG.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#9748;</div>
          <h3>Weather</h3>
          <p>Current conditions and 7-day forecasts for any location worldwide.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128200;</div>
          <h3>Finance</h3>
          <p>Stock quotes, historical data, and currency exchange rates.</p>
        </div>
      </div>
    </section>

    <section class="pricing" id="pricing">
      <h2>Pricing</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Free</h3>
          <div class="price">$0</div>
          <div class="period">forever</div>
          <div class="limit">1,000 calls/month</div>
          <a href="/v1/auth/register" class="btn btn-secondary">Get Free Key</a>
        </div>
        <div class="pricing-card">
          <h3>Builder</h3>
          <div class="price">$0</div>
          <div class="period">pay as you go</div>
          <div class="limit">$0.005/call</div>
          <a href="/v1/docs" class="btn btn-secondary">Contact Us</a>
        </div>
        <div class="pricing-card highlight">
          <h3>Pro</h3>
          <div class="price">$29</div>
          <div class="period">/month</div>
          <div class="limit">50,000 calls/month</div>
          <a href="/v1/docs" class="btn btn-primary">Upgrade</a>
        </div>
        <div class="pricing-card">
          <h3>Scale</h3>
          <div class="price">$99</div>
          <div class="period">/month</div>
          <div class="limit">500,000 calls/month</div>
          <a href="/v1/docs" class="btn btn-secondary">Upgrade</a>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Get Started in Seconds</h2>
      <p>Register for a free API key and start making requests.</p>
      <code>curl -X POST https://your-domain/v1/auth/register -H "Content-Type: application/json" -d '{"email":"you@example.com"}'</code>
      <br>
      <a href="/v1/docs" class="btn btn-primary">Read the Docs</a>
    </section>
  </div>
  <footer>Agent Toolbox API &mdash; Built for AI agents.</footer>
</body>
</html>`;

landingRouter.get("/", (c) => {
  return c.html(landingHTML);
});

export { landingRouter };
