/**
 * Homepage draft copy.
 *
 * TODO: replace with verified data. This is DRAFT copy ported from docs/pages/home.md with
 * every unconfirmed number, guarantee, benchmark, comparison and review score removed.
 * Add figures back only through `content/claims.ts` once the claim is verified.
 *
 * Voice: calm, specific, no hype (docs/rules/content-writing-rules.md).
 * Hero copy lives in content/heroes.ts.
 */
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import type { FaqItem } from "@/components/sections/FAQSection";
import type { LogoItem } from "@/components/sections/LogoWall";
import type { TestimonialItem } from "@/components/sections/Testimonials";

/* ── Section copy for the Batch C components ───────────────────────────────── */


export const HOME_BENTO = {
  eyebrow: "Why DronaHost",
  title: "Hosting that stays out of your way",
  description: "A managed platform for WordPress and the sites around it, run by a team you can reach.",
  items: [
    {
      title: "Tuned for WordPress",
      description:
        "LiteSpeed servers with built-in page caching, configured for WordPress so you do not have to maintain a stack of caching plugins.",
      visual: "cache",
      span: "twoThirds",
      href: "/wordpress-hosting",
      linkLabel: "Explore WordPress hosting",
    },
    {
      title: "Room to grow",
      description: "Start on a managed plan and move to cloud or VPS hosting when your needs change, without changing provider.",
      visual: "growth",
      span: "third",
      href: "/cloud-hosting",
      linkLabel: "Compare hosting types",
    },
    {
      title: "Safe to change",
      description: "Staging copies and restore points let you test updates and undo mistakes before visitors notice.",
      visual: "restore",
      span: "third",
      href: "/security",
      linkLabel: "How we protect sites",
    },
    {
      title: "Support you can reach",
      description: "Open a ticket and you talk to the team that runs your server.",
      visual: "channels",
      span: "twoThirds",
      href: "/contact",
      linkLabel: "Contact the team",
    },
  ],
} as const;

export const HOME_OFFER: {
  eyebrow: string;
  title: string;
  description: string;
  items: { icon: FeatureIconName; title: string; description: string; cta: { label: string; href: string } }[];
} = {
  eyebrow: "What we offer",
  title: "Hosting and web services under one roof",
  description: "From a single WordPress site to a cloud server, plus the design, SEO and development work that goes with it.",
  items: [
    {
      icon: "layers",
      title: "Managed WordPress hosting",
      description: "Updates, caching, backups and security handled at the server level so you can focus on your site.",
      cta: { label: "See WordPress hosting", href: "/wordpress-hosting" },
    },
    {
      icon: "server",
      title: "VPS and cloud hosting",
      description: "Dedicated resources for applications, stores and teams that need more control.",
      cta: { label: "See VPS hosting", href: "/vps-hosting" },
    },
    {
      icon: "palette",
      title: "Web design and development",
      description: "WordPress, React and Next.js builds scoped around what your business needs the site to do.",
      cta: { label: "See web design", href: "/web-design" },
    },
    {
      icon: "search",
      title: "SEO services",
      description: "Retainer-based search work with plain reporting, covering technical fixes, content and links.",
      cta: { label: "See SEO services", href: "/seo-services" },
    },
  ],
};

export const HOME_SPLITS = [
  {
    visual: "wordpress",
    eyebrow: "Managed WordPress hosting",
    title: "WordPress hosting that is looked after for you",
    description: "We configure, update and monitor the server stack so your time goes into the site itself.",
    features: [
      "LiteSpeed web servers with server-level caching",
      "Staging environments to test updates before they go live",
      "SSL certificates on every site",
    ],
    cta: [
      { label: "View plans", href: "/pricing" },
      { label: "Talk to our team", href: "/contact" },
    ],
  },
  {
    visual: "migration",
    eyebrow: "Free migration",
    title: "Move your site without losing a weekend",
    description: "Tell us where your site lives today. We copy it across and let you review the result before you switch your domain.",
    features: [
      "We copy your files and database",
      "You check the new site before DNS changes",
      "Your current host stays live until you switch",
    ],
    cta: [
      { label: "Start a migration", href: "/migration" },
      { label: "View plans", href: "/pricing" },
    ],
  },
  {
    visual: "protection",
    eyebrow: "Security and backups",
    title: "Protection that runs in the background",
    description: "Security and recovery are part of the platform, not extra products to remember to buy.",
    features: [
      "Automatic backups you can restore from",
      "Malware scanning and firewall rules",
      "SSL certificates that renew on their own",
    ],
    cta: [
      { label: "Read our security practices", href: "/security" },
      { label: "See the SLA", href: "/sla" },
    ],
  },
  {
    visual: "support",
    eyebrow: "Support",
    title: "Real people, ready when you need them",
    description: "Open a ticket and you reach the team that runs your server.",
    features: [
      "Tickets answered by the team that runs your server",
      "Plain-English answers with clear next steps",
      "Escalation to engineers when a problem needs one",
    ],
    cta: [
      { label: "Contact support", href: "/contact" },
      { label: "Read the blog", href: "/blog" },
    ],
  },
] as const;

export const HOME_COMPARE = {
  eyebrow: "Choosing a plan type",
  title: "Which hosting fits your site?",
  description: "Managed WordPress hosting suits most WordPress sites. Move to cloud or VPS hosting when you need more control over resources.",
  caption: "Comparison of WordPress, cloud and VPS hosting",
  columns: [
    { key: "wp", label: "WordPress hosting", href: "/wordpress-hosting", highlight: true },
    { key: "cloud", label: "Cloud hosting", href: "/cloud-hosting" },
    { key: "vps", label: "VPS hosting", href: "/vps-hosting" },
  ],
  groups: [
    {
      rows: [
        {
          label: "Best for",
          values: {
            wp: "WordPress sites and stores",
            cloud: "Sites that outgrow shared resources",
            vps: "Applications and custom software",
          },
        },
        {
          label: "Choose it when you",
          values: {
            wp: "Want the server handled for you",
            cloud: "Expect traffic to change over time",
            vps: "Need dedicated resources",
          },
        },
        {
          label: "You get",
          values: {
            wp: "A managed stack with a staging area",
            cloud: "Flexible plans that scale up",
            vps: "Resources reserved for your workload",
          },
        },
      ],
    },
  ],
} as const;

export const HOME_TESTIMONIALS: { eyebrow: string; title: string; items: TestimonialItem[] } = {
  eyebrow: "Customers",
  title: "What customers say",
  // Empty until real, sourced testimonials exist; the component hides itself.
  items: [],
};

/** Empty until customers give written permission; the component hides itself. */
export const HOME_LOGOS: { title: string; logos: LogoItem[] } = { title: "Businesses that host with DronaHost", logos: [] };

export const HOME_FAQ: { eyebrow: string; title: string; aside: { title: string; body: string; cta?: { label: string; href: string } }; items: FaqItem[] } = {
  eyebrow: "Hosting basics",
  title: "Questions we are asked most",
  aside: {
    title: "Not sure what you need?",
    body: "Tell us about your site and your traffic and we will recommend a plan. If a plan is not the right fit, we will say so.",
    cta: { label: "Talk to our team", href: "/contact" },
  },
  items: [
    {
      question: "What is managed WordPress hosting?",
      answer:
        "Managed WordPress hosting means the host looks after the server layer: software updates, caching configuration, security hardening and backups. You manage your content, themes and plugins.",
    },
    {
      question: "Do I need technical skills to use DronaHost?",
      answer:
        "No. You can run a site from the dashboard, and our support team can help with migrations and common issues. Developers who want more control can move up to VPS hosting.",
    },
    {
      question: "Can I move my existing website to DronaHost?",
      answer:
        "Yes. Share your current host details and we will copy your site across, then let you review it before you point your domain. Your existing site stays live until you switch.",
    },
    {
      question: "How do I choose between WordPress, VPS and cloud hosting?",
      answer:
        "Choose managed WordPress hosting if you run WordPress and want the server handled for you. Choose VPS or cloud hosting if you need more control over resources or want to run other software.",
    },
  ],
};

export const HOME_CTA = {
  eyebrow: "Get started",
  title: "Ready to move your site?",
  description: "Pick a plan, or tell us about your site and we will recommend one.",
  primaryCta: { label: "View plans", href: "/pricing" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
} as const;
