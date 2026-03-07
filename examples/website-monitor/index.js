#!/usr/bin/env node
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";

const API_KEY = process.env.AGENT_TOOLBOX_API_KEY;
const BASE = process.env.AGENT_TOOLBOX_BASE_URL || "https://api.toolboxlite.com";

if (!API_KEY) { console.error("Error: Set AGENT_TOOLBOX_API_KEY env var"); process.exit(1); }

async function call(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Parse args
let urls = [];
if (process.argv.includes("--file")) {
  const file = process.argv[process.argv.indexOf("--file") + 1];
  urls = JSON.parse(readFileSync(file, "utf-8"));
} else if (process.argv[2]) {
  urls = [process.argv[2]];
} else {
  console.error("Usage: node index.js <url> or node index.js --file sites.json");
  process.exit(1);
}

mkdirSync("reports", { recursive: true });

for (const url of urls) {
  const domain = new URL(url).hostname;
  console.log(`\n🔍 Monitoring: ${domain}`);
  const report = { url, domain, timestamp: new Date().toISOString(), checks: {} };

  // DNS Check
  console.log("  📡 Checking DNS...");
  try {
    const dns = await call("/v1/dns", { domain, type: "A" });
    report.checks.dns = { status: "ok", records: dns.data?.records || [] };
    writeFileSync(`reports/${domain}-dns.json`, JSON.stringify(dns.data, null, 2));
    console.log(`  ✓ DNS: ${(dns.data?.records || []).length} A records`);
  } catch (e) {
    report.checks.dns = { status: "error", error: e.message };
    console.log(`  ✗ DNS: ${e.message}`);
  }

  // Content Extract
  console.log("  📄 Extracting content...");
  try {
    const extract = await call("/v1/extract", { url, format: "text" });
    const text = extract.data?.content || "";
    report.checks.content = { status: "ok", length: text.length, title: extract.data?.metadata?.title };
    writeFileSync(`reports/${domain}-content.txt`, text);
    console.log(`  ✓ Content: ${text.length} chars, title: "${extract.data?.metadata?.title || "N/A"}"`);
  } catch (e) {
    report.checks.content = { status: "error", error: e.message };
    console.log(`  ✗ Content: ${e.message}`);
  }

  // Screenshot
  console.log("  📸 Taking screenshot...");
  try {
    const ss = await call("/v1/screenshot", { url, width: 1280, height: 720 });
    if (ss.data?.base64) {
      writeFileSync(`reports/${domain}-screenshot.png`, Buffer.from(ss.data.base64, "base64"));
      report.checks.screenshot = { status: "ok", width: ss.data.width, height: ss.data.height };
      console.log(`  ✓ Screenshot: ${ss.data.width}x${ss.data.height}`);
    }
  } catch (e) {
    report.checks.screenshot = { status: "error", error: e.message };
    console.log(`  ✗ Screenshot: ${e.message}`);
  }

  // Save report
  writeFileSync(`reports/${domain}-report.json`, JSON.stringify(report, null, 2));
  console.log(`  📋 Report saved to reports/${domain}-report.json`);
}

console.log("\n✅ Monitoring complete!");
