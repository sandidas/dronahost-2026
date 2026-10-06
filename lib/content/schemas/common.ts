import { z } from "zod";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { isValidRequires } from "../requires-grammar";

/** A site-relative link. External links are not allowed in page JSON. */
export const Href = z.string().regex(/^\/[A-Za-z0-9\-_/#?=&.]*$/, "must be a site path starting with /");

export const Cta = z.strictObject({ label: z.string().min(3).max(40), href: Href });

/** `claim:<id>`: renders only through the claim gate (verified AND terms page published). */
export const ClaimRef = z.string().regex(/^claim:[a-z0-9-]+$/, 'must look like "claim:money-back"');

/** `feature:<id>`: a platform capability from the feature library, gated by its claim and by pricing.json. */
export const FeatureRef = z.string().regex(/^feature:[a-z0-9-]+$/, 'must look like "feature:staging"');

/** A condition that hides a section or item when false. Grammar is checked in `lib/content/refs.ts`. */
export const Requires = z.string().min(3).refine(isValidRequires, "unknown condition: use FEATURES.<flag>, claim:<id>, feature:<id> or a known predicate, joined with &&");

export const Slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "kebab-case");

/** Keep in step with `FeatureIconName`; the `satisfies` below fails the type check if a name goes missing. */
export const ICON_NAMES = [
  "activity", "cloud", "code", "database", "file-text", "gauge", "git-branch", "globe", "layers", "life-buoy", "lock",
  "mail", "palette", "refresh-cw", "search", "server", "shield-check", "trending-up", "users", "zap",
] as const satisfies readonly FeatureIconName[];
export const IconName = z.enum(ICON_NAMES);

export const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/** Fields every section can carry. */
export const sectionBase = {
  id: Slug,
  /** Hide the section when this condition is false, e.g. "FEATURES.pricesConfirmed". */
  requires: Requires.optional(),
  /** Hide the section unless this claim renders, e.g. "claim:free-migration". */
  requiresClaim: ClaimRef.optional(),
  /** Omit the section when its renderer produces nothing (no empty gaps). */
  hideIfEmpty: z.boolean().optional(),
};
