import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "a2-hosting",
  name: "A2 Hosting",
  tagline: "DronaHost vs A2 Hosting — Speed-Focused Hosting Compared",
  intro:
    "A2 Hosting markets itself heavily on speed, with its 'Turbo' plans using LiteSpeed servers. DronaHost also uses LiteSpeed with NVMe SSD across all plans — not just premium tiers. This comparison looks at whether A2 Hosting's speed claims hold up when you compare infrastructure, pricing, and regional coverage.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$2.99/mo", winner: "dronahost" },
    { feature: "Renewal Price", dronahost: "$2.99/mo", competitor: "$11.99/mo", winner: "dronahost" },
    { feature: "LiteSpeed Server", dronahost: "All plans", competitor: "Turbo plans only ($11.99+)", winner: "dronahost" },
    { feature: "Free SSL", dronahost: "Yes — wildcard", competitor: "Yes", winner: "dronahost" },
    { feature: "Daily Backups", dronahost: "Yes", competitor: "Yes", winner: "tie" },
    { feature: "UK Data Centre", dronahost: "Yes — London", competitor: "No (US + EU only)", winner: "dronahost" },
    { feature: "UAE Data Centre", dronahost: "Yes — Dubai", competitor: "No", winner: "dronahost" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 phone + chat", winner: "competitor" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "LiteSpeed on all plans — A2 charges $11.99+/mo for the same server technology",
    "UK and UAE data centre coverage",
    "Significantly lower renewal pricing",
    "Wildcard SSL included",
  ],
  competitorPros: [
    "Phone support available 24/7",
    "Anytime money-back guarantee (vs standard 30-day)",
    "Developer-friendly features on Turbo plans",
  ],
  verdict:
    "A2 Hosting's main selling point — LiteSpeed servers — is available on DronaHost's base plans for a fraction of the cost. If you are comparing on pure speed infrastructure, DronaHost delivers equivalent performance at a lower price. A2 Hosting wins on support accessibility (phone) and their anytime money-back policy. For UK and UAE businesses, DronaHost is the clear choice for regional data residency.",
  datePublished: "2025-01-15",
};

export default data;
