/**
 * Copy for /about and /seo-services.
 *
 * TODO: replace with verified data. Draft copy: no founding year, customer counts, awards
 * or ranking promises. Add team names, roles and company details in content/company.ts
 * and a team section once they are confirmed.
 */
import type { FaqItem } from "@/components/sections/FAQSection";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import type { TimelineStep } from "@/components/sections/ProcessTimeline";

type Grid = { eyebrow: string; title: string; description: string; items: { icon: FeatureIconName; title: string; description: string; cta?: { label: string; href: string } }[] };

export const ABOUT_WHAT_WE_DO: Grid = {
  eyebrow: "What we do",
  title: "Hosting and the web work around it",
  description: "We run the servers and we build and grow the sites on them, so you deal with one team.",
  items: [
    { icon: "layers", title: "Managed hosting", description: "WordPress, cloud and VPS hosting, with the server work handled for you.", cta: { label: "See hosting", href: "/wordpress-hosting" } },
    { icon: "palette", title: "Web design", description: "WordPress and custom builds scoped around what your business needs the site to do.", cta: { label: "See web design", href: "/wordpress-website-design" } },
    { icon: "search", title: "SEO services", description: "Technical fixes, content and link work with plain reporting.", cta: { label: "See SEO services", href: "/seo-services" } },
    { icon: "code", title: "Custom development", description: "React and Next.js solutions for products that outgrow a template.", cta: { label: "Talk to us", href: "/contact" } },
  ],
};

export const ABOUT_HOW_WE_WORK: { eyebrow: string; title: string; steps: TimelineStep[] } = {
  eyebrow: "How we work",
  title: "Plain communication, from first message to ongoing support",
  steps: [
    { title: "We listen first", description: "You tell us about the site, the audience and what is not working." },
    { title: "We recommend", description: "A specific plan or scope, including when hosting is not the answer." },
    { title: "We do the work", description: "Migrations, builds and fixes, with updates you can follow." },
    { title: "We stay reachable", description: "Open a ticket and reach the team once you are live." },
  ],
};

export const SEO_CAPABILITIES: Grid = {
  eyebrow: "What the retainer covers",
  title: "Search work, explained in plain language",
  description: "Each engagement is scoped to your site and markets. Typical work includes:",
  items: [
    { icon: "gauge", title: "Technical SEO", description: "Crawlability, structured data, Core Web Vitals and site-speed fixes." },
    { icon: "search", title: "Keyword research", description: "Research into the searches your customers actually use, by market." },
    { icon: "file-text", title: "Content strategy", description: "Editorial planning and topic clusters, written so readers and AI search tools can quote it accurately." },
    { icon: "globe", title: "Link building", description: "Outreach for relevant links from reputable sites in your niche." },
    { icon: "users", title: "Local SEO", description: "Google Business Profile and local citations for location-based businesses." },
    { icon: "activity", title: "Analytics and reporting", description: "Monthly reports on rankings, traffic and conversions, using Search Console and analytics where you have them." },
  ],
};

export const SEO_PROCESS: { eyebrow: string; title: string; steps: TimelineStep[] } = {
  eyebrow: "How an engagement runs",
  title: "From audit to monthly report",
  steps: [
    { title: "Audit", description: "We review your site, search presence and competitors." },
    { title: "Plan", description: "A prioritized list of fixes and content, agreed with you." },
    { title: "Implement", description: "We make the changes, or brief your developers." },
    { title: "Report", description: "A monthly report on what changed and what it did." },
  ],
};

export const SEO_FAQ: FaqItem[] = [
  {
    question: "Can you guarantee rankings?",
    answer: "No one can honestly guarantee a ranking position. We commit to the work in the plan and report on results every month.",
  },
  {
    question: "How is the retainer priced?",
    answer: "SEO is scoped per site and market. Contact the team with your site and goals and we will propose a monthly scope.",
  },
  {
    question: "Do I need to host with DronaHost?",
    answer: "No. SEO services work with any host, although we can also fix performance issues on our own hosting.",
  },
];
