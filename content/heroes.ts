/**
 * Hero copy for pages that use ProductHero, SplitHero or CenteredHero.
 *
 * TODO: replace with verified data. Draft copy only: no unconfirmed numbers,
 * guarantees, awards, customer counts or benchmarks. Highlights must stay factual
 * descriptions of what the product is; verify each before launch.
 */
import type { HeroBaseProps } from "@/components/sections/hero/types";
import { isVerified } from "./claims";

type HeroCopy = Omit<HeroBaseProps, "headingLevel" | "className">;

/** Joins phrases as "a, b and c". */
const joinList = (parts: readonly string[]): string =>
  parts.length <= 1 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

/** Each phrase shows only while its claim renders (content/claims.ts). */
const WORDPRESS_PARTS: readonly { text: string; claim?: string }[] = [
  { text: "LiteSpeed servers with built-in caching", claim: "litespeed" },
  { text: "a staging area for testing updates", claim: "staging-plans" },
  { text: "automatic backups", claim: "backups" },
  { text: "a team that moves your existing site across", claim: "free-migration" },
  { text: "help by support ticket" },
];
const wordpressParts = WORDPRESS_PARTS.filter((p) => !p.claim || isVerified(p.claim)).map((p) => p.text);
const wordpressDescription = joinList(wordpressParts);

export const HOME_HERO: HeroCopy = {
  eyebrow: "Managed WordPress hosting",
  title: "Managed WordPress hosting for",
  titleAccent: "growing businesses",
  description: `DronaHost offers managed WordPress hosting with ${wordpressDescription}.`,
  primaryCta: { label: "See WordPress hosting plans", href: "/pricing" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
  highlights: [
    { text: "LiteSpeed servers with server-level caching", claim: "litespeed" },
    { text: "Free migration from your current host", claim: "free-migration" },
    { text: "Help from the team by support ticket" },
  ]
    .filter((h) => !h.claim || isVerified(h.claim))
    .map((h) => h.text),
};

export const WORDPRESS_HERO: HeroCopy = {
  eyebrow: "Managed WordPress hosting",
  title: "WordPress hosting,",
  titleAccent: "managed for you.",
  description: `${wordpressDescription.charAt(0).toUpperCase()}${wordpressDescription.slice(1)}.`,
  primaryCta: { label: "See WordPress hosting plans", href: "/pricing" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
};

export const ABOUT_HERO: HeroCopy = {
  eyebrow: "About DronaHost",
  title: "The company that runs",
  titleAccent: "your hosting",
  description:
    "DronaHost is a managed WordPress hosting and web services company based in India, working with businesses in the United States, the United Kingdom, the United Arab Emirates and Europe.",
  primaryCta: { label: "Talk to our team", href: "/contact" },
  secondaryCta: { label: "See hosting plans", href: "/pricing" },
};

export const SEO_HERO: HeroCopy = {
  eyebrow: "SEO services",
  title: "SEO that comes with a",
  titleAccent: "report you can read",
  description:
    "Technical fixes, content and link work on a monthly retainer, with reporting that explains what changed and why.",
  primaryCta: { label: "Talk to our team", href: "/contact" },
  secondaryCta: { label: "See web design", href: "/wordpress-website-design" },
};

export const PRICING_HERO: HeroCopy = {
  eyebrow: "Pricing",
  title: "Plans for every stage of",
  titleAccent: "your site",
  description:
    "Choose a hosting plan and compare what each one includes. Not sure which fits? Ask the team and we will recommend one.",
};
