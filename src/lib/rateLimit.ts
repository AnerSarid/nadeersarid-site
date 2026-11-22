/**
 * Per-IP sliding-window rate limit, kept in memory (FR-2).
 *
 * Best effort: each serverless instance has its own memory, so this slows
 * down a single noisy client but is not a global guarantee. The Vercel WAF
 * rate-limit rule described in the README is the second layer. IPs are held
 * only for the length of the window and are never written anywhere.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(ip: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const windowStart = now - WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((recent[0] + WINDOW_MS - now) / 1000) };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Keep memory bounded: drop clients whose window has fully expired.
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => t <= windowStart)) hits.delete(key);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Client IP as forwarded by Vercel's edge, or "unknown" locally. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
