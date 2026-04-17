import type { ComparisonRow, CompetitorData } from "./types";

const data: CompetitorData = {
  slug: "cloudways",
  name: "Cloudways",
  tagline: "DronaHost vs Cloudways — Managed Cloud Hosting Compared",
  intro:
    "Cloudways is a managed cloud hosting platform that sits on top of major cloud providers (DigitalOcean, AWS, Google Cloud, Vultr). DronaHost offers managed hosting with its own infrastructure, giving you predictable pricing without cloud provider pass-through costs. This comparison looks at pricing models, ease of use, and which is better for growing businesses.",
  table: [
    { feature: "Entry Price", dronahost: "$0.99/mo", competitor: "$14/mo (DO Starter)", winner: "dronahost" },
    { feature: "Pricing Model", dronahost: "Fixed monthly plans", competitor: "Pay-per-use (variable)", winner: "dronahost" },
    { feature: "Free SSL", dronahost: "Yes", competitor: "Yes — Let's Encrypt", winner: "tie" },
    { feature: "Managed Backups", dronahost: "Yes — daily, 30-day retention", competitor: "Yes — on-demand + scheduled (add-on cost)", winner: "dronahost" },
    { feature: "CDN", dronahost: "Global CDN included", competitor: "Cloudflare CDN add-on", winner: "dronahost" },
    { feature: "UAE Data Centre", dronahost: "Yes — Dubai", competitor: "Via Vultr only", winner: "dronahost" },
    { feature: "Support", dronahost: "24/7 live chat", competitor: "24/7 live chat", winner: "tie" },
    { feature: "Cloud Provider Choice", dronahost: "DronaHost infrastructure", competitor: "DigitalOcean, AWS, GCP, Vultr", winner: "competitor" },
  ] satisfies ComparisonRow[],
  dronahostPros: [
    "Predictable fixed pricing — no surprise bills from cloud usage",
    "CDN included on all plans — Cloudways charges extra",
    "30-day backup retention included without add-on fees",
    "UAE data centre with first-party infrastructure",
  ],
  competitorPros: [
    "Choice of underlying cloud provider — AWS, GCP, DigitalOcean, Vultr",
    "More granular vertical scaling options",
    "Better fit for DevOps teams that want cloud-provider flexibility",
  ],
  verdict:
    "Cloudways is a powerful option for DevOps-oriented teams who want managed tooling over their preferred cloud provider. DronaHost is the better choice for businesses that want predictable billing, CDN included, and a simpler managed experience without cloud-provider complexity. For UAE businesses specifically, DronaHost's first-party Dubai data centre is a more reliable option than Cloudways' Vultr coverage.",
  datePublished: "2025-01-15",
};

export default data;
