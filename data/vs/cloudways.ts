import type { CompetitorData } from "./types";

const SOURCE = { url: "https://www.cloudways.com/en/pricing.php", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "cloudways",
  name: "Cloudways",
  plan: { name: "Flexible, Micro", source: SOURCE },
  dronahostPlanId: "starter",
  productNote: "Cloudways sells managed cloud servers, not a WordPress-only plan. A fair match for it would be DronaHost cloud hosting, which has no plan data yet, so Starter is shown for reference only.",
  facts: {
    price: { value: "$11 USD per month, billed monthly (also hourly)", source: SOURCE },
    renewal: { value: "No increase stated on the page", source: SOURCE },
    sites: { value: "Unlimited websites", source: SOURCE },
    storage: { value: "50GB", source: SOURCE },
    backups: { value: null, source: SOURCE },
    support: { value: "24/7 support through live chat and a ticketing system", source: SOURCE },
    moneyBack: { value: "3-day trial, no credit card required; no money-back guarantee stated", source: SOURCE },
    uptime: { value: null, source: SOURCE },
    migration: { value: "Free migration; no limit stated", source: SOURCE },
  },
  strengths: ["sites", "storage", "support", "migration"],
  chooseCompetitor: "Choose {name} if you want a managed cloud server with no limit on websites and {storage}, paid as you go (the entry plan is listed at {price}).",
  chooseDronahost: "Choose DronaHost if you want hosting built around WordPress with a plan list and the renewal price shown up front, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
