import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { acquireContext, releaseContext } from "./browser.js";

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

const BLOCK_SIGNALS = [
  "please verify you are a human",
  "access denied",
  "please enable javascript",
  "checking your browser",
  "just a moment",
  "are you a robot",
  "captcha",
  "rate limited",
  "too many requests",
  "403 forbidden",
  "blocked",
  "sign in to continue",
  "you need to sign in",
  "log in to",
  "create an account",
];

function isBlockedContent(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (lower.length < 200) {
    return BLOCK_SIGNALS.some((signal) => lower.includes(signal));
  }
  return false;
}

function isLowQualityContent(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 100) return true;

  // Strip URLs before analyzing sentence structure
  const noUrls = trimmed.replace(/https?:\/\/[^\s)\]]+/g, "").replace(/\([^)]*\)/g, "");
  const sentences = noUrls.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const words = noUrls.split(/\s+/).filter(Boolean).length;

  // Nav/menu garbage detection
  // Real articles: ~1 sentence per 15-25 words. Nav text: ~1 per 50+ words.
  const sentenceRatio = words > 0 ? sentences.length / words : 0;
  
  // If fewer than 1 sentence per 40 words AND enough text to judge, it's garbage
  if (words >= 30 && sentenceRatio < 0.025) return true;

  // Very short sentences average = likely nav items, not article text
  if (sentences.length > 0 && words > 50) {
    const avgLen = sentences.reduce((sum, s) => sum + s.trim().length, 0) / sentences.length;
    if (avgLen < 25) return true;
  }

  return false;
}

export async function extractContent(input: ExtractInput): Promise<ExtractResult> {
  const { url, format = "markdown" } = input;

  const ctx = await acquireContext();
  const page = await ctx.newPage();

  try {
    // Set extra headers for anti-bot evasion
    await page.setExtraHTTPHeaders({
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    });

    // Use networkidle for better JS-rendered content, with fallback
    try {
      await page.goto(url, { timeout: 25_000, waitUntil: "networkidle" });
    } catch {
      // networkidle can timeout on busy pages; retry with domcontentloaded + wait
      try {
        await page.goto(url, { timeout: 15_000, waitUntil: "domcontentloaded" });
        await page.waitForTimeout(2000);
      } catch {
        // Last resort: just get whatever loaded
      }
    }

    const html = await page.content();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const metadata = {
      title: article?.title || dom.window.document.title || null,
      description: dom.window.document.querySelector('meta[name="description"]')?.getAttribute("content") || null,
      author: article?.byline || null,
      publishedDate: dom.window.document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") || null,
      siteName: article?.siteName || null,
    };

    let content = "";
    let plainText = "";

    if (!article?.content) {
      const bodyText = dom.window.document.body?.textContent?.trim() || "";
      if (isBlockedContent(bodyText)) {
        return {
          content: "Could not extract content from this site (bot protection detected).",
          metadata,
        };
      }
      return {
        content: "Could not extract readable content from this page.",
        metadata,
      };
    }

    // Get plain text for quality check
    const textDom = new JSDOM(article.content);
    plainText = textDom.window.document.body.textContent?.trim() || "";

    if (isBlockedContent(plainText)) {
      return {
        content: "Could not extract content from this site (bot protection detected).",
        metadata,
      };
    }

    if (isLowQualityContent(plainText)) {
      return {
        content: "Could not extract meaningful content from this page. The site may require JavaScript or authentication.",
        metadata,
      };
    }

    if (format === "markdown") {
      const turndown = new TurndownService();
      content = turndown.turndown(article.content);
    } else if (format === "text") {
      content = plainText;
    } else {
      content = JSON.stringify({
        title: article.title,
        content: plainText,
        length: article.length,
      });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated at 50KB]";
    }

    return { content, metadata };
  } finally {
    await page.close();
    releaseContext(ctx);
  }
}
