// TODO: replace with verified data
// ---------------------------------------------------------------------------
// SAMPLE DATA ONLY. Every value in this file is a layout fixture for the /v2
// showcase. None of it is verified: people, companies, metrics and sources below
// must NEVER ship to a public page. Public pages read verified facts from
// `content/claims.ts` and prices from `data/pricing.json`.
// ---------------------------------------------------------------------------
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
