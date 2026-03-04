// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer, options?: Record<string, unknown>) => Promise<{
  text: string;
  numpages: number;
  info: Record<string, string>;
}>;

export interface PdfExtractInput {
  url: string;
  maxPages?: number;
}

export interface PdfExtractResult {
  text: string;
  pages: number;
  info: {
    title: string | null;
    author: string | null;
    subject: string | null;
    creator: string | null;
  };
  truncated: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 100 * 1024;

export async function extractPdf(input: PdfExtractInput): Promise<PdfExtractResult> {
  const { url, maxPages } = input;

  if (!url.match(/^https?:\/\//)) {
    throw Object.assign(new Error("URL must start with http:// or https://"), { name: "ValidationError" });
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "AgentToolbox/1.0" },
  });

  if (!res.ok) {
    throw new Error(`Failed to download PDF: HTTP ${res.status}`);
  }

  const contentLength = parseInt(res.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_FILE_SIZE) {
    throw Object.assign(new Error(`PDF too large: ${contentLength} bytes (max 10MB)`), { name: "ValidationError" });
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_FILE_SIZE) {
    throw Object.assign(new Error(`PDF too large: ${buffer.length} bytes (max 10MB)`), { name: "ValidationError" });
  }

  const options: Record<string, unknown> = {};
  if (maxPages) options.max = maxPages;

  const data = await pdfParse(buffer, options);

  let text = data.text || "";
  let truncated = false;
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH) + "\n\n[Truncated at 100KB]";
    truncated = true;
  }

  return {
    text,
    pages: data.numpages || 0,
    info: {
      title: data.info?.Title || null,
      author: data.info?.Author || null,
      subject: data.info?.Subject || null,
      creator: data.info?.Creator || null,
    },
    truncated,
  };
}
