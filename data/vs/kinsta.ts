import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "kinsta",
  name: "Kinsta",
  tagline: "DronaHost vs Kinsta — Premium Hosting Compared",
  intro:
    "Kinsta is a premium managed WordPress hosting provider built on Google Cloud Platform, targeting enterprise and agency clients. DronaHost offers managed hosting at significantly lower price points with comparable performance. This comparison focuses on pricing, performance tiers, and which type of business each provider serves best.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$35/mo", winner: "dronahost" },
    { feature: "Sites on Starter", dronahost: "1 site", competitor: "1 site", winner: "tie" },
    { feature: "Free SSL", dronahost: "Yes", competitor: "Yes", winner: "tie" },
    { feature: "CDN", dronahost: "Global CDN included", competitor: "Cloudflare CDN included", winner: "tie" },
    { feature: "Daily Backups", dronahost: "Yes — 30 days", competitor: "Yes — 14 days", winner: "dronahost" },
    { feature: "Uptime SLA", dronahost: "99.9%", competitor: "99.9%", winner: "tie" },
    { feature: "Infrastructure", dronahost: "NVMe SSD, LiteSpeed", competitor: "Google Cloud Platform, Nginx", winner: "tie" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 live chat", winner: "tie" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "Up to 35× lower entry price — accessible to small businesses and startups",
    "Longer backup retention (30 days vs 14 days)",
    "UAE and UK data centres for regional compliance",
    "No overage fees on standard plans",
  ],
  competitorPros: [
    "Google Cloud Platform infrastructure — enterprise-grade reliability",
    "Kinsta APM tool built-in for performance diagnosis",
    "Larger support team with WordPress-certified engineers",
    "Advanced staging environments with selective push",
  ],
  verdict:
    "Kinsta is an excellent choice for large agencies and enterprises with budgets to match — it delivers Google Cloud reliability with outstanding tooling. DronaHost is the clear choice for startups, SMBs, and businesses in the UK/UAE that need managed WordPress hosting without the $35+/mo entry price. If you are running a high-revenue WordPress site and need enterprise SLAs, consider Kinsta. For everyone else, DronaHost delivers comparable performance at a fraction of the cost.",
  datePublished: "2025-01-15",
};

export default data;
