import { translate } from "@vitalets/google-translate-api";

export interface TranslateResult {
  text: string;
  translation: string;
  detectedLanguage: { code: string; confidence: number };
  target: string;
}

export interface BatchTranslateResult {
  translations: TranslateResult[];
  target: string;
}

// Markdown-aware: extract protected blocks, translate rest, reassemble
const PROTECTED_PATTERNS = [
  /```[\s\S]*?```/g,            // code blocks
  /`[^`]+`/g,                   // inline code
  /\[([^\]]*)\]\(([^)]+)\)/g,  // links — protect URL part
  /!\[([^\]]*)\]\(([^)]+)\)/g, // images
];

interface ProtectedBlock {
  placeholder: string;
  original: string;
}

function protectMarkdown(text: string): { cleaned: string; blocks: ProtectedBlock[] } {
  const blocks: ProtectedBlock[] = [];
  let cleaned = text;
  let idx = 0;

  for (const pattern of PROTECTED_PATTERNS) {
    cleaned = cleaned.replace(pattern, (match) => {
      const placeholder = `__PROTECTED_${idx}__`;
      blocks.push({ placeholder, original: match });
      idx++;
      return placeholder;
    });
  }

  return { cleaned, blocks };
}

function restoreMarkdown(text: string, blocks: ProtectedBlock[]): string {
  let result = text;
  for (const block of blocks) {
    result = result.replace(block.placeholder, block.original);
  }
  return result;
}

function applyGlossary(text: string, glossary: Record<string, string>): { text: string; placeholders: Array<{ placeholder: string; replacement: string }> } {
  const placeholders: Array<{ placeholder: string; replacement: string }> = [];
  let processed = text;
  let idx = 0;

  for (const [term, replacement] of Object.entries(glossary)) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    processed = processed.replace(regex, () => {
      const ph = `__GLOSS_${idx}__`;
      placeholders.push({ placeholder: ph, replacement });
      idx++;
      return ph;
    });
  }

  return { text: processed, placeholders };
}

function restoreGlossary(text: string, placeholders: Array<{ placeholder: string; replacement: string }>): string {
  let result = text;
  for (const { placeholder, replacement } of placeholders) {
    result = result.replace(placeholder, replacement);
  }
  return result;
}

export async function translateText(
  text: string,
  target: string,
  source?: string,
  glossary?: Record<string, string>
): Promise<TranslateResult> {
  // Step 1: Protect markdown
  const { cleaned: mdCleaned, blocks: mdBlocks } = protectMarkdown(text);

  // Step 2: Apply glossary
  let toTranslate = mdCleaned;
  let glossaryPlaceholders: Array<{ placeholder: string; replacement: string }> = [];
  if (glossary && Object.keys(glossary).length > 0) {
    const g = applyGlossary(mdCleaned, glossary);
    toTranslate = g.text;
    glossaryPlaceholders = g.placeholders;
  }

  // Step 3: Translate
  const opts: { to: string; from?: string } = { to: target };
  if (source && source !== "auto") {
    opts.from = source;
  }

  const result = await translate(toTranslate, opts);

  // Step 4: Restore glossary + markdown
  let translated = result.text;
  if (glossaryPlaceholders.length > 0) {
    translated = restoreGlossary(translated, glossaryPlaceholders);
  }
  translated = restoreMarkdown(translated, mdBlocks);

  return {
    text,
    translation: translated,
    detectedLanguage: {
      code: result.raw?.src || source || "auto",
      confidence: result.raw?.confidence || 0.9,
    },
    target,
  };
}

export async function translateBatch(
  texts: string[],
  target: string,
  source?: string,
  glossary?: Record<string, string>
): Promise<BatchTranslateResult> {
  // Translate sequentially to avoid rate limits
  const translations: TranslateResult[] = [];
  for (const text of texts) {
    const result = await translateText(text, target, source, glossary);
    translations.push(result);
  }
  return { translations, target };
}
