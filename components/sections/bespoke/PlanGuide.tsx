import { ArrowUpRight } from "lucide-react";
import { useId } from "react";
import LuxeHeader from "@/components/sections/luxe/LuxeHeader";
import { UI } from "@/content/strings";
import { Link } from "@/i18n/link";
import type { PlanGuideRow } from "@/lib/pricing/plans";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

type PlanGuideProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  rows: readonly (PlanGuideRow & { fit: string })[];
  note?: string;
  link?: { label: string; href: string };
  headingLevel?: "h2" | "h3";
};

/**
 * Which plan fits which stage of a business. Every figure comes from data/pricing.json; the spec adds one plain line per
 * plan on who it fits. A real <table>, so screen readers read each plan's row in order; it scrolls sideways on phones.
 */
export default function PlanGuide({ eyebrow, title, description, rows, note, link, headingLevel = "h2" }: PlanGuideProps) {
  const headingId = useId();
  const t = UI.pricing.planGuide;
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="section-luxe">
      <div className="container-site">
        <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="center" />

        <div {...reveal()} className="gx-scope surface relative mt-14 overflow-hidden !rounded-[1.75rem] p-2">
          <span aria-hidden="true" className="pointer-events-none absolute -top-24 end-0 size-72 rounded-full bg-[radial-gradient(closest-side,var(--glow-teal),transparent)] blur-2xl" />
          <div role="region" aria-label={t.caption} tabIndex={0} className="relative overflow-x-auto rounded-[1.375rem]">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <caption className="sr-only">{t.caption}</caption>
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-5 py-4 text-start">{t.plan}</th>
                  <th scope="col" className="px-4 py-4 text-start">{t.fit}</th>
                  <th scope="col" className="px-4 py-4 text-end">{t.sites}</th>
                  <th scope="col" className="px-4 py-4 text-end">{t.storage}</th>
                  <th scope="col" className="px-4 py-4 text-start">{t.resources}</th>
                  <th scope="col" className="px-4 py-4 text-start">{t.type}</th>
                  <th scope="col" className="px-4 py-4 text-start">{t.next}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className={cn("border-t border-border align-top", row.highlight && "bg-accent/10")}>
                    <th scope="row" className="px-5 py-5 text-start">
                      <span className="block font-heading text-base font-semibold text-foreground">{row.name}</span>
                      {row.highlight && <span className="mt-1 block text-xs font-semibold text-link">{t.recommended}</span>}
                    </th>
                    <td className="max-w-64 px-4 py-5 text-muted-foreground">{row.fit}</td>
                    <td className="px-4 py-5 text-end font-semibold tabular-nums text-foreground">{row.sites}</td>
                    <td className="px-4 py-5 text-end tabular-nums text-foreground">{t.gb(row.storageGB)}</td>
                    <td className="px-4 py-5 tabular-nums text-foreground">{t.memoryCpu(row.ramGB, row.cpuCores)}</td>
                    <td className="px-4 py-5 text-foreground">{row.type}</td>
                    <td className="px-4 py-5 text-muted-foreground">{row.next ?? t.beyond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(note || link) && (
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground">
              {note && <p className="max-w-2xl">{note}</p>}
              {link && (
                <Link href={link.href} className="inline-flex items-center gap-2 font-semibold text-link underline underline-offset-4">
                  {link.label}
                  <ArrowUpRight className="arrow-nudge size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
