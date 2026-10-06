import type { SectionSpec } from "./schemas/sections";

/** The first section's `Type:variant` (variant when it has one). */
const heroKey = (s: SectionSpec): string => ("variant" in s && typeof s.variant === "string" ? `${s.type}:${s.variant}` : s.type);

/**
 * A page's layout signature: its hero as `Type:variant`, then the types of the next four sections. Two money pages must not
 * share the same hero variant and the same first four section types, so pages never read as one template.
 */
export function computeLayoutSignature(sections: readonly SectionSpec[]): string[] {
  const [hero, ...rest] = sections;
  if (!hero) return [];
  return [heroKey(hero), ...rest.slice(0, 4).map((s) => s.type)];
}

/** What counts as "the same layout": same hero variant and same first four section types (the signature's first five entries). */
const key = (sig: readonly string[]): string => sig.slice(0, 5).join(" > ");

export type SignatureCollision = { signature: string; pages: string[] };

/** Pages (by id) that share a signature. An empty result means every page has its own layout. */
export function findSignatureCollisions(pages: readonly { id: string; sections: readonly SectionSpec[] }[]): SignatureCollision[] {
  const byKey = new Map<string, string[]>();
  for (const page of pages) {
    const k = key(computeLayoutSignature(page.sections));
    byKey.set(k, [...(byKey.get(k) ?? []), page.id]);
  }
  return [...byKey.entries()].filter(([, ids]) => ids.length > 1).map(([signature, ids]) => ({ signature, pages: ids }));
}
