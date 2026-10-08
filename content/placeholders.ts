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
