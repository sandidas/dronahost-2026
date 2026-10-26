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
 * is a published, reviewed route (`termsPageStatus: "published"`). To show a claim once its
 * terms page is live and reviewed, set `termsPageStatus: "published"` (and `termsPage` if it
 * was null): that is the only change needed. The derived
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
  /**
   * "stat" is a measured number (animated count-up allowed). "assurance" is a policy shown as a static line with a terms link.
   * "feature" is a product capability fact (backups, staging, SSH...) that gates feature tiles and list items; no strip renders it.
   */
  kind: "stat" | "assurance" | "feature";
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
  { id: "uptime-sla", kind: "stat", text: "99.99% uptime SLA with service credits", value: "99.99%", label: "Uptime SLA", note: "with service credits", termsLabel: "Read the SLA", ...OWNER_CONFIRMED, source: "owner 2026-10-10: 99.99% on every hosting plan (decision 45); credit terms on /sla modeled on Kinsta's published SLA, updated 2025-09-25 (decision 53)", verifiedOn: "2026-10-10", termsPage: "/sla", termsPageStatus: "published" },
  { id: "ttfb", kind: "stat", text: "Average TTFB under 200ms from London, New York and Dubai", value: "< 200ms", label: "Avg. TTFB", note: "London · New York · Dubai", ...NONE },
  { id: "first-reply", kind: "stat", text: "Average first reply in 18 minutes", value: "18 min", label: "Avg. first reply", ...NONE },
  { id: "founded", kind: "stat", text: "Founded in 2019", value: "2019", label: "Founded", ...NONE },
  { id: "money-back", kind: "assurance", icon: "refresh-cw", termsLabel: "Read the refund policy", text: "30-day money-back guarantee", value: "30-day", label: "Money-back guarantee", ...OWNER_CONFIRMED, source: "owner approved /refund-policy 2026-10-08", verifiedOn: "2026-10-08", termsPage: "/refund-policy", termsPageStatus: "published" },
  { id: "support-24-7", kind: "assurance", icon: "life-buoy", termsLabel: "Read the support terms", text: "24/7 support by ticket and email", value: "24/7", label: "Support", ...OWNER_CONFIRMED, source: "owner approved /support-policy 2026-10-08", verifiedOn: "2026-10-08", termsPage: "/support-policy", termsPageStatus: "published" },
  { id: "free-migration", kind: "assurance", icon: "server", termsLabel: "Read the migration terms", text: "Free migration to DronaHost", value: "Free", label: "Site migration", ...OWNER_CONFIRMED, source: "owner approved /migration-terms 2026-10-08", verifiedOn: "2026-10-08", termsPage: "/migration-terms", termsPageStatus: "published" },
  { id: "renewal-price-same", kind: "assurance", icon: "shield-check", termsLabel: "Read how renewals work", text: "Renewal price equals the signup price", value: "Same price", label: "At renewal", ...OWNER_CONFIRMED, source: "owner approved /pricing-policy 2026-10-08", verifiedOn: "2026-10-08", termsPage: "/pricing-policy", termsPageStatus: "published" },
  { id: "free-ssl", kind: "assurance", icon: "lock", text: "Free SSL certificates from Let's Encrypt", value: "Free SSL", label: "Let's Encrypt certificates", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  // ── Capability facts the owner must confirm (HOME_PAGE_DESIGN.md section 7). All unverified: tiles and list items
  // that depend on them do not render. When confirmed, set status "verified", fill source and verifiedBy/On, and point
  // termsPage at the page that states the capability (for example "/wordpress-hosting"), then publish it.
  { id: "managed-server-care", kind: "feature", text: "DronaHost looks after the servers your site runs on", value: "Servers", label: "Server care", ...NONE },
  { id: "managed-hosting-tasks", kind: "feature", text: "DronaHost applies WordPress updates, runs NGINX caching, takes daily backups and fixes WordPress problems in support tickets", value: "Managed", label: "What managed covers", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "backups", kind: "feature", text: "Automatic backups of your site", value: "Backups", label: "Backups", ...OWNER_CONFIRMED, source: "owner approved /backup-policy 2026-10-08", verifiedOn: "2026-10-08", termsPage: "/backup-policy", termsPageStatus: "published" },
  { id: "backup-retention", kind: "feature", text: "Backup retention period for each plan", value: "Retention", label: "Backup retention by plan", ...NONE },
  { id: "staging-plans", kind: "feature", text: "Staging with clone and sync on every WordPress plan, in the control panel", value: "Staging", label: "Staging", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "litespeed", kind: "feature", text: "LiteSpeed web servers with server-level caching", value: "LiteSpeed", label: "LiteSpeed", ...NONE },
  { id: "wp-control-panel", kind: "feature", text: "One control panel on every WordPress plan to manage files, databases, plugins, themes, staging and backups", value: "Control panel", label: "Control panel", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 66; SSH and WP-CLI are not offered)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "malware-scanning", kind: "feature", text: "A firewall, brute-force protection and malware scanning on every plan", value: "Security", label: "Three security layers", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "business-hosting-scope", kind: "feature", text: "What Business Hosting includes (the Web hosting plans: control panel, any site type, email not included)", value: "Business", label: "Business Hosting scope", ...NONE },
  { id: "managed-vps-scope", kind: "feature", text: "What Managed VPS includes (root access)", value: "VPS", label: "Managed VPS scope", ...NONE },
  { id: "website-design-service", kind: "feature", text: "Website design is offered as described: a new WordPress site designed, then hosted", value: "Design", label: "Website design service", ...NONE },
  { id: "migration-process", kind: "feature", text: "Migration process: you share access to your current hosting, we transfer your site, we ask your permission, then your DNS is pointed to DronaHost; your old site stays live until then", value: "Migration", label: "Migration process", ...OWNER_CONFIRMED, source: "owner 2026-10-11: 'they share the access of old hosting, we transfer ask permisioonn, then point DNS, then done'; no private-link review (decision 61)", verifiedOn: "2026-10-11", termsPage: "/migration-terms", termsPageStatus: "published" },
  { id: "nvme", kind: "feature", text: "NVMe SSD storage on every plan", value: "NVMe", label: "NVMe storage", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "nginx-caching", kind: "feature", text: "NGINX caching on every WordPress plan", value: "NGINX", label: "NGINX caching", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "backup-layers", kind: "feature", text: "Two daily backups: one local and one offsite, each replacing the copy before it", value: "2 backups", label: "Daily backup layers", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "premium-themes", kind: "feature", text: "Divi, Elementor Pro and Astra on every plan, installed and kept up to date by DronaHost", value: "Premium", label: "Premium themes and plugins", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "free-domain", kind: "feature", text: "A free domain for the first year with annual billing", value: "Free domain", label: "First year", ...OWNER_CONFIRMED, source: "owner 2026-10-11 (decision 61)", verifiedOn: "2026-10-11", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "control-panel", kind: "feature", text: "A control panel on every plan", value: "Control panel", label: "Control panel", ...NONE },
  { id: "react-nextjs", kind: "feature", text: "Custom development with React and Next.js", value: "React", label: "Custom development stack", ...OWNER_CONFIRMED, source: "owner 2026-10-26 (technology strip)", verifiedOn: "2026-10-26", termsPage: "/consultation", termsPageStatus: "draft" },
  { id: "imunify360", kind: "feature", text: "Imunify360 security on our hosting servers", value: "Imunify360", label: "Server security", ...OWNER_CONFIRMED, source: "owner 2026-10-26 (technology strip); /security must name it before this is published", verifiedOn: "2026-10-26", termsPage: "/security", termsPageStatus: "draft" },
  { id: "plesk", kind: "feature", text: "WordPress hosting runs on the Plesk control panel", value: "Plesk", label: "Control panel", ...OWNER_CONFIRMED, source: "owner 2026-10-11 interview (Plesk with WP Toolkit); naming allowed 2026-10-26 (decision 79)", verifiedOn: "2026-10-26", termsPage: "/wordpress-hosting", termsPageStatus: "draft" },
  { id: "cpanel-in-use", kind: "feature", text: "cPanel is part of the technology we run (which products include it is not stated yet)", value: "cPanel", label: "Control panel", ...OWNER_CONFIRMED, source: "owner 2026-10-26 (decision 79); products not named yet", verifiedOn: "2026-10-26", termsPage: "/business-hosting", termsPageStatus: "draft" },
  { id: "cloudpanel-in-use", kind: "feature", text: "CloudPanel is part of the technology we run (which products include it is not stated yet)", value: "CloudPanel", label: "Control panel", ...OWNER_CONFIRMED, source: "owner 2026-10-26 (decision 81): most hosting runs Plesk; cPanel and CloudPanel are also used", verifiedOn: "2026-10-26", termsPage: null, termsPageStatus: "draft" },
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

/**
 * Owner-confirmed, with or without a published terms page. Only for facts that carry no terms, such as the software in a
 * technology logo strip (decision 81). Guarantees, figures and promises use claimRenders.
 */
export const claimConfirmed = (id: string): boolean => RECORDS.some((c) => c.id === id && c.status === "verified");

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
