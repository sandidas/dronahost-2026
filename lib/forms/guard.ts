import type { NextRequest } from "next/server";

const buckets = new Map<string, number[]>();

export const clientIp = (req: NextRequest): string =>
  req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/** Small in-memory limiter. Cloudflare rules should sit in front; this only stops trivial abuse. */
export function rateLimited(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > max;
}

/** True when the form was submitted implausibly fast (bot) or with a stale or future start time. */
export function tooFast(startedAt: number, minMs = 3000, maxAgeMs = 24 * 60 * 60 * 1000): boolean {
  const age = Date.now() - startedAt;
  return age < minMs || age > maxAgeMs;
}
