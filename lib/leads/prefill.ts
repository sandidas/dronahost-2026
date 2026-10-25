/**
 * Hands a value from one form to another on the same page without a library: the hero's one-field form writes the site
 * address here, and the migration request form reads it. The value travels three ways, so it arrives whatever loads first:
 * a custom DOM event (both forms mounted), sessionStorage (the target mounts later), and the `siteUrl` query parameter (the
 * hero form submitted without JavaScript, as a plain GET to `/?siteUrl=...#plan`). Browser only; every call is guarded.
 */
import type { RequestField } from "./migration-request";

export const PREFILL_EVENT = "dh:prefill";
const KEY = (field: RequestField) => `dh:prefill:${field}`;

type PrefillDetail = { field: RequestField; value: string };

/** Stores the value and tells any mounted form about it. */
export function setPrefill(field: RequestField, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY(field), value);
  } catch {
    // Private mode or blocked storage: the event below still reaches a mounted form.
  }
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { field, value } }));
}

/** A value waiting for this field: the query parameter first (no-JS submit), then sessionStorage. Empty when none. */
export function readPrefill(field: RequestField): string {
  if (typeof window === "undefined") return "";
  const fromQuery = new URLSearchParams(window.location.search).get(field);
  if (fromQuery) return fromQuery.slice(0, 200);
  try {
    return window.sessionStorage.getItem(KEY(field)) ?? "";
  } catch {
    return "";
  }
}

/** Calls `onValue` whenever a value is handed over while the form is mounted. Returns the unsubscribe function. */
export function subscribePrefill(onValue: (field: RequestField, value: string) => void): () => void {
  const handler = (e: Event) => {
    const d = (e as CustomEvent<PrefillDetail>).detail;
    if (d && typeof d.value === "string") onValue(d.field, d.value);
  };
  window.addEventListener(PREFILL_EVENT, handler);
  return () => window.removeEventListener(PREFILL_EVENT, handler);
}
