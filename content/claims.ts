/**
 * Public claims registry.
 *
 * Every factual claim shown on a public page (uptime, response times, founding
 * year, guarantees, certifications, review scores, customer counts) lives here
 * with a `verified` flag. Components render a claim ONLY when `verified` is true.
 * Flip a flag after you have evidence on file; never edit the wording to sound
 * stronger than the evidence.
 *
 * TODO: replace with verified data. All entries start unverified because the
 * owner has not yet confirmed any of them.
 */

export type Claim = {
  id: string;
  /** Short stat value, e.g. "99.95%". */
  value: string;
  label: string;
  note?: string;
  /** True only when evidence is on file. Unverified claims are never rendered. */
  verified: boolean;
  /** Where the evidence lives (contract, status page, registry entry, ...). */
  evidence?: string;
};

export const CLAIMS: readonly Claim[] = [
  { id: "uptime-sla", value: "99.95%", label: "Uptime SLA", note: "with service credits", verified: false },
  { id: "ttfb", value: "< 200ms", label: "Avg. TTFB", note: "London · New York · Dubai", verified: false },
  { id: "first-reply", value: "18 min", label: "Avg. first reply", verified: false },
  { id: "founded", value: "2019", label: "Founded", verified: false },
  { id: "money-back", value: "30-day", label: "Money-back guarantee", verified: false },
  { id: "free-ssl", value: "Free SSL", label: "Let's Encrypt certificates", verified: false },
  { id: "cloudflare-cdn", value: "CDN", label: "Cloudflare network", verified: false },
] as const;

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
