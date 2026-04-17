import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "hostinger",
  name: "Hostinger",
  tagline: "DronaHost vs Hostinger — Budget Hosting Compared",
  intro:
    "Hostinger is the dominant budget hosting provider, known for aggressive promotional pricing. DronaHost competes directly with Hostinger on price while offering UK and UAE data centres that Hostinger lacks. This comparison covers pricing, performance, regional availability, and support to help budget-conscious buyers decide.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$1.99/mo (4-year plan)", winner: "dronahost" },
    { feature: "Renewal Price", dronahost: "$2.99/mo", competitor: "$9.99/mo", winner: "dronahost" },
    { feature: "Free SSL", dronahost: "Yes — wildcard", competitor: "Yes — single domain", winner: "dronahost" },
    { feature: "UK Data Centre", dronahost: "Yes — London", competitor: "No", winner: "dronahost" },
    { feature: "UAE Data Centre", dronahost: "Yes — Dubai", competitor: "No", winner: "dronahost" },
    { feature: "Daily Backups", dronahost: "Yes", competitor: "Weekly only on basic", winner: "dronahost" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 live chat", winner: "tie" },
    { feature: "Uptime SLA", dronahost: "99.9%", competitor: "99.9%", winner: "tie" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "Lower introductory AND renewal pricing — no long-term lock-in required for the best price",
    "UK and UAE data centres for compliance-sensitive businesses",
    "Daily backups on all plans — not weekly",
    "Wildcard SSL vs single-domain SSL",
  ],
  competitorPros: [
    "Very large global customer base and established brand",
    "AI-powered website builder included",
    "More hosting plan tiers for ultra-budget needs",
  ],
  verdict:
    "Hostinger is the budget host most people encounter first, but DronaHost beats it on renewal pricing, data centre coverage, and backup frequency. If you need UK or UAE data residency, DronaHost is the only choice between the two. Hostinger is a reasonable option if you commit to a 4-year plan and are in a region it covers, but DronaHost offers better value without the long-term lock-in.",
  datePublished: "2025-01-15",
};

export default data;
