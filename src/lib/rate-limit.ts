// Very simple IP-based rate limiter (per-process memory)
// For production across multiple instances, use Redis or a managed service.

type Bucket = {
  count: number;
  resetAt: number; // epoch ms
};

export class SimpleRateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(private maxPerWindow: number, private windowMs: number) {}

  public tryConsume(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const bucket = this.buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: this.maxPerWindow - 1, resetAt };
    }

    if (bucket.count < this.maxPerWindow) {
      bucket.count += 1;
      return { allowed: true, remaining: this.maxPerWindow - bucket.count, resetAt: bucket.resetAt };
    }

    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
}

export const globalLimiter = new SimpleRateLimiter(10, 60 * 1000); // 10 req/min per key


