export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchInput {
  query: string;
  count?: number;
  lang?: string;
}

export async function searchDuckDuckGo(input: SearchInput): Promise<SearchResult[]> {
  const { query, count = 5, lang = "en" } = input;

  const params = new URLSearchParams({ q: query, kl: lang });
  const response = await fetch(`https://html.duckduckgo.com/html/?${params.toString()}`, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`DuckDuckGo returned status ${response.status}`);
  }

  const html = await response.text();
  const results: SearchResult[] = [];

  // Parse results from HTML
  const resultBlocks = html.split('class="result__a"');
  for (let i = 1; i < resultBlocks.length && results.length < count; i++) {
    const block = resultBlocks[i];

    // Extract URL and title from the result link
    const hrefMatch = block.match(/href="([^"]*?)"/);
    const titleEnd = block.indexOf("</a>");
    const titleText = titleEnd > 0 ? block.slice(block.indexOf(">") + 1, titleEnd) : "";

    // Extract snippet - look in the current and subsequent content
    const fullBlock = resultBlocks[i];
    let snippet = "";
    const snippetMatch = fullBlock.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    if (snippetMatch) {
      snippet = snippetMatch[1];
    }

    // Clean HTML tags from title and snippet
    const cleanTitle = titleText.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").trim();
    const cleanSnippet = snippet.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").trim();

    // Extract actual URL from DuckDuckGo redirect
    let url = "";
    if (hrefMatch) {
      const rawUrl = hrefMatch[1];
      if (rawUrl.includes("uddg=")) {
        const uddgMatch = rawUrl.match(/uddg=([^&]*)/);
        url = uddgMatch ? decodeURIComponent(uddgMatch[1]) : rawUrl;
      } else {
        url = rawUrl;
      }
    }

    if (cleanTitle && url) {
      results.push({
        title: cleanTitle,
        url,
        snippet: cleanSnippet,
      });
    }
  }

  return results;
}
