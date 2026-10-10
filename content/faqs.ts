/**
 * FAQ copy for the pricing and WordPress pages.
 *
 * TODO: replace with verified data. Answers describe process and policy only where the
 * wording matches data/pricing.json; nothing here states an unconfirmed guarantee or SLA.
 */
import type { FaqItem } from "@/components/sections/FAQSection";
import { isVerified } from "@/content/claims";
import { showPrices } from "@/lib/flags";

export const PRICING_FAQ: FaqItem[] = [
  {
    question: "Are prices shown with or without tax?",
    answer:
      "Prices exclude tax. Customers in India pay GST at checkout. Customers elsewhere pay no tax.",
  },
  {
    question: "What happens to the price when my plan renews?",
    // Promise wording only while the renewal-price-same claim renders; the card wording only while prices show.
    answer: isVerified("renewal-price-same")
      ? "Your hosting price does not change when you renew. The pricing policy has the full terms."
      : showPrices()
        ? "Each plan shows its renewal price next to the signup price."
        : "Ask the team for the renewal price of any plan before you buy.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. You can move to a larger plan as your sites and traffic grow. Contact the team and we will move you across.",
  },
  {
    question: "Do you help me move my existing site?",
    answer: isVerified("migration-process")
      ? "Yes. Migration support is part of the service. We copy your site to DronaHost and let you review it before you switch your domain."
      : "Yes. Tell us where your site lives today and we will plan the move with you. The migration terms set out what is covered.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "Accepted payment methods are listed in the footer of this site once they are confirmed. If you need an invoice or a different method, ask the team.",
  },
];

/** Parts of the "what is included" answer; each shows only while its claim renders. */
const WP_INCLUDED = [
  { text: "LiteSpeed web servers with caching", claim: "litespeed" },
  { text: "SSL certificates", claim: "free-ssl" },
  { text: "automatic backups", claim: "backups" },
  { text: "malware scanning", claim: "malware-scanning" },
  { text: "free migration of your existing site", claim: "free-migration" },
].filter((p) => isVerified(p.claim)).map((p) => p.text);

const listOf = (parts: readonly string[]): string =>
  parts.length <= 1 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

// Items tied to an unverified claim (staging, migration process) are left out or reworded until the claim renders.
export const WORDPRESS_FAQ: FaqItem[] = [
  ...(WP_INCLUDED.length > 0
    ? [
        {
          question: "What does managed WordPress hosting include?",
          answer: `Plans include ${listOf(WP_INCLUDED)}. You look after your content, themes and plugins.`,
        },
      ]
    : []),
  ...(isVerified("staging-plans")
    ? [
        {
          question: "Can I test updates before they go live?",
          answer: "Yes. Plans with a staging environment let you clone your site, apply updates to the copy, review the result and then push the changes live.",
        },
      ]
    : []),
  {
    question: "How does migration work?",
    answer: isVerified("migration-process")
      ? "You tell us where your site lives today. We copy the files and database to DronaHost, you review the copy, and only then do you switch your domain. Your current site stays live until you do."
      : "Tell us where your site lives today and we will plan the move with you. The migration terms set out what is covered.",
  },
  {
    question: "Which plan should I start with?",
    answer: "Start with the plan that covers the number of sites and the storage you use today. You can move up later without changing provider.",
  },
];

export const MIGRATION_STEPS = [
  { title: "Tell us where your site lives", description: "Share your current host and the domain you want to move." },
  { title: "We copy your site", description: "We transfer your files and database to DronaHost." },
  { title: "You review the copy", description: "Check the new site on a temporary address before anything changes." },
  { title: "Switch your domain", description: "Point your domain to DronaHost. Your old site stays live until you do." },
] as const;
