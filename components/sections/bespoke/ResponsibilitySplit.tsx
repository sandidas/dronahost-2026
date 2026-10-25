import { Check, UserRound } from "lucide-react";
import { useId } from "react";
import { visibleItems, type Gated } from "@/lib/sections/gated";
import { reveal } from "@/lib/motion";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";

export type SplitItem = Gated & { text: string };

type ResponsibilitySplitProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  weLookAfter: readonly SplitItem[];
  youKeep: readonly SplitItem[];
  /** Column headings. Defaults: "We look after" and "You keep". */
  lookAfterLabel?: string;
  keepLabel?: string;
  /** Short transparency line under the columns. */
  note?: string;
  /** Fewest items each column needs for the section to show. Default 2: a column with a single bullet reads as an afterthought. */
  minItems?: number;
  /** Showcase only: show gated items too, with a visible label. */
  showSamples?: boolean;
  /** Render only the two columns and the note, with no section, heading or container. For use inside another section (MeaningSection). */
  bare?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** True when both columns have at least `minItems` visible lines, so the split would render. */
export const splitHasContent = (weLookAfter: readonly SplitItem[], youKeep: readonly SplitItem[], minItems = 2, showSamples = false): boolean =>
  visibleItems(weLookAfter, { showAll: showSamples }).length >= minItems && visibleItems(youKeep, { showAll: showSamples }).length >= minItems;

/**
 * "What we look after, and what stays with you." Removes the "what am I buying" confusion with two plain lists side by
 * side. Bespoke to the home page. Items tied to a capability `claim` are left out until that claim renders, and if either
 * column ends up with fewer than `minItems` (default 2) the section is omitted: half a promise is worse than none.
 */
export default function ResponsibilitySplit({
  eyebrow,
  title,
  description,
  weLookAfter,
  youKeep,
  lookAfterLabel = UI.split.lookAfter,
  keepLabel = UI.split.keep,
  note,
  minItems = 2,
  showSamples = false,
  bare = false,
  headingLevel = "h2",
  className,
}: ResponsibilitySplitProps) {
  const headingId = useId();
  const Column = headingLevel === "h2" ? "h3" : "h4";
  const left = visibleItems(weLookAfter, { showAll: showSamples });
  const right = visibleItems(youKeep, { showAll: showSamples });
  if (left.length < minItems || right.length < minItems) return null;
  // Claim gating can leave the columns uneven. A card stretched to match a much longer one would be a hollow box, so
  // when the lists differ by two or more items each card keeps its own height instead.
  const uneven = Math.abs(left.length - right.length) >= 2;

  const columns = (
    <>
        <div className={cn("grid gap-4 sm:gap-5 lg:grid-cols-2", !bare && "mt-12 sm:mt-14", uneven && "lg:items-start")}>
          <div className="surface surface-raised relative overflow-hidden !border-accent/30 bg-[color-mix(in_srgb,var(--accent)_7%,var(--surface-raised))] p-6 sm:p-8" {...reveal(0)}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <Column className="t-eyebrow">{lookAfterLabel}</Column>
            <ul className="mt-6 space-y-4">
              {left.map((item) => (
                <li key={item.text} className="flex items-start gap-3.5">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/12 text-link">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="t-body text-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface relative p-6 sm:p-8" {...reveal(1)}>
            <Column className="t-eyebrow !text-muted-foreground">{keepLabel}</Column>
            <ul className="mt-6 space-y-4">
              {right.map((item) => (
                <li key={item.text} className="flex items-start gap-3.5">
                  <span aria-hidden="true" className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border-strong bg-muted text-muted-foreground">
                    <UserRound className="size-3.5" strokeWidth={2.25} />
                  </span>
                  <span className="t-body text-foreground">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {note && <p className="t-small mt-6 text-center text-muted-foreground">{note}</p>}
    </>
  );
  if (bare) return columns;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />

        {columns}
      </div>
    </section>
  );
}
