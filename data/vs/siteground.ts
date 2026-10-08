import type { CompetitorData } from "./types";

const SOURCE = { url: "https://www.siteground.com/wordpress-hosting.htm", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "siteground",
  name: "SiteGround",
  plan: { name: "StartUp", source: SOURCE },
  dronahostPlanId: "starter",
  facts: {
    price: { value: "$3.99/mo, prepaid for 12 months", source: SOURCE },
    renewal: { value: "$17.99/mo", source: SOURCE },
    sites: { value: "1 website", source: SOURCE },
    storage: { value: "10 GB", source: SOURCE },
    backups: { value: "Daily backups listed; retention period not stated on the page", source: SOURCE },
    support: { value: "24/7 support listed; channels not stated on the page", source: SOURCE },
    moneyBack: { value: null, source: SOURCE },
    uptime: { value: null, source: SOURCE },
    migration: { value: "Free site migrations listed; no limit stated", source: SOURCE },
  },
  strengths: ["support", "migration", "backups"],
  chooseCompetitor: "Choose {name} if you want its advertised first-term price ({price}) and 24/7 support, and you accept {renewal} after the first term.",
  chooseDronahost: "Choose DronaHost if you want the renewal price shown next to the signup price on every plan, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
