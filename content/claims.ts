/**
 * Public claims registry.
 *
 * Every factual claim shown on a public page (uptime, response times, founding
 * year, guarantees, certifications, review scores, customer counts) lives here
 * with a `status`. Components render a claim ONLY when `status` is "verified".
 * Set `status: "verified"` only after you have evidence on file (fill `source`,
 * `verifiedBy`, `verifiedOn`); never edit the wording to sound stronger than the evidence.
 * Copy never contains a number, guarantee, SLA, location or certification that is
 * not rendered from this file. Prices come only from data/pricing.json.
 *
 * Gating rule: a claim renders only when `status` is "verified" AND its `termsPage`
 * is a published, reviewed route (`termsPageStatus: "published"`). The derived
 * `verified` flag that components read means exactly that, so a claim cannot be shown
 * while its terms page is a draft or missing. `claimHiddenReason()` says why a claim
 * is hidden.
 *
 * TODO: replace with verified data. All entries start unverified because the
 * owner has not yet confirmed any of them.
 */

/**
 * One claim as stored. `status` is the single source of truth.
 * Every value below is a placeholder until the owner supplies evidence: they are [EXAMPLE, NOT VERIFIED].
 * TODO(decision #6): company facts (founding year 2019 here vs 2022 in the SEO rules, contact addresses, legal entity)
 * are unconfirmed and must not be chosen here.
 */
import type { FeatureIconName } from "@/components/ui/FeatureIcon";

export type ClaimRecord = {
  id: string;
  /** The full sentence as it would appear in copy, e.g. "99.95% uptime SLA with service credits". */
  text: string;
  /** Short stat value, e.g. "99.95%". */
  value: string;
  label: string;
  note?: string;
  /** Only "verified" claims are ever rendered. */
  status: "verified" | "unverified";
  /** URL or document that proves the claim (contract, status page, registry entry, ...). */
  source: string | null;
  /** Who confirmed it. */
  verifiedBy: string | null;
  /** Path of the page that publishes the terms of this claim (for example "/refund-policy"). Null until one exists. */
  termsPage: string | null;
  /** "published" only once the termsPage route exists and its wording has been reviewed. Otherwise "draft". */
  termsPageStatus: "draft" | "published";
  /** "stat" is a measured number (animated count-up allowed). "assurance" is a policy or feature shown as a static line. */
  kind: "stat" | "assurance";
  /** Icon for the static assurance strip. */
  icon?: FeatureIconName;
  /** Link text for the terms page, for example "Read the refund policy". */
  termsLabel?: string;
  /** ISO date (YYYY-MM-DD) of the confirmation. */
  verifiedOn: string | null;
};

/** A claim plus the derived `verified` flag that components read: true only when `claimRenders()` is true. Never set it by hand. */
export type Claim = ClaimRecord & { verified: boolean };

const NONE = { status: "unverified", source: null, verifiedBy: null, verifiedOn: null, termsPage: null, termsPageStatus: "draft" } as const;
const OWNER_CONFIRMED = {
  status: "verified",
  source: "owner confirmation 2026-10-06, terms page to be linked",
  verifiedBy: "owner",
  verifiedOn: "2026-10-06",
  termsPageStatus: "draft", // flip to "published" only when the termsPage route exists and has been reviewed
} as const;

const RECORDS: readonly ClaimRecord[] = [
  { id: "uptime-sla", kind: "stat", text: "99.95% uptime SLA with service credits", value: "99.95%", label: "Uptime SLA", note: "with service credits", ...NONE },
  { id: "ttfb", kind: "stat", text: "Average TTFB under 200ms from London, New York and Dubai", value: "< 200ms", label: "Avg. TTFB", note: "London · New York · Dubai", ...NONE },
  { id: "first-reply", kind: "stat", text: "Average first reply in 18 minutes", value: "18 min", label: "Avg. first reply", ...NONE },
  { id: "founded", kind: "stat", text: "Founded in 2019", value: "2019", label: "Founded", ...NONE },
  { id: "money-back", kind: "assurance", icon: "refresh-cw", termsLabel: "Read the refund policy", text: "30-day money-back guarantee", value: "30-day", label: "Money-back guarantee", ...OWNER_CONFIRMED, termsPage: "/refund-policy" },
  { id: "support-24-7", kind: "assurance", icon: "life-buoy", termsLabel: "Read the support terms", text: "24/7 support", value: "24/7", label: "Support", ...OWNER_CONFIRMED, termsPage: null },
  { id: "free-migration", kind: "assurance", icon: "server", termsLabel: "Read the migration terms", text: "Free migration to DronaHost", value: "Free", label: "Site migration", ...OWNER_CONFIRMED, termsPage: null },
  { id: "renewal-price-same", kind: "assurance", icon: "shield-check", termsLabel: "Read how renewals work", text: "Renewal price equals the signup price", value: "Same price", label: "At renewal", ...OWNER_CONFIRMED, termsPage: null },
  { id: "free-ssl", kind: "assurance", icon: "lock", text: "Free SSL certificates from Let's Encrypt", value: "Free SSL", label: "Let's Encrypt certificates", ...NONE },
  { id: "cloudflare-cdn", kind: "assurance", icon: "cloud", text: "Served through the Cloudflare network", value: "CDN", label: "Cloudflare network", ...NONE },
];

/** The single gate: verified AND its terms page is published. Nothing else decides whether a claim renders. */
export const claimRenders = (c: Pick<ClaimRecord, "status" | "termsPage" | "termsPageStatus">): boolean =>
  c.status === "verified" && Boolean(c.termsPage) && c.termsPageStatus === "published";

/** Why a claim is hidden, or null if it renders. */
export const claimHiddenReason = (c: ClaimRecord): string | null => {
  if (claimRenders(c)) return null;
  if (c.status !== "verified") return "unverified";
  if (!c.termsPage) return "no terms page";
  return "terms page is a draft";
};

export const CLAIMS: readonly Claim[] = RECORDS.map((c) => ({ ...c, verified: claimRenders(c) }));

export const verifiedClaims = (ids?: readonly string[]): Claim[] =>
  CLAIMS.filter((c) => c.verified && (!ids || ids.includes(c.id)));

export const isVerified = (id: string): boolean => CLAIMS.some((c) => c.id === id && c.verified);

/** Owner-verified claims that have no page publishing their terms yet (hidden until one exists). */
export const claimsMissingTermsPage = (): Claim[] => CLAIMS.filter((c) => c.status === "verified" && !c.termsPage);

/** Owner-verified claims whose terms page exists but is still a draft (hidden until it is reviewed and published). */
export const claimsWithDraftTermsPage = (): Claim[] => CLAIMS.filter((c) => c.status === "verified" && c.termsPage && c.termsPageStatus !== "published");

/**
 * Payment methods the checkout accepts.
 * TODO: replace with verified data. Payment brands are shown ONLY as accepted
 * methods, never as trust or endorsement marks.
 */
export const ACCEPTED_PAYMENT_METHODS: readonly { id: string; label: string; verified: boolean }[] = [
  { id: "card", label: "Credit and debit cards", verified: false },
  { id: "paypal", label: "PayPal", verified: false },
];
