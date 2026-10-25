import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { FEATURE_ICONS, type FeatureIconName } from "@/components/ui/FeatureIcon";
import { Link } from "@/i18n/link";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import LuxeHeader from "../luxe/LuxeHeader";

export type FeaturedSolution = { tag: string; title: string; text: string; href: string; cta: string };
export type Solution = { icon: FeatureIconName; title: string; text: string; href: string };

type SolutionsGridProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  /** One or two large cards, already gated. */
  featured: readonly FeaturedSolution[];
  /** Three to eight small cards with a line icon, already gated. */
  items: readonly Solution[];
  /** Small print under the grid, for example a trademark notice. */
  note?: string;
  /** The section id, so a link such as /#solutions scrolls to it. */
  anchorId?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Everything we offer on an ink band: one or two featured services as large glass cards, then the rest as small cards with
 * a line icon. Each card is one link. Items gate on their own claims in the registry.
 */
export default function SolutionsGrid({ eyebrow, title, accent, description, featured, items, note, anchorId, headingLevel = "h2", className }: SolutionsGridProps) {
  const headingId = useId();
  const Card = headingLevel === "h2" ? "h3" : "h4";
  if (featured.length + items.length === 0) return null;
  return (
    <section id={anchorId} aria-labelledby={headingId} className={cn("luxe-band section-luxe scroll-mt-20", className)}>
      <div className="container-site">
        <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={accent} description={description} headingLevel={headingLevel} align="center" />
        {featured.length > 0 && (
          <ul className={cn("mt-14 grid gap-5 sm:mt-16", featured.length > 1 && "lg:grid-cols-2")}>
            {featured.map((f, i) => (
              <li key={f.title} {...reveal(i)}>
                <Link href={f.href} className="luxe-card group flex h-full min-h-[18rem] flex-col gap-4 overflow-hidden rounded-[1.75rem] p-8 sm:min-h-[20rem] sm:p-10">
                  <span className="luxe-rings" aria-hidden="true" />
                  <span className="eyebrow-plain">{f.tag}</span>
                  <Card className="t-luxe-h3 text-foreground">{f.title}</Card>
                  <span className="max-w-[26rem] flex-1 text-base text-muted-foreground">{f.text}</span>
                  <span className="inline-flex items-center gap-2.5 font-bold text-foreground">
                    {f.cta}
                    <ArrowRight className="arrow-nudge size-[1.125rem]" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", featured.length > 0 ? "mt-5" : "mt-14 sm:mt-16")}>
            {items.map((s, i) => {
              const Icon = FEATURE_ICONS[s.icon];
              return (
                <li key={s.title} {...reveal(i)}>
                  <Link href={s.href} className="luxe-card luxe-card-quiet group flex h-full min-h-[13.5rem] flex-col gap-3 rounded-[1.375rem] p-7">
                    <span className="grid size-[2.875rem] place-items-center rounded-[0.875rem] border border-link/30 text-link" aria-hidden="true">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <Card className="mt-2 font-heading text-xl font-medium text-foreground">{s.title}</Card>
                    <span className="flex-1 text-[0.9375rem] text-muted-foreground">{s.text}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-link">
                      {UI.luxe.explore}
                      <ArrowRight className="arrow-nudge size-[0.9375rem]" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {note && <p className="mt-8 text-center text-xs text-subtle-foreground">{note}</p>}
      </div>
    </section>
  );
}
