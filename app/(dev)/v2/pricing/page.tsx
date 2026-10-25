import type { Metadata } from "next";
import pricing from "@/data/pricing.json";
import HostingPricing from "@/components/sections/HostingPricing";
import { Link } from "@/i18n/link";

export const metadata: Metadata = { title: "Pricing component", robots: { index: false, follow: false } };

type Plan = (typeof pricing.plans)[number];

/** Never rendered on a public page: internal limits, and PHP settings until the owner applies the PHP tab. */
const HIDDEN_GROUPS = new Set(["internal", "php"]);

/** Flattens a plan into dotted keys (pricing.annual.USD, limits.sites, ...) so every stored value gets a row. */
function flatten(value: unknown, prefix = ""): [string, unknown][] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => (k.startsWith("$") ? [] : flatten(v, prefix ? `${prefix}.${k}` : k)));
  }
  return [[prefix, value]];
}

const show = (v: unknown) => (v === null || v === undefined ? "null" : Array.isArray(v) ? v.join(", ") : String(v));

function PlanDataTable({ plans }: { plans: readonly Plan[] }) {
  const rows = new Map<string, Record<string, unknown>>();
  for (const plan of plans) {
    for (const [key, value] of flatten(plan)) {
      if (key === "id") continue;
      rows.set(key, { ...rows.get(key), [plan.id]: value });
    }
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label="Every value stored for each plan">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <caption className="sr-only">Every value stored for each plan in data/pricing.json</caption>
        <thead className="bg-muted text-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Field</th>
            {plans.map((p) => (
              <th key={p.id} scope="col" className="px-4 py-3 font-semibold">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...rows].map(([key, values]) => {
            const hidden = HIDDEN_GROUPS.has(key.split(".")[0] ?? "");
            return (
              <tr key={key} className="border-t border-border">
                <th scope="row" className="px-4 py-2 font-mono text-xs font-normal text-muted-foreground">
                  {key}
                  {hidden && <span className="ms-2 rounded bg-muted px-1.5 py-0.5 font-sans text-[0.625rem] font-semibold uppercase text-subtle-foreground">not shown</span>}
                </th>
                {plans.map((p) => (
                  <td key={p.id} className={`px-4 py-2 tabular-nums ${hidden ? "text-subtle-foreground" : "text-foreground"}`}>{show(values[p.id])}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Dev-only. The one pricing block every commercial page uses (HostingPricing), rendered exactly as a page would, and under
 * it every value data/pricing.json stores, so the owner can check the file against the sheet. Edit data/pricing.json and
 * this page, /pricing and every product page change together.
 */
export default function PricingPreview() {
  const m = pricing._meta;
  return (
    <main id="main-content" tabIndex={-1} className="bg-background">
      <div className="container-site pt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-link">/v2/pricing (development only)</p>
        <h1 className="t-h2 mt-2 text-foreground">HostingPricing</h1>
        <p className="t-body mt-3 max-w-3xl text-muted-foreground">
          One component, one source: <code>data/pricing.json</code> version {m.version}, updated {m.lastUpdated}. Pages may change only the heading
          and turn the extras off; plans and prices are the same everywhere. <Link href="/v2" className="text-link underline underline-offset-4">Back to the showcase</Link>
        </p>
      </div>

      <HostingPricing eyebrow="Pricing" />

      <div className="container-site space-y-12 pb-20">
        <section aria-labelledby="compact-heading">
          <h2 id="compact-heading" className="t-h3 text-foreground">Compact use on a product page</h2>
          <p className="t-small mt-2 text-muted-foreground">
            <code>{`<HostingPricing title="..." description="..." extras={false} />`}</code>: same plans and prices, with the page&apos;s own heading.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-border-strong">
            <HostingPricing anchorId="plans-compact" title="Plans for your WordPress site" description="Heading text comes from the page. Everything else comes from data/pricing.json." extras={false} />
          </div>
        </section>

        <section aria-labelledby="data-heading">
          <h2 id="data-heading" className="t-h3 text-foreground">What data/pricing.json holds</h2>
          <p className="t-small mt-2 max-w-3xl text-muted-foreground">
            Every stored value per plan. Rows marked &quot;not shown&quot; never reach a public page. <code>null</code> on a count shows as &quot;Fair use&quot; or hides the row, never &quot;Unlimited&quot;.
          </p>
          <div className="mt-6">
            <PlanDataTable plans={pricing.plans} />
          </div>
        </section>

        <section aria-labelledby="open-heading" className="rounded-xl border border-accent/30 bg-accent/10 p-6">
          <h2 id="open-heading" className="t-h4 text-foreground">Open before launch ({m.confirmBeforeLaunch.length})</h2>
          <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm text-foreground">
            {m.confirmBeforeLaunch.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
