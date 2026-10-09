/**
 * /wordpress-hosting page copy.
 *
 * TODO: replace with verified data. Draft copy: describes what the product is, without
 * unconfirmed numbers, benchmarks or guarantees.
 */
import type { FeatureIconName } from "@/components/ui/FeatureIcon";

export const WORDPRESS_FEATURES: {
  eyebrow: string;
  title: string;
  description: string;
  items: { icon: FeatureIconName; title: string; description: string }[];
} = {
  eyebrow: "What you get",
  title: "The server work, done for you",
  description: "Every managed WordPress plan comes with the same foundations, so you can start small and grow without re-platforming.",
  items: [
    { icon: "zap", title: "LiteSpeed web servers", description: "A web server built for WordPress, with page caching configured at the server level." },
    { icon: "git-branch", title: "Staging environments", description: "Test plugin, theme and code changes on a private copy before they reach your live site." },
    { icon: "refresh-cw", title: "Free migration", description: "We copy your existing site across and let you review it before you switch your domain." },
    { icon: "lock", title: "SSL certificates", description: "Certificates are issued and renewed for you, so visitors always see the secure padlock." },
    { icon: "database", title: "Backups", description: "Automatic backups with restore points, so a bad update is a quick rollback." },
    { icon: "shield-check", title: "Security monitoring", description: "Malware scanning and firewall rules run in the background, with network-level DDoS protection." },
  ],
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
    "Managed WordPress hosting means a team looks after the technical side of your site, so you can focus on running your business. With DronaHost you get a backup of your site every day, a free move of your existing site, and help by support ticket or email. You keep control of your content, your plugins and themes, your domain and your decisions.",
  answerClaims: ["backups", "free-migration"],
  weLookAfter: [
    { text: "Backups of your site", claim: "backups" },
    { text: "Moving your existing site across, free of charge", claim: "free-migration" },
    { text: "Answering when something goes wrong" },
  ],
  youKeep: [{ text: "Your content, products and pages" }, { text: "Which plugins and themes you choose" }, { text: "Your domain and your accounts" }, { text: "Your business decisions" }],
} as const;
