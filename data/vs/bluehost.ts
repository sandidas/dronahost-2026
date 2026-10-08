import type { CompetitorData } from "./types";

const SOURCE = { url: "https://www.bluehost.com/hosting/shared", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "bluehost",
  name: "Bluehost",
  plan: { name: "Starter (shared hosting)", source: SOURCE },
  dronahostPlanId: "essential",
  productNote: "Bluehost's Starter is shared hosting, not managed WordPress hosting. The closest DronaHost plan is Essential, which is also unmanaged web hosting.",
  facts: {
    price: { value: "$3.99/mo on a 36-month term", source: SOURCE },
    renewal: { value: "$9.99/mo", source: SOURCE },
    sites: { value: "10 websites", source: SOURCE },
    storage: { value: "10 GB NVMe SSD", source: SOURCE },
    backups: { value: "Weekly website backups", source: SOURCE },
    support: { value: "24/7 chat support; phone support not included", source: SOURCE },
    moneyBack: { value: "30-day money-back guarantee", source: SOURCE },
    uptime: { value: "99.99% uptime SLA", source: SOURCE },
    migration: { value: "Free site migration tool; no limit stated", source: SOURCE },
  },
  strengths: ["sites", "moneyBack", "uptime", "support"],
  chooseCompetitor: "Choose {name} if you want {sites} on the entry plan, a stated uptime SLA and 24/7 chat support, and you accept {renewal} after the first term.",
  chooseDronahost: "Choose DronaHost if you want the renewal price shown next to the signup price on every plan, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
