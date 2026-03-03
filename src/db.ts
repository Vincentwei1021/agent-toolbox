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
  status_code: number | null;
  ip: string | null;
  user_agent: string | null;
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
      response_time_ms INTEGER,
      status_code INTEGER,
      ip TEXT,
      user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS monthly_usage (
      api_key_id INTEGER NOT NULL REFERENCES api_keys(id),
      month TEXT NOT NULL,
      call_count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (api_key_id, month)
    );

    CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
    CREATE INDEX IF NOT EXISTS idx_usage_timestamp ON usage(timestamp);
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

export function recordUsage(
  apiKeyId: number,
  endpoint: string,
  responseTimeMs: number,
  statusCode?: number,
  ip?: string,
  userAgent?: string,
): void {
  const db = getDb();
  const month = new Date().toISOString().slice(0, 7);

  const insertUsage = db.prepare(
    "INSERT INTO usage (api_key_id, endpoint, response_time_ms, status_code, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const upsertMonthly = db.prepare(`
    INSERT INTO monthly_usage (api_key_id, month, call_count)
    VALUES (?, ?, 1)
    ON CONFLICT(api_key_id, month)
    DO UPDATE SET call_count = call_count + 1
  `);

  const transaction = db.transaction(() => {
    insertUsage.run(apiKeyId, endpoint, responseTimeMs, statusCode ?? null, ip ?? null, userAgent ?? null);
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

export interface DailyUsageRow {
  date: string;
  count: number;
  avg_latency_ms: number;
}

export function getDailyTrend(apiKeyId: number, month?: string): DailyUsageRow[] {
  const db = getDb();
  const m = month || new Date().toISOString().slice(0, 7);
  return db.prepare(`
    SELECT
      date(timestamp) as date,
      COUNT(*) as count,
      ROUND(AVG(response_time_ms), 0) as avg_latency_ms
    FROM usage
    WHERE api_key_id = ? AND strftime('%Y-%m', timestamp) = ?
    GROUP BY date(timestamp)
    ORDER BY date ASC
  `).all(apiKeyId, m) as DailyUsageRow[];
}

export function getStatusCodeBreakdown(apiKeyId: number, month?: string): Record<string, number> {
  const db = getDb();
  const m = month || new Date().toISOString().slice(0, 7);
  const rows = db.prepare(`
    SELECT status_code, COUNT(*) as count
    FROM usage
    WHERE api_key_id = ? AND strftime('%Y-%m', timestamp) = ? AND status_code IS NOT NULL
    GROUP BY status_code
  `).all(apiKeyId, m) as Array<{ status_code: number; count: number }>;
  const result: Record<string, number> = {};
  for (const row of rows) {
    result[String(row.status_code)] = row.count;
  }
  return result;
}

export function getGlobalSummary(): {
  total_keys: number;
  active_keys: number;
  total_calls_this_month: number;
  calls_today: number;
  top_endpoints: Array<{ endpoint: string; count: number }>;
  top_users: Array<{ email: string; plan: string; calls: number }>;
  avg_latency_ms: number;
  error_rate: number;
} {
  const db = getDb();
  const month = new Date().toISOString().slice(0, 7);
  const today = new Date().toISOString().slice(0, 10);

  const totalKeys = (db.prepare("SELECT COUNT(*) as c FROM api_keys").get() as { c: number }).c;
  const activeKeys = (db.prepare("SELECT COUNT(*) as c FROM api_keys WHERE status = 'active'").get() as { c: number }).c;
  const totalCallsMonth = (db.prepare("SELECT COALESCE(SUM(call_count), 0) as c FROM monthly_usage WHERE month = ?").get(month) as { c: number }).c;
  const callsToday = (db.prepare("SELECT COUNT(*) as c FROM usage WHERE date(timestamp) = ?").get(today) as { c: number }).c;

  const topEndpoints = db.prepare(`
    SELECT endpoint, COUNT(*) as count
    FROM usage WHERE strftime('%Y-%m', timestamp) = ?
    GROUP BY endpoint ORDER BY count DESC LIMIT 10
  `).all(month) as Array<{ endpoint: string; count: number }>;

  const topUsers = db.prepare(`
    SELECT k.user_email as email, k.plan, m.call_count as calls
    FROM monthly_usage m JOIN api_keys k ON k.id = m.api_key_id
    WHERE m.month = ?
    ORDER BY m.call_count DESC LIMIT 10
  `).all(month) as Array<{ email: string; plan: string; calls: number }>;

  const latency = db.prepare(`
    SELECT COALESCE(ROUND(AVG(response_time_ms), 0), 0) as avg
    FROM usage WHERE strftime('%Y-%m', timestamp) = ?
  `).get(month) as { avg: number };

  const totalCalls = (db.prepare("SELECT COUNT(*) as c FROM usage WHERE strftime('%Y-%m', timestamp) = ?").get(month) as { c: number }).c;
  const errorCalls = (db.prepare("SELECT COUNT(*) as c FROM usage WHERE strftime('%Y-%m', timestamp) = ? AND status_code >= 400").get(month) as { c: number }).c;
  const errorRate = totalCalls > 0 ? Math.round((errorCalls / totalCalls) * 10000) / 100 : 0;

  return {
    total_keys: totalKeys,
    active_keys: activeKeys,
    total_calls_this_month: totalCallsMonth,
    calls_today: callsToday,
    top_endpoints: topEndpoints,
    top_users: topUsers,
    avg_latency_ms: latency.avg,
    error_rate: errorRate,
  };
}

export function migrateUsageTable(): void {
  const db = getDb();
  // Add columns if they dont exist (SQLite ALTER TABLE ADD COLUMN is idempotent-safe with try/catch)
  const cols = ["status_code INTEGER", "ip TEXT", "user_agent TEXT"];
  for (const col of cols) {
    try {
      db.exec("ALTER TABLE usage ADD COLUMN " + col);
    } catch {
      // Column already exists
    }
  }
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
