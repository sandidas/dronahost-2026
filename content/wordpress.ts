/**
 * /wordpress-hosting page copy.
 *
 * TODO: replace with verified data. Draft copy: describes what the product is, without
 * unconfirmed numbers, benchmarks or guarantees.
 */
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { isVerified } from "./claims";

type FeatureItem = { icon: FeatureIconName; title: string; description: string };

/** Each tile shows only while its claim renders (content/claims.ts). Tiles with no claim behind them are not listed. */
const FEATURE_ITEMS: readonly (FeatureItem & { claim: string })[] = [
  { claim: "litespeed", icon: "zap", title: "LiteSpeed web servers", description: "A web server built for WordPress, with page caching configured at the server level." },
  { claim: "staging-plans", icon: "git-branch", title: "Staging environments", description: "Test plugin, theme and code changes on a private copy before they reach your live site." },
  { claim: "free-migration", icon: "refresh-cw", title: "Free migration", description: "We move your existing site to DronaHost free of charge. The migration terms set out what is covered." },
  { claim: "free-ssl", icon: "lock", title: "SSL certificates", description: "Certificates are issued and renewed for you, so visitors see the secure padlock." },
  { claim: "backups", icon: "database", title: "Backups", description: "Your site is backed up automatically. The backup policy explains how restores work." },
  { claim: "malware-scanning", icon: "shield-check", title: "Malware scanning", description: "Malware scanning runs in the background on your site." },
];

export const WORDPRESS_FEATURES: {
  eyebrow: string;
  title: string;
  description: string;
  items: FeatureItem[];
} = {
  eyebrow: "What you get",
  title: "The server work, done for you",
  description: "Every managed WordPress plan comes with the same foundations, so you can start small and grow without changing host.",
  items: FEATURE_ITEMS.filter((i) => isVerified(i.claim)).map(({ icon, title, description }) => ({ icon, title, description })),
};

export const WORDPRESS_PRICING = {
  title: "Plans for WordPress hosting",
  description: "Pick the plan that matches your sites and traffic. You can move up as you grow.",
};

/**
 * "What does managed WordPress hosting mean?" The long version, moved here from the home page (conversion review, 2026-10-09).
 * The answer states only what the approved policy pages state, and it shows only while those claims render. Each line shows
 * only while its own claim renders.
 */
export const WORDPRESS_MEANING = {
  title: "What does managed WordPress hosting mean?",
  answer:
    "Managed WordPress hosting means the server work sits with us, as set out in our policies, so you can focus on running your business. With DronaHost you get a backup of your site every day, a free move of your existing site, and help by support ticket or email. You keep control of your content, your plugins and themes, your domain and your decisions.",
  answerClaims: ["backups", "free-migration"],
  weLookAfter: [
    { text: "Backups of your site", claim: "backups" },
    { text: "Moving your existing site across, free of charge", claim: "free-migration" },
    { text: "Answering when something goes wrong" },
  ],
  youKeep: [{ text: "Your content, products and pages" }, { text: "Which plugins and themes you choose" }, { text: "Your domain and your accounts" }, { text: "Your business decisions" }],
} as const;
