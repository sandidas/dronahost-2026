/**
 * Shared UI strings: the small pieces of text that components need but that are not page copy, claims or company facts.
 * Page copy lives in content/pages/*.json. Promises live in content/claims.ts. Company facts live in content/company.ts.
 * `npm run check:copy-source` fails when a section component holds a text literal of its own, so new text goes here.
 */
import { isVerified } from "./claims";
import { COMPANY } from "./company";

/** "Free" wording on the migration form only while the free-migration claim renders. */
const FREE_MIGRATION = isVerified("free-migration");

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
    readDetails: "Read the details",
    readTerms: "Read the terms",
    verifyOn: "Verify on",
    linkedIn: "LinkedIn",
    theirSite: "their site",
  },
  /** Region name for the assurance strip when the page does not give one. */
  assurance: { region: "Our commitments" },
  stats: { region: "Service statistics" },
  caseStudy: { eyebrow: "Case study", sampleData: "Sample data (unverified)", read: "Read the case study", source: "Source:", publishedLink: "published case study" },
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
  /** The migration request form. Page JSON gives the heading, the lead and the list of fields. */
  migrationRequest: {
    labels: { siteUrl: "Your website address", currentHost: "Who hosts your site now", email: "Your email", note: "Anything we should know (optional)" },
    placeholders: { siteUrl: "example.com", currentHost: "Your current host", email: "you@example.com", note: "" },
    submit: FREE_MIGRATION ? "Move my site free" : "Ask us to move your site",
    submitting: "Sending your request",
    errors: {
      siteUrl: "Enter your website address, for example example.com.",
      currentHost: "Tell us who hosts your site now.",
      email: "Enter an email address we can reply to.",
      note: "Keep the note under 500 characters.",
      summary: "Please fix the fields marked below.",
      form: `We could not send your request. Try again, or email us at ${COMPANY.supportEmail}.`,
      notConfigured: "This form cannot send yet. Please open a ticket from the contact page.",
    },
    ticketLink: "Open a ticket",
    successMailtoTitle: "Your request is ready to send",
    successMailtoBody: "Your email app opened with your request. Send it from there and we reply by email with the next steps.",
    successSentTitle: "Thanks, we have your request",
    successSentBody: "We reply by email with the next steps.",
    privacyBefore: "We use these details only to answer your request. Read the",
    privacyLink: "privacy policy",
    privacyAfter: ".",
    preview: "Preview only: no email address is set, so this form cannot send yet. Set supportEmail in content/company.ts.",
    mailSubject: FREE_MIGRATION ? "Free migration request" : "Migration request",
    stickyLabel: FREE_MIGRATION ? "Move my site free" : "Ask us to move your site",
    optional: "optional",
    required: "required",
    honeypot: "Leave this field empty",
  },
  /** The provenance line at the end of a page: who reviewed it, when, how facts are checked, how to report an error. */
  provenance: {
    region: "About this page",
    reviewedBy: "Reviewed by",
    on: "on",
    policyLink: "How we write and check our pages",
  },
  /** The honest-limits section: labels for the "instead" link and the first-hand marker. */
  limits: {
    firstHand: "Our decision",
  },
  /** Fixed labels inside the intent banners (components/sections/banners). The copy itself comes from props. */
  banners: {
    reviewedBy: "Reviewed by",
    updated: "Updated",
    checkedOn: "Facts checked on",
    inThisGuide: "In this guide",
    youWillLearn: "What you will learn",
    whatWeCompared: "What we compared",
    bestFor: "Best for",
    notFor: "Not for",
    verdict: "Verdict",
    criteria: "How we compared",
    renewsAt: "Renews at",
    whatHappensNext: "What happens next",
    source: "Source",
    quickLinks: "Quick links",
    regions: "Where we serve",
    youNeed: "You will need",
    youGet: "You get",
    example: "Example",
    question: "Question",
    answer: "Answer",
    vs: "vs",
    jumpTo: "Jump to a page",
    keyHint: "Shortcut",
    issue: "Issue",
    plan: "Plan",
    billed: "Billed",
    tax: "Tax",
    total: "From",
    region: "Region",
    currency: "Currency",
    start: "Start",
    finish: "Done",
    readingTime: "Reading time",
    result: "Result",
    notes: "Notes",
    definition: "Definition",
    footnotes: "Sources",
    citeAs: "Cite as",
  },
  /** Error messages that reach visitors (content-writing-rules §5): say what happened and what to do next. */
  errors: {
    fixFields: "Please fix the fields marked below.",
    contactUnreadable: "We could not read your message. Reload the page and try again.",
    sendFailed: `Your message could not be sent right now. Try again, or email us at ${COMPANY.supportEmail}.`,
    consentUnreadable: "We could not save your cookie choice. Reload the page and choose again.",
    consentNotStored: "We could not record your cookie choice right now. Your choice still applies in this browser.",
    domainCheckFailed: `We could not check availability right now. Try again in a moment, or email us at ${COMPANY.supportEmail}.`,
    domainSearchOff: "Domain search is not available yet. Ask the team to check a name for you.",
  },
  pricing: {
    customTitle: "Custom pricing",
    customLine: "Talk to the team for a quote.",
    onRequestTitle: "Price on request",
    onRequestLine: "Ask the team for current pricing.",
    billingPeriod: "Billing period",
    billedAnnually: "Billed annually",
    billedMonthly: "Billed monthly",
    billedAnnuallyAfter: "billed annually.",
    customCta: "Talk to the team",
    choosePlan: (plan: string): string => `Choose ${plan}`,
    talkAboutPlan: (plan: string): string => `Talk to the team about ${plan}`,
    unavailable: "Plans are not available right now. Please contact the team.",
  },
} as const;

/** Title, one line and link text for each policy page a page may link to. The icons and the published list stay in lib/content/published-pages.ts. */
export const POLICY_TEXT: Record<string, { title: string; description: string; linkLabel: string }> = {
  "/refund-policy": { title: "Refund policy", description: "How the money-back guarantee works and how to ask for a refund.", linkLabel: "Read the refund policy" },
  "/support-policy": { title: "Support policy", description: "How to reach us and how support works.", linkLabel: "Read the support policy" },
  "/pricing-policy": { title: "Pricing and renewal", description: "What you pay at signup and at renewal, and how tax works.", linkLabel: "Read how renewals work" },
  "/backup-policy": { title: "Backup policy", description: "How often we back up your site and what is kept.", linkLabel: "Read the backup policy" },
  "/migration-terms": { title: "Free migration terms", description: "What free migration covers: one website per hosting package.", linkLabel: "Read the migration terms" },
  "/terms": { title: "Terms of service", description: "The agreement between you and DronaHost, in writing.", linkLabel: "Read the terms" },
  "/sla": { title: "Service level agreement", description: "What we commit to on availability, and what happens if we miss it.", linkLabel: "Read the SLA" },
  "/privacy": { title: "Privacy policy", description: "What data we collect, why, and the choices you have.", linkLabel: "Read the privacy policy" },
};
