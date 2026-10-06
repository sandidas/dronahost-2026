/**
 * Cookie consent state. First-party cookie `dh_consent`, 6 months, SameSite=Lax.
 * Necessary cookies are always on. Everything else is off until the visitor opts in.
 * Client-only helpers; the server never reads this cookie for rendering.
 */
export type ConsentChoices = { preferences: boolean; analytics: boolean; marketing: boolean };
export type ConsentRecord = ConsentChoices & { id: string; at: string; v: 1 };

export const CONSENT_COOKIE = "dh_consent";
export const CONSENT_EVENT = "dh-consent-change";
export const OPEN_SETTINGS_EVENT = "dh-open-cookie-settings";
const MAX_AGE = 60 * 60 * 24 * 182;

export const REJECT_ALL: ConsentChoices = { preferences: false, analytics: false, marketing: false };
export const ACCEPT_ALL: ConsentChoices = { preferences: true, analytics: true, marketing: true };

export function readConsent(): ConsentRecord | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) as ConsentRecord;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/** Raw cookie string, used as the stable snapshot for useSyncExternalStore. */
export const consentSnapshot = (): string => (typeof document === "undefined" ? "" : (document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`)) ?? ""));

export function subscribeConsent(cb: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
}

export function saveConsent(choices: ConsentChoices): ConsentRecord {
  const prev = readConsent();
  const record: ConsentRecord = { ...choices, id: prev?.id ?? crypto.randomUUID(), at: new Date().toISOString(), v: 1 };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
  // Consent log (GDPR Art. 7(1): be able to demonstrate consent). Fire and forget.
  void fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record), keepalive: true }).catch(() => {});
  return record;
}
