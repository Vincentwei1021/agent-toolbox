import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv(): void {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file not found, rely on environment variables
  }
}

loadEnv();

export const config = {
  port: parseInt(process.env.PORT || "3100", 10),
  apiKeys: (process.env.API_KEYS || "").split(",").filter(Boolean),
  nodeEnv: process.env.NODE_ENV || "development",
  version: "1.0.0",
  creemApiKey: process.env.CREEM_API_KEY || "",
  creemWebhookSecret: process.env.CREEM_WEBHOOK_SECRET || "",
  creemProductPro: process.env.CREEM_PRODUCT_PRO || "",
  creemProductScale: process.env.CREEM_PRODUCT_SCALE || "",
  databasePath: process.env.DATABASE_PATH || "./data/agent-toolbox.db",
} as const;
