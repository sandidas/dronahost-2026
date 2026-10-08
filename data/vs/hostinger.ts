import type { CompetitorData } from "./types";

const SOURCE = { url: "https://www.hostinger.com/web-hosting", retrieved: "2026-10-07" };

const data: CompetitorData = {
  slug: "hostinger",
  name: "Hostinger",
  plan: { name: "Premium (shared hosting)", source: SOURCE },
  dronahostPlanId: "essential",
  productNote: "Hostinger's Premium is shared hosting, not managed WordPress hosting. The closest DronaHost plan is Essential, which is also unmanaged web hosting.",
  facts: {
    price: { value: "$2.99/mo on a 48-month plan", source: SOURCE },
    renewal: { value: "$10.99/mo", source: SOURCE },
    sites: { value: "3 websites", source: SOURCE },
    storage: { value: "20 GB SSD", source: SOURCE },
    backups: { value: "Free weekly backups", source: SOURCE },
    support: { value: "Priority 24/7 expert support; channels not stated on the page (chat is mentioned in its FAQ)", source: SOURCE },
    moneyBack: { value: "30-day money-back guarantee", source: SOURCE },
    uptime: { value: null, source: SOURCE },
    migration: { value: "Free unlimited website migration", source: SOURCE },
  },
  strengths: ["sites", "storage", "moneyBack", "migration"],
  chooseCompetitor: "Choose {name} if you want {sites} and {storage} on the entry plan and can take a long term: its advertised price is {price}, then {renewal}.",
  chooseDronahost: "Choose DronaHost if you want the renewal price shown next to the signup price on every plan, and a team you can reach by support ticket or email.",
  // [HUMAN REVIEW: open the source URL and confirm every fact above before turning FEATURES.comparisonPages on]
  checkedAtSource: false,
  reviewedOn: "2026-10-07",
};

export default data;
