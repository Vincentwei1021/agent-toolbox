import { getBrowser } from "./browser.js";

export interface ScreenshotInput {
  url: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
}

export interface ScreenshotResult {
  base64: string;
  width: number;
  height: number;
  url: string;
}

export async function takeScreenshot(input: ScreenshotInput): Promise<ScreenshotResult> {
  const {
    url,
    width = 1280,
    height = 720,
    fullPage = false,
  } = input;

  const clampedWidth = Math.min(width, 1920);
  const clampedHeight = Math.min(height, 1080);

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: clampedWidth, height: clampedHeight });
    await page.goto(url, { timeout: 30_000, waitUntil: "domcontentloaded" });

    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage,
      clip: fullPage ? undefined : { x: 0, y: 0, width: clampedWidth, height: Math.min(clampedHeight, 10000) },
    });

    const base64 = screenshotBuffer.toString("base64");

    return {
      base64,
      width: clampedWidth,
      height: clampedHeight,
      url,
    };
  } finally {
    await page.close();
  }
}
