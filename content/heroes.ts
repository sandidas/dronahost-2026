/**
 * Hero copy for pages that use ProductHero, SplitHero or CenteredHero.
 *
 * TODO: replace with verified data. Draft copy only: no unconfirmed numbers,
 * guarantees, awards, customer counts or benchmarks. Highlights must stay factual
 * descriptions of what the product is; verify each before launch.
 */
import type { HeroBaseProps } from "@/components/sections/hero/types";

type HeroCopy = Omit<HeroBaseProps, "headingLevel" | "className">;

export const HOME_HERO: HeroCopy = {
  eyebrow: "WordPress, cloud and VPS hosting",
  title: "Managed WordPress hosting for",
  titleAccent: "growing businesses",
  description:
    "DronaHost runs managed WordPress, cloud and VPS hosting on LiteSpeed servers. We migrate your existing site, and you can reach the team by ticket, live chat or WhatsApp.",
  primaryCta: { label: "View plans", href: "/pricing" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
  highlights: [
    "LiteSpeed servers with server-level caching",
    "Free migration from your current host",
    "Support by ticket, live chat and WhatsApp",
  ],
};

export const WORDPRESS_HERO: HeroCopy = {
  eyebrow: "Managed WordPress hosting",
  title: "WordPress hosting,",
  titleAccent: "managed for you.",
  description:
    "LiteSpeed servers with built-in caching, a staging area for testing updates, and a team that moves your existing site across.",
  primaryCta: { label: "View plans", href: "/pricing" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
};

export const ABOUT_HERO: HeroCopy = {
  eyebrow: "About DronaHost",
  title: "A focused team that runs",
  titleAccent: "your hosting",
  description:
    "DronaHost is a hosting and web team based in India, working with businesses in the United States, the United Kingdom, the United Arab Emirates and Europe.",
  primaryCta: { label: "Talk to our team", href: "/contact" },
  secondaryCta: { label: "View plans", href: "/pricing" },
};

export const SEO_HERO: HeroCopy = {
  eyebrow: "SEO services",
  title: "SEO that comes with a",
  titleAccent: "report you can read",
  description:
    "Technical fixes, content and link work on a monthly retainer, with reporting that explains what changed and why.",
  primaryCta: { label: "Talk to our team", href: "/contact" },
  secondaryCta: { label: "See web design", href: "/web-design" },
};

export const PRICING_HERO: HeroCopy = {
  eyebrow: "Pricing",
  title: "Plans for every stage of",
  titleAccent: "your site",
  description:
    "Choose a managed hosting plan. Prices are listed in US dollars, with the renewal price shown next to the signup price.",
  primaryCta: { label: "Talk to our team", href: "/contact" },
};
