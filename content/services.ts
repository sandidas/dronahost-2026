/**
 * Service page copy (VPS, cloud, business hosting, domains, web design, growth).
 *
 * TODO: replace with verified data. Draft copy that says what each service is and how to
 * start, without prices, specs, benchmarks, SLAs or guarantees. Quote specifics only after
 * they are confirmed in content/claims.ts or data/pricing.json.
 */
import type { FaqItem } from "@/components/sections/FAQSection";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import type { HeroBaseProps } from "@/components/sections/hero/types";

type HeroCopy = Omit<HeroBaseProps, "headingLevel" | "className">;

export type ServiceContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  /** Used for Service JSON-LD. */
  schemaName: string;
  schemaDescription: string;
  hero: HeroCopy;
  features: {
    eyebrow: string;
    title: string;
    description: string;
    items: { icon: FeatureIconName; title: string; description: string }[];
  };
  faq: FaqItem[];
};

const CONTACT = { label: "Talk to our team", href: "/contact" };

export const SERVICES: Record<string, ServiceContent> = {
  "vps-hosting": {
    slug: "vps-hosting",
    metaTitle: "VPS Hosting",
    metaDescription: "Virtual private servers for applications, stores and teams that need dedicated resources and more control than shared hosting.",
    schemaName: "VPS hosting",
    schemaDescription: "Virtual private servers with dedicated resources for applications and teams.",
    hero: {
      eyebrow: "VPS hosting",
      title: "Dedicated resources,",
      titleAccent: "more control",
      description: "A virtual private server gives your application a reserved share of a physical server, for workloads that outgrow shared or managed WordPress hosting.",
      primaryCta: CONTACT,
      secondaryCta: { label: "Compare hosting types", href: "/pricing" },
    },
    features: {
      eyebrow: "Who it is for",
      title: "When a VPS is the right fit",
      description: "Choose a VPS when you need more than a managed WordPress plan provides.",
      items: [
        { icon: "server", title: "Dedicated resources", description: "Compute and memory reserved for your workload instead of shared with other accounts." },
        { icon: "code", title: "Custom software", description: "Run applications, services and stacks that managed WordPress hosting does not support." },
        { icon: "trending-up", title: "Room to scale", description: "Start with the resources you need and move to a larger server as demand grows." },
        { icon: "life-buoy", title: "Help from people", description: "Talk to the team about sizing and setup before you commit." },
      ],
    },
    faq: [
      { question: "What is a VPS?", answer: "A virtual private server is a slice of a physical server that is reserved for you, with its own operating system and resources." },
      { question: "How do I choose a size?", answer: "Tell us what you plan to run and the traffic you expect, and we will recommend a starting size. You can move up later." },
      { question: "Is VPS hosting managed?", answer: "Scope varies by setup. Contact the team to agree what we look after and what you manage yourself." },
    ],
  },
  "cloud-hosting": {
    slug: "cloud-hosting",
    metaTitle: "Cloud Hosting",
    metaDescription: "Flexible cloud hosting for sites and applications whose traffic changes over time and that need to grow without migrating.",
    schemaName: "Cloud hosting",
    schemaDescription: "Flexible cloud hosting for sites and applications that need to scale.",
    hero: {
      eyebrow: "Cloud hosting",
      title: "Hosting that can",
      titleAccent: "grow with you",
      description: "Cloud hosting suits sites and applications whose needs change over time, so you can add capacity without moving to a new provider.",
      primaryCta: CONTACT,
      secondaryCta: { label: "Compare hosting types", href: "/pricing" },
    },
    features: {
      eyebrow: "Why cloud",
      title: "Built for changing demand",
      description: "Cloud hosting is a good fit when you cannot predict traffic or expect to grow quickly.",
      items: [
        { icon: "cloud", title: "Flexible capacity", description: "Add resources as demand grows rather than guessing a size up front." },
        { icon: "refresh-cw", title: "Migration support", description: "We help you move from your current host and review the result with you before you switch." },
        { icon: "shield-check", title: "Security built in", description: "Firewall rules and monitoring are part of the platform. See our security practices." },
        { icon: "life-buoy", title: "A team to ask", description: "Talk to us about sizing, setup and what to expect before you start." },
      ],
    },
    faq: [
      { question: "How is cloud hosting different from managed WordPress hosting?", answer: "Managed WordPress hosting is tuned for WordPress and handles the stack for you. Cloud hosting gives more flexibility in how resources are allocated and what you run." },
      { question: "Can I start on managed WordPress and move to cloud later?", answer: "Yes. Many sites start on a managed plan and move when their needs change. We help with the move." },
      { question: "Where are the servers?", answer: "Hosting regions are listed on our regional pages. Ask the team which region suits your audience." },
    ],
  },
  "business-hosting": {
    slug: "business-hosting",
    metaTitle: "Business Hosting with a cPanel Dashboard",
    metaDescription: "Web hosting with a cPanel dashboard for any kind of site. You manage the site and we run the hosting account. Email is not included.",
    schemaName: "Business hosting",
    schemaDescription: "Web hosting with a cPanel dashboard for any kind of site. Email is not included.",
    hero: {
      eyebrow: "Business hosting",
      title: "Web hosting with a cPanel dashboard,",
      titleAccent: "for any kind of site",
      description: "Host your website and manage it from a cPanel dashboard. You manage the site. We run the hosting account.",
      primaryCta: CONTACT,
      secondaryCta: { label: "See business hosting plans", href: "/pricing" },
    },
    features: {
      eyebrow: "What it covers",
      title: "The hosting basics for a business site",
      description: "Business hosting is for small teams that want their website and domain in one account, managed from a familiar dashboard.",
      items: [
        { icon: "globe", title: "Your own domain", description: "Register or transfer a domain and keep everything in one account." },
        { icon: "layers", title: "You manage the site. We run the hosting account.", description: "You look after your site, its updates and its content in cPanel. We keep the hosting account running." },
        { icon: "life-buoy", title: "Setup help", description: "Tell us what you have today and we will help you move it." },
      ],
    },
    faq: [
      { question: "Can I use my existing domain?", answer: "Yes. You can keep a domain you already own and point it to DronaHost, or transfer it to us." },
      { question: "Is email included?", answer: "No. Email is not included with any hosting plan. Email is a separate service, so you add it only if you need it. Ask the team about email for your domain." },
      { question: "Can you move my current site?", answer: "Yes. Tell us where it lives today and we will plan the move with you. Your email stays with your email provider." },
    ],
  },
  domains: {
    slug: "domains",
    metaTitle: "Domain Registration and Transfers",
    metaDescription: "Register a domain name or transfer one you own, with help from the DronaHost team.",
    schemaName: "Domain registration",
    schemaDescription: "Domain registration and transfers handled by the DronaHost team.",
    hero: {
      eyebrow: "Domains",
      title: "Register or transfer",
      titleAccent: "your domain",
      description: "Tell us the name you want, or the domain you already own, and we will handle registration or transfer and point it to your hosting.",
      primaryCta: CONTACT,
      secondaryCta: { label: "See hosting plans", href: "/pricing" },
    },
    features: {
      eyebrow: "How it works",
      title: "Domains without the guesswork",
      description: "Online domain search is coming. Until then, the team can check availability and register for you.",
      items: [
        { icon: "search", title: "Availability check", description: "Send us the names you are considering and we will check them." },
        { icon: "globe", title: "Registration and transfer", description: "Register a new domain or move one from another registrar." },
        { icon: "lock", title: "WHOIS privacy", description: "Ask us about WHOIS privacy for your registration." },
        { icon: "layers", title: "Connected to hosting", description: "We point the domain to your site so it works from day one." },
      ],
    },
    faq: [
      { question: "Which domain extensions can you register?", answer: "Ask the team about the extension you want, including country extensions such as .co.uk, .de, .fr, .nl, .eu and .ae." },
      { question: "Can I transfer a domain I own?", answer: "Yes. We guide you through unlocking the domain and approving the transfer." },
      { question: "What does registration cost?", answer: "Pricing depends on the extension. The team will quote the full price, including any registry fees, before you commit." },
    ],
  },
  "web-design": {
    slug: "web-design",
    metaTitle: "Web Design and Development",
    metaDescription: "WordPress, React and Next.js websites scoped around what your business needs the site to do.",
    schemaName: "Web design and development",
    schemaDescription: "WordPress, React and Next.js website design and development.",
    hero: {
      eyebrow: "Web design",
      title: "Websites built around",
      titleAccent: "what they need to do",
      description: "We design and build WordPress and custom sites, from a clear brief to launch, and keep them running on hosting we manage.",
      primaryCta: CONTACT,
      secondaryCta: { label: "See SEO services", href: "/seo-services" },
    },
    features: {
      eyebrow: "What we build",
      title: "From brochure sites to custom applications",
      description: "Every project starts with a conversation about your audience and goals.",
      items: [
        { icon: "palette", title: "Website design", description: "Clear, fast designs on WordPress or a custom stack." },
        { icon: "code", title: "Custom development", description: "React and Next.js solutions for products that outgrow a template." },
        { icon: "layers", title: "WordPress builds", description: "Themes and editing experiences your team can manage themselves." },
        { icon: "search", title: "Built for search", description: "Semantic markup, speed and structured data from the start." },
      ],
    },
    faq: [
      { question: "How does a project start?", answer: "With a conversation about your goals, audience and timeline. We then propose a scope and a plan you can approve." },
      { question: "Can you work with our existing site?", answer: "Yes. We can redesign, extend or fix an existing WordPress site as well as build new." },
      { question: "Who hosts the finished site?", answer: "You choose. We can host it for you, or hand it over to your own hosting." },
    ],
  },
  "growth-services": {
    slug: "growth-services",
    metaTitle: "Growth Services",
    metaDescription: "Support for sites that are ready to grow: integrations, conversion work and ongoing improvement.",
    schemaName: "Growth services",
    schemaDescription: "Integrations, conversion work and ongoing improvement for growing sites.",
    hero: {
      eyebrow: "Growth services",
      title: "Support for sites that are",
      titleAccent: "ready to grow",
      description: "Once the basics are in place, we help connect your tools, improve how visitors become customers, and keep making the site better.",
      primaryCta: CONTACT,
      secondaryCta: { label: "See SEO services", href: "/seo-services" },
    },
    features: {
      eyebrow: "What we help with",
      title: "Practical improvements, step by step",
      description: "Growth work is scoped to your goals, not sold as a bundle.",
      items: [
        { icon: "git-branch", title: "Integrations", description: "Connect your site to the analytics, CRM and marketing tools you already use." },
        { icon: "trending-up", title: "Conversion work", description: "Find and fix the places where visitors drop out." },
        { icon: "gauge", title: "Performance", description: "Speed improvements that make the site faster for visitors." },
        { icon: "activity", title: "Ongoing improvement", description: "Regular reviews and a short list of changes worth making next." },
      ],
    },
    faq: [
      { question: "Do I need to host with DronaHost?", answer: "No, although hosting and growth work are easiest to coordinate in one place." },
      { question: "How is this priced?", answer: "Work is scoped per project or retainer. Contact the team and we will propose a scope." },
      { question: "Can you start with a review?", answer: "Yes. A short review of your site is a good first step and tells us where effort is best spent." },
    ],
  },
};

/* ── Regional hosting pages (/hosting/[region]) ─────────────────────────────────
 * Claim-free: no latency figures, prices, server locations or data-center commitments.
 * Pages speak to businesses serving each audience. TODO: replace with verified data. */
export const REGION_FAQ = (label: string, regimes: string): FaqItem[] => [
  { question: `Can I host a site for ${label} visitors with DronaHost?`, answer: "Yes. Tell the team about your site and your visitors and we will suggest the plan that fits." },
  { question: "Which data protection rules apply to my business?", answer: `Businesses serving ${label} visitors often need to consider ${regimes}. A qualified adviser can tell you what applies to your business.` },
  { question: "Where can I read how you handle personal data?", answer: "Our privacy policy and data processing pages explain how DronaHost handles personal data, and the team can answer specific questions." },
];
