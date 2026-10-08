/**
 * Competitor comparison data. Rules (docs/content-planner/plans/02-commercial-investigation.md):
 *  - Every competitor fact carries a source URL and the date it was retrieved. No source, no fact.
 *  - `value: null` means "the page we checked does not state it". A missing key means "not checked yet".
 *  - DronaHost's side is never typed here. It is built from data/pricing.json and verified claims (lib/vs/compare.ts).
 *  - Facts here were read from public pages by an automated fetch. `checkedAtSource` stays false until a person has
 *    opened each source and confirmed it. scripts/check-vs.ts fails when the comparison flag is on while any is false.
 */
export type Source = { url: string; retrieved: string };

export type FactKey = "price" | "renewal" | "sites" | "storage" | "backups" | "support" | "moneyBack" | "uptime" | "migration";

export type CompetitorFact = { value: string | null; source: Source };

export type CompetitorData = {
  slug: string;
  name: string;
  /** The competitor entry plan that is compared, and the page it was read from. */
  plan: { name: string; source: Source };
  /** The DronaHost plan closest in kind (managed WordPress: starter; unmanaged web hosting: essential). */
  dronahostPlanId: "starter" | "essential";
  /** Honest note when the two products are not like for like. */
  productNote?: string;
  facts: Partial<Record<FactKey, CompetitorFact>>;
  /** Facts (keys of `facts`, each with a value) that count in the competitor's favour. At least two. */
  strengths: FactKey[];
  /** Short "who should choose which" lines. `{name}`, `{plan}` and `{price}`, `{renewal}` and other fact keys are filled from `facts`. */
  chooseCompetitor: string;
  chooseDronahost: string;
  /** True only after a person opened every source URL and confirmed the facts. */
  checkedAtSource: boolean;
  /** YYYY-MM-DD, when the facts were last reviewed. */
  reviewedOn: string;
};
