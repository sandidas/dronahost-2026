import type { CSSProperties } from "react";
import { ArrowUpRight, Quote } from "lucide-react";
import { useId } from "react";
import CurrencyAmount from "@/components/ui/CurrencyAmount";
import LuxeHeader from "@/components/sections/luxe/LuxeHeader";
import { UI } from "@/content/strings";
import { Link } from "@/i18n/link";
import type { RenewalCostRow } from "@/lib/pricing/plans";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

/** "11 October 2026", the project's date style. */
const formatDay = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

type RenewalCostProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rows: readonly RenewalCostRow[];
  finding?: { text: string; source: { label: string; href: string }; checkedOn: string };
  link?: { label: string; href: string };
  headingLevel?: "h2" | "h3";
};

/**
 * What each plan costs over three years, worked out from data/pricing.json in the visitor's currency. Each year cell carries
 * a bar that grows by the same step every year: the picture of a price that does not jump at renewal. A real <table>, so the
 * figures read in order for screen readers; the bars are decorative. One sourced market finding sits beside it.
 */
export default function RenewalCost({ eyebrow, title, description, rows, finding, link, headingLevel = "h2" }: RenewalCostProps) {
  const headingId = useId();
  const t = UI.pricing.renewalCost;
  const years = rows[0]?.years.length ?? 0;
  if (rows.length === 0 || years === 0) return null;

  return (
    <section aria-labelledby={headingId} className="section-luxe">
      <div className="container-site">
        <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="center" />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div {...reveal()} className="gx-scope surface relative overflow-hidden !rounded-[1.75rem] p-2">
            <span aria-hidden="true" className="pointer-events-none absolute -top-24 end-0 size-72 rounded-full bg-[radial-gradient(closest-side,var(--glow-teal),transparent)] blur-2xl" />
            <div role="region" aria-label={t.caption} tabIndex={0} className="relative overflow-x-auto rounded-[1.375rem]">
              <table className="w-full min-w-[40rem] border-collapse text-sm">
                <caption className="sr-only">{t.caption}</caption>
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-5 py-4 text-start">{t.plan}</th>
                    <th scope="col" className="px-4 py-4 text-end">
                      {t.perMonth}
                      <span className="mt-0.5 block text-[0.625rem] font-medium normal-case tracking-normal text-subtle-foreground">{t.perMonthHint}</span>
                    </th>
                    {Array.from({ length: years }, (_, i) => (
                      <th key={i} scope="col" className="px-4 py-4 text-end">{t.year(i + 1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={row.id} className={cn("border-t border-border", row.highlight && "bg-accent/10")}>
                      <th scope="row" className="px-5 py-5 text-start">
                        <span className="font-heading text-base font-semibold text-foreground">{row.name}</span>
                      </th>
                      <td className="px-4 py-5 text-end font-semibold tabular-nums text-foreground">{row.perMonth && <CurrencyAmount amounts={row.perMonth} />}</td>
                      {row.years.map((total, i) => (
                        <td key={i} className="px-4 py-5 text-end align-top">
                          <span className="block font-semibold tabular-nums text-foreground">{total && <CurrencyAmount amounts={total} />}</span>
                          {/* Equal steps: each year adds the same amount, so the bar grows by a third each time. */}
                          <span aria-hidden="true" className="ms-auto mt-2 block h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-muted">
                            <span
                              className="gx-fill block h-full origin-left rounded-full bg-accent"
                              style={{ width: `${((i + 1) / years) * 100}%`, "--d": `${200 + r * 120 + i * 180}ms` } as CSSProperties}
                            />
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-semibold text-link">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                {t.flat}
              </span>
              <span>{UI.pricing.taxLine}</span>
            </p>
          </div>

          {(finding || link) && (
            <aside {...reveal(1)} className="space-y-4">
              {finding && (
                <figure className="surface relative overflow-hidden !rounded-[1.75rem] p-6">
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -start-10 size-48 rounded-full bg-[radial-gradient(closest-side,var(--glow-orange),transparent)] blur-2xl" />
                  <Quote aria-hidden="true" className="relative size-6 text-link" strokeWidth={1.6} />
                  <blockquote className="relative mt-4 font-heading text-lg font-medium leading-snug text-foreground">{finding.text}</blockquote>
                  <figcaption className="relative mt-5 text-xs text-muted-foreground">
                    {t.source}:{" "}
                    <a href={finding.source.href} rel="noopener noreferrer" target="_blank" className="text-link underline underline-offset-4">
                      {finding.source.label}
                    </a>
                    . {t.checked} <time dateTime={finding.checkedOn}>{formatDay(finding.checkedOn)}</time>.
                  </figcaption>
                </figure>
              )}
              {link && (
                <Link href={link.href} className="surface surface-interactive flex min-h-14 items-center justify-between gap-3 !rounded-2xl px-6 py-4 text-sm font-semibold text-foreground">
                  {link.label}
                  <ArrowUpRight className="arrow-nudge size-4 text-link" aria-hidden="true" />
                </Link>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
