import { createHash } from "crypto";

interface CacheEntry {
  data: unknown;
  expiresAt: number;
  size: number;
}

const DEFAULT_MAX_ENTRIES = 500;
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // 50MB

export class LRUCache {
  private cache = new Map<string, CacheEntry>();
  private maxEntries: number;
  private maxSize: number;
  private currentSize = 0;

  constructor(maxEntries = DEFAULT_MAX_ENTRIES, maxSize = DEFAULT_MAX_SIZE) {
    this.maxEntries = maxEntries;
    this.maxSize = maxSize;
  }

  static makeKey(endpoint: string, params: Record<string, unknown>): string {
    const sorted = JSON.stringify(params, Object.keys(params).sort());
    return createHash("sha256").update(endpoint + ":" + sorted).digest("hex").slice(0, 16);
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
      return null;
    }
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: unknown, ttlMs: number): void {
    // Remove existing entry if present
    const existing = this.cache.get(key);
    if (existing) {
      this.currentSize -= existing.size;
      this.cache.delete(key);
    }

    const serialized = JSON.stringify(data);
    const size = serialized.length;

    // Evict if over limits
    while (this.cache.size >= this.maxEntries || this.currentSize + size > this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (!oldest) break;
      const entry = this.cache.get(oldest)!;
      this.currentSize -= entry.size;
      this.cache.delete(oldest);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      size,
    });
    this.currentSize += size;
  }

  get stats() {
    return {
      entries: this.cache.size,
      sizeBytes: this.currentSize,
      maxEntries: this.maxEntries,
      maxSizeBytes: this.maxSize,
    };
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }
}

// Singleton instance
export const responseCache = new LRUCache();

// TTL config per endpoint (ms)
export const CACHE_TTL: Record<string, number> = {
  "/v1/search": 5 * 60 * 1000,         // 5 min
  "/v1/extract": 5 * 60 * 1000,        // 5 min
  "/v1/weather": 15 * 60 * 1000,       // 15 min
  "/v1/finance": 15 * 60 * 1000,       // 15 min
  "/v1/screenshot": 60 * 60 * 1000,    // 1 hour
  "/v1/validate-email": 60 * 60 * 1000,// 1 hour
  "/v1/translate": 60 * 60 * 1000,     // 1 hour
  "/v1/geoip": 60 * 60 * 1000,        // 1 hour
};
