/**
 * FAQ copy for the pricing and WordPress pages.
 *
 * TODO: replace with verified data. Answers describe process and policy only where the
 * wording matches data/pricing.json; nothing here states an unconfirmed guarantee or SLA.
 */
import type { FaqItem } from "@/components/sections/FAQSection";

export const PRICING_FAQ: FaqItem[] = [
  {
    question: "Are prices shown with or without tax?",
    answer:
      "Prices are shown in US dollars before sales tax. Where tax such as VAT applies it is added at checkout, based on your billing country.",
  },
  {
    question: "What happens to the price when my plan renews?",
    answer:
      "The renewal price is listed directly under the signup price on every plan, so you can see it before you buy. If a renewal price ever differs, it is stated on the plan itself.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes. You can move to a larger plan as your sites and traffic grow. Contact the team and we will move you across.",
  },
  {
    question: "Do you help me move my existing site?",
    answer:
      "Yes. Migration support is part of the service. We copy your site to DronaHost and let you review it before you switch your domain.",
  },
  {
    question: "Which payment methods do you accept?",
    answer: "Accepted payment methods are listed in the footer of this site once they are confirmed. If you need an invoice or a different method, ask the team.",
  },
];

export const WORDPRESS_FAQ: FaqItem[] = [
  {
    question: "What does managed WordPress hosting include?",
    answer:
      "The server stack is configured and maintained for you: LiteSpeed web servers, caching, SSL certificates, backups and security monitoring. You look after your content, themes and plugins.",
  },
  {
    question: "Can I test updates before they go live?",
    answer: "Yes. Plans with a staging environment let you clone your site, apply updates to the copy, review the result and then push the changes live.",
  },
  {
    question: "How does migration work?",
    answer:
      "You tell us where your site lives today. We copy the files and database to DronaHost, you review the copy, and only then do you switch your domain. Your current site stays live until you do.",
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
