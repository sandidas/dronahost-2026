import { Link } from "@/i18n/link";
import { useId } from "react";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { TRUST_ITEMS, type TrustItem } from "@/content/trust";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

type TrustSignalsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Override the registry (showcase only). */
  items?: readonly TrustItem[];
  /** Showcase only: render unverified items with a visible label. */
  showSamples?: boolean;
  /** Short transparency line under the grid, e.g. the renewal-price note. */
  note?: string;
  /** "cards" (default) is a grid of cards. "list" is one compact divided list, for pages that already show the same items as claims. */
  variant?: "cards" | "list";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Trust components in one place: guarantee, SLA, security, data-center locations, DPA and
 * support. Each item renders only when verified in content/trust.ts, so no certification,
 * location or guarantee can appear unless it is true. `variant="list"` is the compact form.
 */
export default function TrustSignals({ eyebrow, title, description, items = TRUST_ITEMS, showSamples = false, note, variant = "cards", headingLevel = "h2", className }: TrustSignalsProps) {
  const headingId = useId();
  const shown = showSamples ? items : items.filter((i) => i.verified);
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (shown.length === 0) return null;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        {variant === "list" ? (
          <ul className={cn("surface mx-auto max-w-3xl divide-y divide-border overflow-hidden", title && "mt-10 sm:mt-12")}>
            {shown.map((item, i) => (
              <li key={item.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6" {...reveal(i)}>
                <FeatureIcon name={item.icon} />
                <div className="min-w-0 flex-1">
                  <Item className="t-h4 text-foreground">{item.title}</Item>
                  <p className="t-small mt-0.5 text-muted-foreground">{item.description}</p>
                  {!item.verified && <p className="mt-1 text-xs font-semibold text-warning">Sample, unverified</p>}
                </div>
                {item.href && (
                  <Link href={item.href} className="inline-flex min-h-9 shrink-0 items-center text-sm font-semibold text-link underline underline-offset-4">
                    {item.linkLabel ?? "Learn more"}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
        <ul className={cn("flex flex-wrap justify-center gap-4", title && "mt-12 sm:mt-14")}>
          {shown.map((item, i) => (
            <li key={item.id} className="surface flex w-full gap-4 p-6 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]" {...reveal(i)}>
              <FeatureIcon name={item.icon} />
              <div className="min-w-0">
                <Item className="t-h4 text-foreground">{item.title}</Item>
                <p className="t-small mt-1.5 text-muted-foreground">{item.description}</p>
                {item.href && (
                  <Link href={item.href} className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-link underline underline-offset-4">
                    {item.linkLabel ?? "Learn more"}
                  </Link>
                )}
                {!item.verified && <p className="mt-2 text-xs font-semibold text-warning">Sample, unverified</p>}
              </div>
            </li>
          ))}
        </ul>
        )}
        {note && <p className="t-small mt-6 text-center text-muted-foreground">{note}</p>}
      </div>
    </section>
  );
}
