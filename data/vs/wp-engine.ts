import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "wp-engine",
  name: "WP Engine",
  tagline: "DronaHost vs WP Engine — Managed WordPress Hosting Compared",
  intro:
    "WP Engine is one of the oldest managed WordPress hosting providers, popular with agencies building client sites. DronaHost offers managed WordPress hosting at significantly lower price points, with comparable performance and modern NVMe SSD infrastructure. This guide compares pricing, features, and use cases to help you choose the right host.",
  table: [
    { feature: "Starter Price", dronahost: "$0.99/mo", competitor: "$25/mo", winner: "dronahost" },
    { feature: "Free Migration", dronahost: "Yes — unlimited", competitor: "Yes — 1 migration", winner: "dronahost" },
    { feature: "Free SSL", dronahost: "Yes — wildcard", competitor: "Yes", winner: "dronahost" },
    { feature: "Daily Backups", dronahost: "Yes — 30 days", competitor: "Yes — 60 days", winner: "competitor" },
    { feature: "Staging", dronahost: "Yes on Pro+", competitor: "Yes on all plans", winner: "competitor" },
    { feature: "CDN", dronahost: "Global CDN included", competitor: "Cloudflare CDN included", winner: "tie" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 live chat + phone", winner: "competitor" },
    { feature: "Uptime SLA", dronahost: "99.9%", competitor: "99.95%", winner: "competitor" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "25× lower entry price — dramatically more affordable for small teams",
    "Wildcard SSL on all plans",
    "Unlimited free migrations",
    "UAE and UK data centres for regional compliance requirements",
  ],
  competitorPros: [
    "Staging on all plans including entry tier",
    "60-day backup retention",
    "99.95% uptime SLA — higher than industry standard",
    "WP Engine Genesis framework and StudioPress themes included",
  ],
  verdict:
    "WP Engine justifies its premium pricing with longer backup retention, staging on all tiers, and a slightly higher SLA. It is the right choice for agencies that need every feature available immediately. DronaHost is the better fit for cost-conscious businesses and those operating in the UK or UAE who need local data residency — you get managed WordPress at a fraction of WP Engine's price.",
  datePublished: "2025-01-15",
};

export default data;
