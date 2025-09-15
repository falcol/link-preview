// Simple in-memory TTL cache (per-process)
// Not for multi-instance production; replace with Redis for scale.

type CacheEntry<T> = {
  value: T;
  expiresAt: number; // epoch ms
};

export class TtlCache<TValue = unknown> {
  private store = new Map<string, CacheEntry<TValue>>();

  constructor(private defaultTtlMs: number = 10 * 60 * 1000) {}

  public get(key: string): TValue | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  public set(key: string, value: TValue, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  public has(key: string): boolean {
    return this.get(key) !== undefined;
  }
}

export const globalCache = new TtlCache<unknown>();


