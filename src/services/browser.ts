import { chromium, type Browser, type BrowserContext } from "playwright";

const POOL_SIZE = 3;
const MAX_CONCURRENT = 3;
const MAX_QUEUE = 10;

let browser: Browser | null = null;
const contextPool: BrowserContext[] = [];
const available: BrowserContext[] = [];
let activeTasks = 0;
const waitQueue: Array<{
  resolve: (ctx: BrowserContext) => void;
  reject: (err: Error) => void;
}> = [];

async function ensureBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    // Pre-create context pool
    for (let i = 0; i < POOL_SIZE; i++) {
      const ctx = await browser.newContext();
      contextPool.push(ctx);
      available.push(ctx);
    }
  }
  return browser;
}

export async function acquireContext(): Promise<BrowserContext> {
  await ensureBrowser();

  // Check if a context is available
  if (available.length > 0) {
    activeTasks++;
    return available.pop()!;
  }

  // Check concurrent limit
  if (activeTasks >= MAX_CONCURRENT) {
    if (waitQueue.length >= MAX_QUEUE) {
      throw new Error("QUEUE_FULL");
    }
    // Wait for a context to become available
    return new Promise<BrowserContext>((resolve, reject) => {
      waitQueue.push({ resolve, reject });
    });
  }

  // All pooled contexts busy but under concurrent limit — create a temp one
  activeTasks++;
  return browser!.newContext();
}

export function releaseContext(ctx: BrowserContext): void {
  activeTasks = Math.max(0, activeTasks - 1);

  // If someone is waiting in queue, give them this context
  if (waitQueue.length > 0) {
    const waiter = waitQueue.shift()!;
    activeTasks++;
    waiter.resolve(ctx);
    return;
  }

  // Return to pool if it's a pooled context
  if (contextPool.includes(ctx)) {
    available.push(ctx);
  } else {
    // Temp context — close it
    ctx.close().catch(() => {});
  }
}

// Legacy API — still works
export async function getBrowser(): Promise<Browser> {
  return ensureBrowser();
}

export async function closeBrowser(): Promise<void> {
  // Drain queue
  while (waitQueue.length > 0) {
    const waiter = waitQueue.shift()!;
    waiter.reject(new Error("Browser shutting down"));
  }

  for (const ctx of contextPool) {
    await ctx.close().catch(() => {});
  }
  contextPool.length = 0;
  available.length = 0;
  activeTasks = 0;

  if (browser) {
    await browser.close();
    browser = null;
  }
}

export function getPoolStats() {
  return {
    poolSize: contextPool.length,
    available: available.length,
    activeTasks,
    queueLength: waitQueue.length,
  };
}
