// TODO: replace with verified data
// ---------------------------------------------------------------------------
// SAMPLE DATA ONLY. Every value in this file is a layout fixture for the /v2
// showcase. None of it is verified: people, companies, metrics and sources below
// must NEVER ship to a public page. Public pages read verified facts from
// `content/claims.ts` and prices from `data/pricing.json`.
// ---------------------------------------------------------------------------
import type { RouterPath } from "@/components/sections/bespoke/PathRouter";
import type { SplitItem } from "@/components/sections/bespoke/ResponsibilitySplit";
import type { LogoItem } from "@/components/sections/LogoWall";
import type { ResourcePost } from "@/components/sections/ResourceGrid";
import type { TestimonialItem } from "@/components/sections/Testimonials";

export const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  { quote: "Sample quote describing a migration experience in the customer's own words.", name: "Sample Person", role: "Director", company: "Sample Agency Ltd" },
  { quote: "Sample quote about support responsiveness, written as a layout placeholder.", name: "Another Sample", role: "Head of E-commerce", company: "Sample Retail Co" },
  { quote: "Sample quote about renewal pricing and clarity, used only to test the layout.", name: "Third Sample", role: "CTO", company: "Sample Software GmbH" },
];

export const SAMPLE_LOGOS: LogoItem[] = ["Sample One", "Sample Two", "Sample Three", "Sample Four", "Sample Five"].map((name) => ({ name }));

export const SAMPLE_CASE_STUDY = {
  title: "A sample case study headline about a measurable improvement",
  description: "Sample description of a customer project. Replace with a customer-approved write-up and link before publishing.",
  metrics: [
    { value: "00%", label: "Sample metric one" },
    { value: "0.0s", label: "Sample metric two" },
  ],
};

export const SAMPLE_POSTS: ResourcePost[] = [
  { title: "How a staging site makes WordPress updates safer", description: "A practical walk-through of testing updates before they reach visitors.", href: "/blog", category: "WordPress", readTime: "6 min read", date: "2026-01-15" },
  { title: "A GDPR checklist for hosting customers", description: "What to check when your site serves visitors in the European Union.", href: "/blog", category: "Compliance", readTime: "8 min read", date: "2026-02-03" },
  { title: "What actually happens during a migration", description: "The steps from copy to domain switch, and where people usually get stuck.", href: "/blog", category: "Hosting", readTime: "5 min read" },
];

export const SAMPLE_CODE = `# Add this to wp-config.php
define( 'WP_ENVIRONMENT_TYPE', 'staging' );
define( 'DISALLOW_FILE_EDIT', true );`;

// Draft home-page copy (docs/reference/pages/HOME_PAGE_DESIGN.md). Capability items carry the claim they depend on; none of
// those claims is verified, so the live components omit them. The final copy moves to content/pages/home.json.
export const SAMPLE_PATHS: RouterPath[] = [
  { title: "I already have a WordPress site", line: "We move it to DronaHost and look after it.", href: "/wordpress-hosting", cta: "See WordPress hosting", icon: "layers" },
  { title: "I need a website built", line: "We design a new WordPress site, then host it.", href: "/web-design", cta: "See website design", icon: "palette", claim: "website-design-service" },
  { title: "I need simple hosting for a business site", line: "Web hosting with a cPanel dashboard, for any kind of site. Email is not included.", href: "/business-hosting", cta: "See business hosting", icon: "globe", claim: "business-hosting-scope" },
  { title: "I want full control of my server", line: "Managed VPS with root access.", href: "/vps-hosting", cta: "See managed VPS", icon: "server", claim: "managed-vps-scope" },
];

export const SAMPLE_PATHS_LONG: RouterPath[] = [
  { title: "I run an online shop that has outgrown the hosting plan it started on and I am not sure what to move to", line: "Tell us how many orders you take and what slows down, and we will say which plan fits, or honestly that you need something else entirely.", href: "/wordpress-hosting", cta: "See WordPress hosting for busy sites", icon: "trending-up" },
  { title: "I am an agency with client sites", line: "One team to talk to for all of them.", href: "/contact", cta: "Talk to our team", icon: "users" },
];

export const SAMPLE_SPLIT_LOOK_AFTER: SplitItem[] = [
  { text: "The servers your site runs on", claim: "managed-server-care" },
  { text: "Backups of your site", claim: "backups" },
  { text: "Moving your site across", claim: "migration-process" },
  { text: "Answering when something goes wrong" },
];

export const SAMPLE_SPLIT_KEEP: SplitItem[] = [
  { text: "Your content, products and pages" },
  { text: "Which plugins and themes you choose" },
  { text: "Your domain and your accounts" },
  { text: "Your business decisions" },
];

export const SAMPLE_SPLIT_UNEVEN_LEFT: SplitItem[] = [
  { text: "The servers your site runs on, including keeping the software they depend on up to date" },
  { text: "Backups of your site, so a bad update can be rolled back" },
  { text: "Moving your site across from your current host" },
  { text: "Answering when something goes wrong, in plain words" },
  { text: "Telling you what we did and what you need to do next" },
];

export const SAMPLE_SPLIT_UNEVEN_RIGHT: SplitItem[] = [
  { text: "Your content, products and pages" },
  { text: "Which plugins and themes you choose" },
  { text: "Your business decisions" },
];

export const SAMPLE_ANSWER = {
  title: "What is managed WordPress hosting?",
  answer:
    "Managed WordPress hosting means your host looks after the technical work behind your website: the servers, backups, security and updates. You keep control of your content and your business. It suits owners who want a reliable site without learning server administration.",
  detail: [
    "In plain terms, you log in to WordPress as usual and write, sell and publish. The work that keeps the site online, safe and recoverable is done for you.",
    "If something does go wrong, you talk to the team that runs the servers, not to a help article.",
  ],
};

// ---------------------------------------------------------------------------
// Intent banners (components/sections/banners). Layout fixtures only: every date, number, region fact and promise below is
// a SAMPLE. Real pages take these props from the page spec, the claims registry and lib/pricing.
// ---------------------------------------------------------------------------
export const SAMPLE_BANNERS = {
  answer: {
    question: "What is managed WordPress hosting?",
    answer:
      "Managed WordPress hosting means the host looks after the server your site runs on, including backups and updates, so you can focus on your content and your customers. It suits small-business owners who want a reliable site without learning server administration, and who would rather ask a team than search alone.",
    byline: { reviewer: "Sample Reviewer", reviewedOn: "2026-10-01" },
    partOfSpeech: "noun phrase",
    readingTime: "6 min read",
    toc: [
      { label: "What the host does", href: "#banners-informational" },
      { label: "What you still do", href: "#banners-informational" },
      { label: "Who it is for", href: "#banners-informational" },
      { label: "What it costs", href: "#banners-informational" },
    ],
    next: { label: "Read: how a staging site works", href: "/blog" },
  },
  guide: {
    eyebrow: "Guide",
    title: "How to move a WordPress site without downtime",
    summary: "A step-by-step guide for site owners moving to a new host. It covers the copy, the private check, the domain switch and what to do if something breaks.",
    meta: { readingTime: "12 min read", updatedOn: "2026-09-18", reviewer: "Sample Reviewer" },
    learn: ["Copy the site without touching the live one", "Check the copy on a private link before anyone sees it", "Switch the domain at a quiet hour and confirm it worked", "Keep the old host live until the switch is confirmed"],
    cta: { label: "Skip to the steps", href: "#banners-informational" },
  },
  brand: {
    name: "DronaHost",
    entityLine: "DronaHost is a focused team that offers managed WordPress hosting for small businesses, freelancers and agencies worldwide.",
    destinations: [
      { label: "Plans and pricing", href: "/pricing", icon: "layers" as const },
      { label: "Open a support ticket", href: "/contact", icon: "life-buoy" as const },
      { label: "About the team", href: "/about", icon: "users" as const },
      { label: "Refund policy", href: "/refund-policy", icon: "refresh-cw" as const },
    ],
    primaryCta: { label: "See WordPress hosting plans", href: "/wordpress-hosting" },
  },
  destinations: [
    { title: "Log in to your account", line: "Billing, invoices and your hosting dashboard.", href: "/contact", icon: "lock" as const, key: "L" },
    { title: "Plans and pricing", line: "Every plan with its renewal price and the tax line.", href: "/pricing", icon: "layers" as const, key: "P" },
    { title: "Get help", line: "Open a ticket or write to the team by email.", href: "/contact", icon: "life-buoy" as const, key: "H" },
    { title: "Policies", line: "Refunds, support, backups and migration, in plain language.", href: "/refund-policy", icon: "file-text" as const, key: "R" },
  ],
  verdict: {
    eyebrow: "Comparison",
    title: "DronaHost vs Sample Host",
    verdict: "Choose DronaHost if you want a managed WordPress plan with the same price at renewal and a team to write to. Choose Sample Host if you need root access on a cheap unmanaged server.",
    checkedOn: "2026-10-01",
    criteria: ["Renewal price", "Support channels", "Backups", "Migration", "Who runs the server"],
    options: [
      { name: "DronaHost", bestFor: "Owners who want the server looked after and a price that does not change at renewal." },
      { name: "Sample Host", bestFor: "Developers who want root access and are happy to manage updates and backups themselves." },
    ] as const,
    primaryCta: { label: "Read the full comparison", href: "#banners-commercial" },
    secondaryCta: { label: "See WordPress hosting plans", href: "/wordpress-hosting" },
  },
  buyersGuide: {
    eyebrow: "Buyer's guide",
    title: "How to choose WordPress hosting for a small business",
    summary: "What to check before you pay: the renewal price, who does the updates, how backups are restored, and how you reach a person. Written for owners, not system administrators.",
    compared: ["Renewal price", "Managed or unmanaged", "Backup restore", "Support channels", "Migration help", "Honest limits"],
    forWho: "A small business, freelancer or agency with one to ten WordPress sites and no in-house server person.",
    notFor: "A high-traffic store that needs a dedicated server, or a team that wants root access.",
    issue: "01",
    dateLine: "October 2026",
    cta: { label: "Read the checklist", href: "#banners-commercial" },
  },
  offer: {
    eyebrow: "Managed WordPress hosting",
    title: "Hosting that stays the same price",
    titleAccent: "at renewal",
    description: "We look after the server, the backups and the updates. You keep control of your content, your plugins and your domain.",
    planName: "Managed WordPress",
    primaryCta: { label: "Choose a plan", href: "/pricing" },
    riskReducer: { text: "30-day money-back guarantee (sample)", href: "/refund-policy" },
    nextStep: "You get an email with your login within one working day, and we reply to every ticket by email. (sample)",
    highlights: ["Free move of one website per package (sample)", "Renewal price equals the signup price (sample)", "Support by ticket and email"],
  },
  actionBand: {
    label: "Growth plan",
    line: "For a business site or a small shop that is starting to get traffic.",
    cta: { label: "Choose Growth", href: "/pricing" },
    note: "Prices exclude tax. Customers in India pay GST at checkout.",
  },
  region: {
    eyebrow: "For UK businesses",
    title: "WordPress hosting for UK businesses",
    description: "The same plans and the same prices as everywhere else, billed in pounds, with the rules that apply to a UK business stated plainly.",
    code: "UK",
    currency: "GBP",
    facts: [
      { label: "Billing", value: "GBP, same plans and prices as every country (sample)" },
      { label: "Tax", value: "No VAT is charged; the price you see is the price you pay (sample)" },
      { label: "Support hours", value: "Tickets answered 09:00 to 18:00 UK time on working days (sample)" },
      { label: "Data protection", value: "UK GDPR applies; a data processing agreement is available (sample)" },
    ],
    hostedLine: "Your site runs on infrastructure from leading cloud providers. We do not promise a city or a country per plan. (sample standard answer)",
    primaryCta: { label: "See WordPress hosting plans", href: "/wordpress-hosting" },
    secondaryCta: { label: "Read what applies in the UK", href: "#banners-local" },
  },
  serviceArea: {
    eyebrow: "Worldwide",
    title: "We serve customers in many countries",
    description: "The plans and prices are the same everywhere. Only the currency, the tax line and the local rules on the regional page change.",
    regions: [
      { label: "United States", currency: "USD", href: "#banners-local", note: "Billed in US dollars, no sales tax collected (sample)" },
      { label: "United Kingdom", currency: "GBP", href: "#banners-local", note: "Billed in pounds, UK GDPR applies (sample)" },
      { label: "European Union", currency: "EUR", href: "#banners-local", note: "Billed in euros, GDPR applies (sample)" },
      { label: "United Arab Emirates", currency: "AED", note: "Billed in dirhams (sample, page not yet published)" },
      { label: "India", currency: "INR", note: "Billed in rupees, GST at checkout (sample)" },
    ],
    honestLine: "We have no local offices. Support is by ticket and email, in English, from one team for every country.",
  },
  facts: [
    { sentence: "DronaHost charges the same price at renewal as at signup, because the renewal price is set in the pricing policy, not in a promotion.", source: { label: "Pricing and renewal policy", href: "/pricing-policy" }, checkedOn: "2026-10-01" },
    { sentence: "DronaHost moves one existing website per hosting package for free, as stated in the migration terms.", source: { label: "Free migration terms", href: "/migration-terms" }, checkedOn: "2026-10-01" },
    { sentence: "DronaHost offers a 30-day money-back guarantee on hosting plans, with the conditions set out in the refund policy.", source: { label: "Refund policy", href: "/refund-policy" }, checkedOn: "2026-10-01" },
  ],
  task: {
    eyebrow: "Plan finder",
    title: "Find the plan that fits your site",
    description: "Answer three questions about your site and we name the plan, with the reason. The rules are written down, so you can check them.",
    inputs: ["How many websites you run", "Roughly how many visitors a month", "Whether you sell online"],
    outcome: "A named plan with its price and renewal price, and the reason we picked it. If no plan fits, we say so.",
    example: {
      question: "I run two WordPress sites with about 20,000 visits a month and no shop. Which plan do I need?",
      readings: [
        { label: "Websites", value: "2", level: 0.4 },
        { label: "Visits a month", value: "20,000", level: 0.55 },
        { label: "Online shop", value: "No", level: 0.1 },
      ],
      result: "Growth",
      answer: "Growth, because it includes two websites and the traffic allowance covers 20,000 visits a month. Starter includes one website, so two sites would not fit. (sample answer; the real rules read data/pricing.json)",
    },
    cta: { label: "Start the plan finder", href: "/pricing" },
  },
} as const;
