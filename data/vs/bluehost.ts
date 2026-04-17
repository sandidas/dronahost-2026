import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "bluehost",
  name: "Bluehost",
  tagline: "DronaHost vs Bluehost — Which Shared Host Is Worth Your Money?",
  intro:
    "Bluehost is one of the most heavily marketed shared hosting providers, officially recommended by WordPress.org. However, it is owned by EIG (Endurance International Group) and has faced criticism for performance and renewal pricing. DronaHost is a modern alternative with NVMe SSD storage, competitive renewal rates, and data centres in the UK and UAE.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$2.95/mo", winner: "dronahost" },
    { feature: "Renewal Price", dronahost: "$2.99/mo", competitor: "$10.99/mo", winner: "dronahost" },
    { feature: "Free Domain", dronahost: "No", competitor: "Year 1 only", winner: "competitor" },
    { feature: "Free SSL", dronahost: "Yes — wildcard", competitor: "Yes — basic", winner: "dronahost" },
    { feature: "Storage Type", dronahost: "NVMe SSD", competitor: "HDD (standard tier)", winner: "dronahost" },
    { feature: "Daily Backups", dronahost: "Yes", competitor: "Paid add-on", winner: "dronahost" },
    { feature: "Uptime SLA", dronahost: "99.9%", competitor: "No published SLA", winner: "dronahost" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 phone + chat", winner: "competitor" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "NVMe SSD storage vs HDD on Bluehost's standard tier — significantly faster",
    "Transparent renewal pricing — no shock renewal bills",
    "Daily backups included, not sold as an add-on",
    "99.9% uptime SLA with financial credits",
  ],
  competitorPros: [
    "Free domain for year one",
    "Phone support available 24/7",
    "Officially recommended by WordPress.org",
  ],
  verdict:
    "Bluehost's first-year pricing looks attractive but renewal rates are 3-4× higher. Combined with HDD storage and backups sold as paid add-ons, the total cost of ownership is higher than it first appears. DronaHost offers better long-term value with NVMe SSD, included backups, and predictable pricing. The only reason to choose Bluehost is if a free first-year domain is your top priority.",
  datePublished: "2025-01-15",
};

export default data;
