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
  caseStudy: { eyebrow: "Case study", read: "Read the case study", screenshotCaption: "Live site, captured", source: "Source:", publishedLink: "published case study" },
  split: { lookAfter: "We look after", keep: "You keep" },
  /**
   * The hero illustration of the hosting control panel (ProductHero variant "panel"), modeled on the real Plesk dashboard
   * (owner screenshot, 2026-10-11). Only tools the owner confirmed appear; there is no Mail item because email is not part
   * of hosting. The domain and caption come from the page JSON.
   */
  panelMockup: {
    nav: ["Websites & Domains", "Files", "Databases", "Statistics", "WordPress"],
    title: "Websites & Domains",
    active: "Active",
    tabs: ["WordPress", "Dashboard", "Hosting & DNS"],
    tools: ["Files", "Plugins", "Themes", "Database", "Clone", "Copy Data", "Back Up / Restore"],
    updatesTitle: "Updates",
    updates: [
      ["WordPress", "Up to date"],
      ["Plugins", "Up to date"],
      ["Themes", "Up to date"],
    ],
    securityTitle: "Security",
    security: ["Let's Encrypt SSL", "Firewall", "Brute-force protection", "Malware scanning"],
    performanceTitle: "Performance",
    performance: ["Caching (NGINX)"],
  },
  /** Labels inside the animated product-page illustrations (components/sections/visuals/motion-graphics.tsx). */
  graphics: {
    tiersTitle: "Resources by plan",
    tiersCpu: "CPU cores",
    tiersRam: "Memory",
    tiersCaption: "Illustration of each plan's CPU and memory, from our plan data",
    /** Shown under the tiers only while the renewal-price-same claim renders. */
    tiersSameRenewal: "Every plan renews at its signup price",
    dnsSwitched: "DNS pointed. Your site is live on DronaHost",
    backupLocal: "Local copy",
    backupOffsite: "Offsite copy",
    panelTools: ["Files", "Databases", "Plugins", "Themes", "Staging", "Backups"],
    careTitle: "Looked after on yourbusiness.com",
    careItems: ["WordPress updated", "Local backup taken", "Offsite backup taken", "Malware scan: clean", "SSL certificate renewed"],
    careDone: "Done",
    managedLane: "Managed: DronaHost does it",
    sharedLane: "Shared: you do it",
    laneTasks: ["Apply updates", "Set up caching", "Take backups", "Fix WordPress errors"],
    builderTitle: "Page editor",
    builderWidgets: ["Heading", "Image", "Columns", "Button", "Form"],
    builderPublish: "Publish",
  },
  /** The click-to-load video (components/sections/VideoEmbed.tsx). Nothing loads from YouTube before play. */
  video: {
    play: (title: string) => `Play the video: ${title}`,
    privacy: "The video plays from YouTube (privacy-enhanced mode). YouTube may set cookies once you press play.",
    captions: "Captions available",
    credit: (by: string) => `Video by ${by}`,
    transcript: "Read the transcript",
  },
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
    /** The submit label on the home page form (the console look). */
    submitPlan: "Request my migration plan",
    mailSubject: FREE_MIGRATION ? "Free migration request" : "Migration request",
    stickyLabel: FREE_MIGRATION ? "Move my site free" : "Ask us to move your site",
    optional: "optional",
    required: "required",
    honeypot: "Leave this field empty",
  },
  /** The provenance line at the end of a page: who reviewed it, when, how facts are checked, how to report an error. */
  /** The drawn support exchange in the FAQ collage (components/sections/visuals/FaqCollage.tsx), shown until real photos are supplied. */
  faqVisual: {
    answered: "Answered in your ticket",
    channels: "Support by live chat, ticket and email",
    ticketSteps: ["Ticket opened", "Reply sent", "Question solved"],
  },
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
  /** Header actions. The client area is an outside site (COMPANY.clientAreaUrl). */
  footer: {
    /** Accessible name of the policy links in the footer's bottom strip. */
    bottomNav: "Policies",
    /** Accessible name and visible labels of the social profile links. */
    socialNav: "Social profiles",
    socials: {
      google: "Google",
      x: "X",
      linkedin: "LinkedIn",
      github: "GitHub",
      youtube: "YouTube",
      instagram: "Instagram",
      facebook: "Facebook",
    },
  },
  header: {
    cta: "Plan my migration",
    ctaHref: "/#plan",
    clientLogin: "Client login",
  },
  /** The console visual in the ProductHero "console" variant. The page JSON gives the title, status, tiles and steps. */
  console: {
    progress: "Progress",
    stepOf: (n: number, total: number): string => `Step ${n} of ${total}`,
    state: { done: "Complete", current: "Your review", next: "Next" },
  },
  /** Labels around the home page sections (AdvantageGrid, SolutionsGrid, Ecosystem, RatingBand, ReviewsShowcase). */
  luxe: {
    explore: "Explore",
    assurances: "Our commitments",
    ratingRegion: "Customer ratings",
    rating: (score: string, outOf: string, platform: string, count: string): string => `${score} out of ${outOf} on ${platform}, from ${count} reviews`,
    ecosystemDiagram: (center: string, nodes: readonly string[]): string => `Diagram: ${center} at the centre, connected to ${nodes.join(", ")}`,
    readReview: "Read the review",
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
    perMonthBilledAnnually: "/month, billed annually",
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
    /** The project tax line (content-engine/project/settings.json pricing.taxLine), shown under every block of prices. */
    taxLine: "Prices exclude tax. Customers in India pay GST at checkout.",
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
    /** Prices appear only on the pricing page (decision 58). */
    pricesElsewhereTitle: "See the price",
    pricesElsewhereLink: "Prices are on the pricing page",
    seePlanPrice: (plan: string): string => `See ${plan} pricing`,
    unavailable: "Plans are not available right now. Please contact the team.",
    highTrafficEyebrow: "Beyond these plans",
    renewalCost: {
      caption: "What each plan costs over three years with annual billing",
      plan: "Plan",
      perMonth: "Per month",
      perMonthHint: "Billed annually",
      year: (n: number): string => (n === 1 ? "First year" : `After ${n} years`),
      flat: "Same price every year",
      checked: "Checked",
      source: "Source",
    },
    planGuide: {
      caption: "Which plan fits your business, by websites, storage, memory, CPU and resources",
      plan: "Plan",
      fit: "A good fit when",
      sites: "Websites",
      storage: "NVMe storage",
      resources: "Memory and CPU",
      type: "Resources",
      next: "Next step up",
      gb: (n: number): string => `${n} GB`,
      memoryCpu: (ram: number, cpu: number): string => `${ram} GB memory, ${cpu} CPU cores`,
      beyond: "Talk to the team",
      recommended: "Recommended",
    },
    includedTitle: "Included with every plan",
    addonsTitle: "Optional add-ons",
    addonsLine: "Extras you can add to a plan. Add-on prices are per month, on top of the plan price.",
    compareToggle: "Compare all features",
    compareCaption: "Comparison of every DronaHost hosting plan",
    compareEyebrow: "Compare",
    compareTitle: "Compare every plan",
    compareLine: "Prices, resources, protection, tools, support and add-ons for each plan, side by side.",
    compareRowHeader: "Plan",
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
