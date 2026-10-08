/**
 * Shared UI strings: the small pieces of text that components need but that are not page copy, claims or company facts.
 * Page copy lives in content/pages/*.json. Promises live in content/claims.ts. Company facts live in content/company.ts.
 * `npm run check:copy-source` fails when a section component holds a text literal of its own, so new text goes here.
 */
export const UI = {
  /** Labels shown only in the /v2 showcase or in development, so a sample is never mistaken for a fact. */
  sample: {
    unverified: "Sample, unverified",
    hiddenInProduction: "Sample, hidden in production",
    notConfigured: "Sample, not configured",
    hiddenUntil: (claim: string): string => `Sample: hidden until “${claim}” is confirmed`,
    draftPrices: "Draft prices from data/pricing.json (unconfirmed). Hidden in production until FEATURES.pricesConfirmed is set.",
  },
  generic: {
    learnMore: "Learn more",
    readTerms: "Read the terms",
    verifyOn: "Verify on",
    linkedIn: "LinkedIn",
    theirSite: "their site",
  },
  /** Region name for the assurance strip when the page does not give one. */
  assurance: { region: "Our commitments" },
  split: { lookAfter: "We look after", keep: "You keep" },
  /** The decorative dashboard in the hero. A page can override each value in its JSON (`mockup`). */
  mockup: {
    caption: "Example dashboard",
    address: "yoursite.com",
    status: "Online",
    tiles: ["Site", "Backups", "Support"],
    stagingAddress: "staging.yoursite.com",
    stagingBadge: "Private copy",
    stagingSteps: ["Clone your live site to staging", "Update plugins and themes safely", "Review the changes", "Push to your live site"],
    goLive: "Go live",
  },
  support: {
    ticket: { title: "Support ticket", description: "Describe the issue and we reply by email with next steps.", action: "Open a ticket" },
    email: { title: "Email", description: "Prefer your own email app? Write to us directly and we reply there.", action: "Email the team" },
  },
  pricing: {
    customTitle: "Custom pricing",
    customLine: "Contact us for a quote.",
    onRequestTitle: "Price on request",
    onRequestLine: "Ask the team for current pricing.",
    billingPeriod: "Billing period",
    unavailable: "Plans are not available right now. Please contact the team.",
  },
} as const;

/** Title, one line and link text for each policy page a page may link to. The icons and the published list stay in lib/content/published-pages.ts. */
export const POLICY_TEXT: Record<string, { title: string; description: string; linkLabel: string }> = {
  "/refund-policy": { title: "Refund policy", description: "How the money-back guarantee works and how to ask for a refund.", linkLabel: "Read the refund policy" },
  "/support-policy": { title: "Support policy", description: "How to reach us and how support works.", linkLabel: "Read the support policy" },
  "/pricing-policy": { title: "Pricing and renewal", description: "What you pay at signup and at renewal, and how tax works.", linkLabel: "Read how renewals work" },
  "/backup-policy": { title: "Backup policy", description: "How often we back up your site and what is kept.", linkLabel: "Read the backup policy" },
  "/migration-terms": { title: "Free migration terms", description: "What free migration covers: one website per package, up to 10 on a VPS.", linkLabel: "Read the migration terms" },
  "/terms": { title: "Terms of service", description: "The agreement between you and DronaHost, in writing.", linkLabel: "Read the terms" },
  "/sla": { title: "Service level agreement", description: "What we commit to on availability, and what happens if we miss it.", linkLabel: "Read the SLA" },
  "/privacy": { title: "Privacy policy", description: "What data we collect, why, and the choices you have.", linkLabel: "Read the privacy policy" },
};
