import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { getBrowser } from "./browser.js";

export interface ExtractInput {
  url: string;
  format?: "markdown" | "text" | "json";
}

export interface ExtractResult {
  content: string;
  metadata: {
    title: string | null;
    description: string | null;
    author: string | null;
    publishedDate: string | null;
    siteName: string | null;
  };
}

const MAX_CONTENT_LENGTH = 50 * 1024; // 50KB

export async function extractContent(input: ExtractInput): Promise<ExtractResult> {
  const { url, format = "markdown" } = input;

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.goto(url, { timeout: 30_000, waitUntil: "domcontentloaded" });
    const html = await page.content();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const metadata = {
      title: article?.title || null,
      description: dom.window.document.querySelector('meta[name="description"]')?.getAttribute("content") || null,
      author: article?.byline || null,
      publishedDate: dom.window.document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") || null,
      siteName: article?.siteName || null,
    };

    let content = "";

    if (!article?.content) {
      content = "Could not extract readable content from this page.";
    } else if (format === "markdown") {
      const turndown = new TurndownService();
      content = turndown.turndown(article.content);
    } else if (format === "text") {
      const textDom = new JSDOM(article.content);
      content = textDom.window.document.body.textContent?.trim() || "";
    } else {
      // json format
      content = JSON.stringify({
        title: article.title,
        content: article.textContent?.trim() || "",
        length: article.length,
      });
    }

    // Truncate to 50KB
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated at 50KB]";
    }

    return { content, metadata };
  } finally {
    await page.close();
  }
}
