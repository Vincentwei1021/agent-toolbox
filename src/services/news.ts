import { JSDOM } from "jsdom";

export interface NewsInput {
  query: string;
  language?: string;
  country?: string;
  category?: string;
  limit?: number;
}

export interface NewsItem {
  title: string;
  description: string | null;
  url: string;
  source: string | null;
  publishedAt: string | null;
  image: string | null;
}

export interface NewsResult {
  results: NewsItem[];
  query: string;
  language: string;
  country: string;
}

const VALID_CATEGORIES = ["business", "technology", "science", "health", "sports", "entertainment", "general"];

export async function searchNews(input: NewsInput): Promise<NewsResult> {
  const {
    query,
    language = "en",
    country = "us",
    category,
    limit = 10,
  } = input;

  if (category && !VALID_CATEGORIES.includes(category)) {
    throw Object.assign(
      new Error(`Invalid category: ${category}. Valid: ${VALID_CATEGORIES.join(", ")}`),
      { name: "ValidationError" }
    );
  }

  const clampedLimit = Math.min(Math.max(limit, 1), 50);

  // Build Google News RSS URL
  let rssUrl: string;
  if (category && category !== "general") {
    // Topic-based search with query
    rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+${encodeURIComponent(category)}&hl=${language}&gl=${country.toUpperCase()}&ceid=${country.toUpperCase()}:${language}`;
  } else {
    rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${language}&gl=${country.toUpperCase()}&ceid=${country.toUpperCase()}:${language}`;
  }

  const res = await fetch(rssUrl, {
    signal: AbortSignal.timeout(10_000),
    headers: { "User-Agent": "AgentToolbox/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Google News RSS returned HTTP ${res.status}`);
  }

  const xml = await res.text();
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const doc = dom.window.document;
  const items = doc.querySelectorAll("item");

  const results: NewsItem[] = [];

  for (let i = 0; i < Math.min(items.length, clampedLimit); i++) {
    const item = items[i];
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.textContent?.trim() || null;
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || null;
    const sourceEl = item.querySelector("source");
    const source = sourceEl?.textContent?.trim() || null;

    // Try to extract image from description HTML
    let image: string | null = null;
    if (description) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) image = imgMatch[1];
    }

    // Clean HTML from description
    let cleanDesc = description;
    if (cleanDesc) {
      const descDom = new JSDOM(`<body>${cleanDesc}</body>`);
      cleanDesc = descDom.window.document.body.textContent?.trim() || null;
    }

    results.push({
      title,
      description: cleanDesc,
      url: link,
      source,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      image,
    });
  }

  return { results, query, language, country };
}
