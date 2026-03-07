#!/usr/bin/env node
import { writeFileSync } from "fs";

const API_KEY = process.env.AGENT_TOOLBOX_API_KEY;
const BASE = process.env.AGENT_TOOLBOX_BASE_URL || "https://api.toolboxlite.com";
const topic = process.argv[2];

if (!API_KEY) { console.error("Error: Set AGENT_TOOLBOX_API_KEY env var"); process.exit(1); }
if (!topic) { console.error("Usage: node index.js \"your research topic\""); process.exit(1); }

async function call(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "API call failed");
  return data.data;
}

console.log(`\n🔍 Researching: "${topic}"\n`);

// Step 1: Web Search
console.log("📡 Searching the web...");
const searchResults = await call("/v1/search", { query: topic, count: 5 });

// Step 2: Latest News
console.log("📰 Fetching latest news...");
const news = await call("/v1/news", { query: topic, limit: 5 });

// Step 3: Extract content from top 2 results
console.log("📄 Extracting page content...");
const extracts = [];
for (const result of searchResults.slice(0, 2)) {
  try {
    const content = await call("/v1/extract", { url: result.url, format: "markdown" });
    extracts.push({ url: result.url, title: result.title, content: content.content?.slice(0, 2000) });
    console.log(`  ✓ Extracted: ${result.title}`);
  } catch (e) {
    console.log(`  ✗ Skipped: ${result.title}`);
  }
}

// Step 4: Generate report
console.log("\n📝 Generating report...\n");

let report = `# Research Report: ${topic}\n\n`;
report += `*Generated on ${new Date().toISOString().split("T")[0]}*\n\n`;

report += `## 🔎 Web Search Results\n\n`;
for (const r of searchResults) {
  report += `### [${r.title}](${r.url})\n${r.snippet || ""}\n\n`;
}

report += `## 📰 Latest News\n\n`;
for (const article of news.results) {
  const date = article.publishedAt ? ` (${article.publishedAt.split("T")[0]})` : "";
  report += `- **${article.title}**${date} — ${article.source || "Unknown"}\n  ${article.url}\n\n`;
}

if (extracts.length > 0) {
  report += `## 📄 Deep Dive\n\n`;
  for (const e of extracts) {
    report += `### ${e.title}\n*Source: ${e.url}*\n\n${e.content}\n\n---\n\n`;
  }
}

report += `## 💡 Summary\n\n`;
report += `This report aggregated ${searchResults.length} search results, ${news.results.length} news articles, and ${extracts.length} full-page extractions for the topic "${topic}".\n`;

writeFileSync("report.md", report);
console.log("✅ Report saved to report.md");
console.log(`   ${searchResults.length} search results, ${news.results.length} news articles, ${extracts.length} page extractions`);
