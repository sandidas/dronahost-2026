/**
 * Minimal WHMCS API client (server only). Credentials never leave the server:
 * WHMCS_API_URL (e.g. https://billing.example.com), WHMCS_API_IDENTIFIER and WHMCS_API_SECRET.
 * Create an API role in WHMCS limited to DomainWhois so a leaked key can do nothing else.
 */
export const whmcsConfigured = (): boolean => Boolean(process.env.WHMCS_API_URL && process.env.WHMCS_API_IDENTIFIER && process.env.WHMCS_API_SECRET);

export class WhmcsError extends Error {}

export async function whmcs<T extends Record<string, unknown>>(action: string, params: Record<string, string>): Promise<T> {
  const base = process.env.WHMCS_API_URL;
  if (!base || !whmcsConfigured()) throw new WhmcsError("WHMCS is not configured");
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/includes/api.php`, {
      method: "POST",
      body: new URLSearchParams({ identifier: process.env.WHMCS_API_IDENTIFIER!, secret: process.env.WHMCS_API_SECRET!, action, responsetype: "json", ...params }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const data = (await res.json()) as T & { result?: string };
    if (data.result !== "success") throw new WhmcsError("WHMCS request failed");
    return data;
  } catch (e) {
    throw e instanceof WhmcsError ? e : new WhmcsError("WHMCS unreachable");
  }
}

export type DomainStatus = "available" | "unavailable";

/** Availability lookup via the WHMCS DomainWhois action. */
export async function checkDomain(domain: string): Promise<DomainStatus> {
  const data = await whmcs<{ status?: string }>("DomainWhois", { domain });
  return data.status === "available" ? "available" : "unavailable";
}
