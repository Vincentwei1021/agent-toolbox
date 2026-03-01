import Database from "better-sqlite3";
import { randomBytes } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { config } from "./config.js";

export interface ApiKeyRow {
  id: number;
  key: string;
  user_email: string;
  plan: string;
  creem_customer_id: string | null;
  creem_subscription_id: string | null;
  created_at: string;
  status: string;
}

export interface UsageRow {
  id: number;
  api_key_id: number;
  endpoint: string;
  timestamp: string;
  response_time_ms: number | null;
}

export interface MonthlyUsageRow {
  api_key_id: number;
  month: string;
  call_count: number;
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = config.databasePath;
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
  }
  return db;
}

function initTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      user_email TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free', 'builder', 'pro', 'scale')),
      creem_customer_id TEXT,
      creem_subscription_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'suspended'))
    );

    CREATE TABLE IF NOT EXISTS usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
      endpoint TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      response_time_ms INTEGER
    );

    CREATE TABLE IF NOT EXISTS monthly_usage (
      api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
      month TEXT NOT NULL,
      call_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (api_key_id, month)
    );

    CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
    CREATE INDEX IF NOT EXISTS idx_usage_api_key_id ON usage(api_key_id);
    CREATE INDEX IF NOT EXISTS idx_monthly_usage_lookup ON monthly_usage(api_key_id, month);
  `);
}

export function findApiKeyByKey(key: string): ApiKeyRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM api_keys WHERE key = ?").get(key) as ApiKeyRow | undefined;
}

export function findApiKeyByEmail(email: string): ApiKeyRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM api_keys WHERE user_email = ?").get(email) as ApiKeyRow | undefined;
}

export function findApiKeyByCreemCustomerId(customerId: string): ApiKeyRow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM api_keys WHERE creem_customer_id = ?").get(customerId) as ApiKeyRow | undefined;
}

export function createApiKey(email: string, plan: string = "free"): ApiKeyRow {
  const db = getDb();
  const key = "atb_" + randomBytes(16).toString("hex");
  db.prepare("INSERT INTO api_keys (key, user_email, plan) VALUES (?, ?, ?)").run(key, email, plan);
  return findApiKeyByKey(key)!;
}

export function recordUsage(apiKeyId: number, endpoint: string, responseTimeMs: number): void {
  const db = getDb();
  const month = new Date().toISOString().slice(0, 7);

  const insertUsage = db.prepare(
    "INSERT INTO usage (api_key_id, endpoint, response_time_ms) VALUES (?, ?, ?)"
  );
  const upsertMonthly = db.prepare(`
    INSERT INTO monthly_usage (api_key_id, month, call_count)
    VALUES (?, ?, 1)
    ON CONFLICT(api_key_id, month)
    DO UPDATE SET call_count = call_count + 1
  `);

  const transaction = db.transaction(() => {
    insertUsage.run(apiKeyId, endpoint, responseTimeMs);
    upsertMonthly.run(apiKeyId, month);
  });
  transaction();
}

export function getMonthlyUsage(apiKeyId: number, month?: string): number {
  const db = getDb();
  const m = month || new Date().toISOString().slice(0, 7);
  const row = db.prepare(
    "SELECT call_count FROM monthly_usage WHERE api_key_id = ? AND month = ?"
  ).get(apiKeyId, m) as MonthlyUsageRow | undefined;
  return row?.call_count ?? 0;
}

export function getEndpointBreakdown(apiKeyId: number, month?: string): Record<string, number> {
  const db = getDb();
  const m = month || new Date().toISOString().slice(0, 7);
  const rows = db.prepare(`
    SELECT endpoint, COUNT(*) as count
    FROM usage
    WHERE api_key_id = ? AND strftime('%Y-%m', timestamp) = ?
    GROUP BY endpoint
  `).all(apiKeyId, m) as Array<{ endpoint: string; count: number }>;

  const result: Record<string, number> = {};
  for (const row of rows) {
    result[row.endpoint] = row.count;
  }
  return result;
}

export function updatePlan(apiKeyId: number, plan: string): void {
  const db = getDb();
  db.prepare("UPDATE api_keys SET plan = ? WHERE id = ?").run(plan, apiKeyId);
}

export function updateCreemInfo(apiKeyId: number, customerId: string, subscriptionId: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE api_keys SET creem_customer_id = ?, creem_subscription_id = ? WHERE id = ?"
  ).run(customerId, subscriptionId, apiKeyId);
}

export function suspendKey(apiKeyId: number): void {
  const db = getDb();
  db.prepare("UPDATE api_keys SET status = 'suspended' WHERE id = ?").run(apiKeyId);
}

export function activateKey(apiKeyId: number): void {
  const db = getDb();
  db.prepare("UPDATE api_keys SET status = 'active' WHERE id = ?").run(apiKeyId);
}
