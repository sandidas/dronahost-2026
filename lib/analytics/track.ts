/** Conversion events. Plausible is cookieless, so this needs no consent. No-op when analytics is not loaded. */
type Plausible = (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;

export type AnalyticsEvent = "contact_submit" | "migration_submit" | "consultation_submit" | "pricing_cta_click" | "domain_search";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: Plausible }).plausible;
  plausible?.(event, props ? { props } : undefined);
}
