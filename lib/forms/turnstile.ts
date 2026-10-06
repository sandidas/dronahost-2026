/**
 * Cloudflare Turnstile server-side check. When TURNSTILE_SECRET_KEY is not set (local development,
 * or before the keys exist) the check is skipped and the honeypot, timing and rate limit still apply.
 * When it is set, a missing or invalid token is rejected.
 */
export const turnstileConfigured = (): boolean => Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip !== "unknown" && { remoteip: ip }) }),
      signal: AbortSignal.timeout(5000),
    });
    const body = (await res.json()) as { success?: boolean };
    return body.success === true;
  } catch {
    return false;
  }
}
