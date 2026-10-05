/**
 * Homepage draft copy.
 *
 * TODO: replace with verified data. This is DRAFT copy ported from
 * docs/pages/home.md with every unconfirmed number, guarantee, benchmark,
 * comparison and review score removed. Add figures back only through
 * `content/claims.ts` once the claim is verified.
 *
 * Voice: calm, specific, no hype (docs/rules/content-writing-rules.md).
 * The navbar still lives in data/home.json because the header imports it.
 */
import base from "@/data/home.json";

const cta = (label: string, link: string, variant: "primary" | "secondary" = "primary") => ({
  label,
  variant,
  link,
});

const check = (text: string) => ({ text, icon: "check" });

const hero = {
  title1: "Managed WordPress and cloud hosting ",
  title2: "for growing businesses",
  description:
    "DronaHost runs managed WordPress, VPS and cloud hosting on LiteSpeed servers. We migrate your existing site, and you can reach the team by ticket, live chat or WhatsApp.",
  background: { src: "/images/home/Background.svg", alt: "" },
  buttons: [cta("View plans", "/pricing"), cta("Talk to our team", "/contact", "secondary")],
  // Member counts are unverified, so the social-proof row is omitted until confirmed.
  heroImage: { src: "/images/home/ManWithLaptop.svg", alt: "Person working on a laptop" },
  floatingCards: [
    {
      title: "LiteSpeed servers",
      description: "Server-level caching configured for WordPress.",
      position: "top-left",
    },
    {
      title: "Human support",
      description: "Ticket, live chat or WhatsApp, whichever suits you.",
      position: "middle-left",
    },
    {
      title: "Free migration",
      description: "We move your existing site across for you.",
      position: "bottom-left",
    },
  ],
  decorations: { backgroundBlur: true, gradientOverlay: true, curvedLines: true },
};

const features = {
  tagline: "Why DronaHost",
  title: "Hosting that stays out of your way",
  features: [
    {
      id: 1,
      title: "Tuned for WordPress",
      description:
        "LiteSpeed servers with built-in page caching, configured for WordPress so you do not have to maintain a stack of caching plugins.",
      image: "/images/BoxyLayout1.svg",
      icon: "/icons/analytics.svg",
      badge: null,
      progress: null,
      list: null,
      cta: { label: "Explore WordPress hosting", link: "/wordpress-hosting" },
    },
    {
      id: 2,
      title: "Room to grow",
      description:
        "Start on a managed plan and move to VPS or cloud hosting when your traffic or requirements change, without changing provider.",
      image: "/images/BoxyLayout2.svg",
      icon: "/icons/grid.svg",
      badge: null,
      progress: null,
      list: null,
      cta: { label: "Compare hosting types", link: "/cloud-hosting" },
    },
    {
      id: 3,
      title: "Safe to change",
      description:
        "Staging environments and restore points let you test updates and undo mistakes before your visitors notice.",
      image: "/images/BoxyLayout3.svg",
      icon: "/icons/grid.svg",
      badge: null,
      progress: null,
      list: null,
      cta: { label: "How we protect sites", link: "/security" },
    },
  ],
};

const services = {
  tagline: "What we offer",
  title: "Hosting and web services under one roof",
  description:
    "From a single WordPress site to a cloud server, plus the design, SEO and development work that goes with it.",
  services: [
    {
      id: 1,
      title: "Managed WordPress hosting",
      description: "Updates, caching, backups and security handled at the server level so you can focus on your site.",
      icon: "/icons/clickIcon.svg",
      cta: { label: "See WordPress hosting", link: "/wordpress-hosting" },
    },
    {
      id: 2,
      title: "VPS and cloud hosting",
      description: "Root access and dedicated resources for applications, stores and teams that need more control.",
      icon: "/icons/clickIcon.svg",
      cta: { label: "See VPS hosting", link: "/vps-hosting" },
    },
    {
      id: 3,
      title: "Web design and development",
      description: "WordPress, React and Next.js builds scoped around what your business needs the site to do.",
      icon: "/icons/clickIcon.svg",
      cta: { label: "See web design", link: "/web-design" },
    },
    {
      id: 4,
      title: "SEO services",
      description: "Retainer-based search work with plain reporting, covering technical fixes, content and links.",
      icon: "/icons/clickIcon.svg",
      cta: { label: "See SEO services", link: "/seo-services" },
    },
  ],
  layout: {"columns": 4, "showDividers": true, "alignment": "center"},
};

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

const feature = (tagline: string, title: string, description: string, features: string[], buttons: ReturnType<typeof cta>[]) => ({
  tagline,
  title,
  description,
  features: features.map(check),
  buttons,
});

const managedHosting = {
  ...feature(
    "Managed WordPress hosting",
    "WordPress hosting that is looked after for you",
    "We configure, update and monitor the server stack so your time goes into the site itself.",
    [
      "LiteSpeed web servers with server-level caching",
      "Staging environments to test updates before they go live",
      "SSL certificates on every site",
    ],
    [cta("View plans", "/pricing"), cta("Talk to our team", "/contact", "secondary")],
  ),
  image: { src: "/images/home/pricingSection1.svg", alt: "" },
};

const managedMigration = {
  ...feature(
    "Free migration",
    "Move your site without losing a weekend",
    "Tell us where your site lives today. We copy it across and let you review the result before you switch your domain.",
    [
      "We copy your files and database",
      "You check the new site before DNS changes",
      "Your current host stays live until you switch",
    ],
    [cta("Start a migration", "/contact"), cta("View plans", "/pricing", "secondary")],
  ),
  illustration: { src: "/images/home/pricingSection2.svg", alt: "" },
};

const managedSecurity = {
  ...feature(
    "Security and backups",
    "Protection that runs in the background",
    "Security and recovery are part of the platform, not extra products to remember to buy.",
    [
      "Automatic backups you can restore from",
      "Malware scanning and firewall rules",
      "SSL certificates that renew on their own",
    ],
    [cta("Read our security practices", "/security"), cta("See the SLA", "/sla", "secondary")],
  ),
  illustration: { src: "/images/home/pricingSection3.svg", alt: "" },
};

const managedSupport = {
  ...feature(
    "Support",
    "Real people, through the channel you prefer",
    "Open a ticket, start a live chat or message us on WhatsApp. You reach the team that runs your server.",
    [
      "Ticket, live chat and WhatsApp",
      "Plain-English answers with clear next steps",
      "Escalation to engineers when a problem needs one",
    ],
    [cta("Contact support", "/contact"), cta("Read the blog", "/blog", "secondary")],
  ),
  illustration: { src: "/images/home/pricingSection4.svg", alt: "" },
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
  heroSection: hero,
  featuresSection: features,
  servicesSection: services,
  caseStudySection: caseStudy,
  ctaSection,
  managedHostingSection: managedHosting,
  managedHostingIllustrationSection: managedMigration,
  managedHostingAbstractSection: managedSecurity,
  managedHostingUISection: managedSupport,
  faqSection: faq,
  testimonialsSection: testimonials,
  trustSection: trust,
};

export type HomeData = typeof homeData;
