import type { CompetitorData } from "./types";

const SOURCE = { url: "https://wpengine.com/plans/", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "wp-engine",
  name: "WP Engine",
  plan: { name: "Essential", source: SOURCE },
  dronahostPlanId: "starter",
  facts: {
    price: { value: "From $28/month for new customers; first year on annual billing: $336/year", source: SOURCE },
    renewal: { value: null, source: SOURCE },
    backups: { value: "Automatic and on-demand backups; retention of no less than 30 days and no longer than 60 days", source: SOURCE },
    support: { value: "24/7 technical support; channel type not stated on the page", source: SOURCE },
    moneyBack: { value: null, source: SOURCE },
    uptime: { value: "Not included in the Essential plan", source: SOURCE },
    migration: { value: "Free automated migration plugin", source: SOURCE },
  },
  strengths: ["backups", "support", "migration"],
  chooseCompetitor: "Choose {name} if you want the backup retention and 24/7 support it lists, and its price ({price}) suits you.",
  chooseDronahost: "Choose DronaHost if you want managed WordPress hosting with the renewal price shown next to the signup price, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
