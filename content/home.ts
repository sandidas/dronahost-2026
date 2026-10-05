/**
 * Homepage draft copy.
 *
 * TODO: replace with verified data. This is DRAFT copy ported from
 * docs/pages/home.md with every unconfirmed number, guarantee, benchmark,
 * comparison and review score removed. Add figures back only through
 * `content/claims.ts` once the claim is verified.
 *
 * Voice: calm, specific, no hype (docs/rules/content-writing-rules.md).
 * Hero copy lives in content/heroes.ts. The navbar still lives in data/home.json.
 */
import base from "@/data/home.json";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";

const cta = (label: string, link: string, variant: "primary" | "secondary" = "primary") => ({
  label,
  variant,
  link,
});

/** Hidden by CaseStudy until a customer-approved `sourceUrl` exists. */
const caseStudy = {
  tagline: "Case study",
  title: "",
  description: "",
  ctaPrimary: { label: "Read the case study", link: "/blog" },
  ctaSecondary: { label: "All case studies", link: "/blog" },
  stats: [] as { value: string; label: string }[],
  image: { src: "/images/home/caseStudy.svg", alt: "" },
};

const ctaSection = {
  tagline: "Get started",
  title: "Ready to move your site?",
  buttons: [
    { ...cta("View plans", "/pricing"), icon: "arrow-right" },
    cta("Talk to our team", "/contact", "secondary"),
  ],
  image: { src: "/images/home/CTA.svg", alt: "" },
  layout: {"type": "split", "imagePosition": "left", "alignment": "center"},
  style: {"background": "light", "hasBlur": false, "spacing": "large"},
};

const faq = {
  tagline: "Hosting basics",
  title: "Questions we are asked most",
  categories: [] as { label: string; active: boolean }[],
  content: {
    title: "Not sure what you need?",
    description:
      "Tell us about your site and your traffic and we will recommend a plan. If a plan is not the right fit, we will say so.",
    highlightBox: { text: "Plan details, limits and renewal terms are published on the pricing page." },
    additionalInfo: [
      "When you compare hosts, ask each one the same three questions: where the servers are, how backups work, and what renewal costs.",
      "Our team answers questions before you buy, not only after.",
    ],
  },
  faqs: [
    {
      id: 1,
      question: "What is managed WordPress hosting?",
      answer:
        "Managed WordPress hosting means the host looks after the server layer: software updates, caching configuration, security hardening and backups. You manage your content, themes and plugins.",
      isOpen: false,
    },
    {
      id: 2,
      question: "Do I need technical skills to use DronaHost?",
      answer:
        "No. You can run a site from the dashboard, and our support team can help with migrations and common issues. Developers who want more control can move up to VPS hosting.",
      isOpen: false,
    },
    {
      id: 3,
      question: "Can I move my existing website to DronaHost?",
      answer:
        "Yes. Share your current host details and we will copy your site across, then let you review it before you point your domain. Your existing site stays live until you switch.",
      isOpen: false,
    },
    {
      id: 4,
      question: "How do I choose between WordPress, VPS and cloud hosting?",
      answer:
        "Choose managed WordPress hosting if you run WordPress and want the server handled for you. Choose VPS or cloud hosting if you need root access, custom software or more control over resources.",
      isOpen: false,
    },
  ],
};

/** Empty until real, sourced testimonials exist; the component hides itself. */
const testimonials = {
  title: "What customers say",
  tabs: [] as { label: string; active: boolean }[],
  testimonials: [] as {
    id: number;
    rating: number;
    source: { platform: string; label: string; icon: string };
    content: string;
    author: { name: string; role: string; company?: string; sourceUrl?: string; avatar: string };
  }[],
};

/** Empty until customers give written permission; the component hides itself. */
const trust = {
  rating: { label: "", value: 0, platform: "", reviews: "" },
  title: { text: "Businesses that host with DronaHost", highlight: "host with DronaHost" },
  logos: [] as { name: string; src: string; verified?: boolean }[],
};

export const homeData = {
  navbar: base.navbar,
  caseStudySection: caseStudy,
  ctaSection,
  faqSection: faq,
  testimonialsSection: testimonials,
  trustSection: trust,
};

export type HomeData = typeof homeData;

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
      description: "Open a ticket, start a live chat or message us on WhatsApp. You talk to the team that runs your server.",
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
      { label: "Start a migration", href: "/contact" },
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
    title: "Real people, through the channel you prefer",
    description: "Open a ticket, start a live chat or message us on WhatsApp. You reach the team that runs your server.",
    features: [
      "Ticket, live chat and WhatsApp",
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
