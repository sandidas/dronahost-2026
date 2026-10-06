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
 * TODO: replace with verified data. All entries start unverified because the
 * owner has not yet confirmed any of them.
 */

/**
 * One claim as stored. `status` is the single source of truth.
 * Every value below is a placeholder until the owner supplies evidence: they are [EXAMPLE, NOT VERIFIED].
 * TODO(decision #6): company facts (founding year 2019 here vs 2022 in the SEO rules, contact addresses, legal entity)
 * are unconfirmed and must not be chosen here.
 */
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
  /** ISO date (YYYY-MM-DD) of the confirmation. */
  verifiedOn: string | null;
};

/** A claim plus the derived `verified` flag that components read. Never set `verified` by hand. */
export type Claim = ClaimRecord & { verified: boolean };

const NONE = { status: "unverified", source: null, verifiedBy: null, verifiedOn: null } as const;

const RECORDS: readonly ClaimRecord[] = [
  { id: "uptime-sla", text: "99.95% uptime SLA with service credits", value: "99.95%", label: "Uptime SLA", note: "with service credits", ...NONE },
  { id: "ttfb", text: "Average TTFB under 200ms from London, New York and Dubai", value: "< 200ms", label: "Avg. TTFB", note: "London · New York · Dubai", ...NONE },
  { id: "first-reply", text: "Average first reply in 18 minutes", value: "18 min", label: "Avg. first reply", ...NONE },
  { id: "founded", text: "Founded in 2019", value: "2019", label: "Founded", ...NONE },
  { id: "money-back", text: "30-day money-back guarantee", value: "30-day", label: "Money-back guarantee", ...NONE },
  { id: "free-ssl", text: "Free SSL certificates from Let's Encrypt", value: "Free SSL", label: "Let's Encrypt certificates", ...NONE },
  { id: "cloudflare-cdn", text: "Served through the Cloudflare network", value: "CDN", label: "Cloudflare network", ...NONE },
];

export const CLAIMS: readonly Claim[] = RECORDS.map((c) => ({ ...c, verified: c.status === "verified" }));

export const verifiedClaims = (ids?: readonly string[]): Claim[] =>
  CLAIMS.filter((c) => c.verified && (!ids || ids.includes(c.id)));

export const isVerified = (id: string): boolean => CLAIMS.some((c) => c.id === id && c.verified);

/**
 * Payment methods the checkout accepts.
 * TODO: replace with verified data. Payment brands are shown ONLY as accepted
 * methods, never as trust or endorsement marks.
 */
export const ACCEPTED_PAYMENT_METHODS: readonly { id: string; label: string; verified: boolean }[] = [
  { id: "card", label: "Credit and debit cards", verified: false },
  { id: "paypal", label: "PayPal", verified: false },
];
