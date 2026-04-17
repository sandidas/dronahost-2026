import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "siteground",
  name: "SiteGround",
  tagline: "DronaHost vs SiteGround — Which Host Is Better in 2025?",
  intro:
    "SiteGround is one of the most recognised shared hosting providers, known for its customer support and WordPress tools. DronaHost is a newer managed hosting provider targeting US, UK, and UAE markets with competitive pricing and modern infrastructure. In this comparison we look at pricing, performance, support, and value to help you decide which is right for your project.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$2.99/mo", winner: "dronahost" },
    { feature: "Renewal Price", dronahost: "$2.99/mo", competitor: "$14.99/mo", winner: "dronahost" },
    { feature: "Free SSL", dronahost: "Yes — wildcard", competitor: "Yes — single domain", winner: "dronahost" },
    { feature: "Free Migration", dronahost: "Yes — unlimited", competitor: "Yes — 1 site", winner: "dronahost" },
    { feature: "Daily Backups", dronahost: "Yes — 30 days", competitor: "Yes — 30 days", winner: "tie" },
    { feature: "Uptime SLA", dronahost: "99.9%", competitor: "99.9%", winner: "tie" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 live chat + phone", winner: "competitor" },
    { feature: "Datacenter Regions", dronahost: "US, UK, EU, UAE", competitor: "US, EU, Asia", winner: "dronahost" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "Significantly lower renewal pricing — no surprise bill after year one",
    "UAE and UK data centres for MENA and British markets",
    "Wildcard SSL included on all plans",
    "Unlimited site migrations included",
  ],
  competitorPros: [
    "Longer track record and larger customer base",
    "Phone support available on all plans",
    "Strong WordPress-specific tooling (SG Optimizer plugin)",
  ],
  verdict:
    "If price is your primary concern — especially renewal pricing — DronaHost offers significantly better long-term value. SiteGround's renewal rates are among the highest in the industry. DronaHost is the better choice for US, UK, and UAE businesses that need regional data residency at competitive prices. SiteGround is worth considering if phone support is a hard requirement.",
  datePublished: "2025-01-15",
};

export default data;
