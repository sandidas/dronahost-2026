import type { CompetitorData } from "./types";

const SOURCE = { url: "https://kinsta.com/pricing/", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "kinsta",
  name: "Kinsta",
  plan: { name: "Single 20GB", source: SOURCE },
  dronahostPlanId: "starter",
  facts: {
    price: { value: "$35 USD/month, or $30 USD/month billed annually; the page also shows $0 for the first month", source: SOURCE },
    renewal: { value: null, source: SOURCE },
    sites: { value: "1 WordPress install", source: SOURCE },
    backups: { value: "14 days backup retention", source: SOURCE },
    support: { value: "24/7 human support in 8 languages", source: SOURCE },
    moneyBack: { value: null, source: SOURCE },
    uptime: { value: "Up to 99.99% uptime SLA", source: SOURCE },
    migration: { value: "Unlimited free migrations", source: SOURCE },
  },
  strengths: ["uptime", "backups", "migration", "support"],
  chooseCompetitor: "Choose {name} if you want the platform features it lists, such as a stated uptime SLA and 24/7 human support, and its price ({price}) suits your budget.",
  chooseDronahost: "Choose DronaHost if you want managed WordPress hosting with the renewal price shown next to the signup price, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
