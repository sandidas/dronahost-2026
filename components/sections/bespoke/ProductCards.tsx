import { useId } from "react";
import Button from "@/components/ui/Button";
import { FEATURE_ICONS, type FeatureIconName } from "@/components/ui/FeatureIcon";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

export type ProductCard = {
  icon: FeatureIconName;
  /** Small label above the title, for example "Managed". */
  tag?: string;
  title: string;
  text: string;
  href: string;
  /** Button label, for example "See WordPress plans". Never a price (decision 58). */
  cta: string;
};

type ProductCardsProps = {
  /** Section name for screen readers; the row has no visible heading. */
  title: string;
  /** Two to four cards, already gated. */
  items: readonly ProductCard[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * A row of product cards straight under the hero, so a visitor who knows what they want goes to that page in one click.
 * Each card has a line icon, a title, one plain sentence and one button. No prices (they live on /pricing only).
 */
export default function ProductCards({ title, items, headingLevel = "h2", className }: ProductCardsProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const Card = headingLevel === "h2" ? "h3" : "h4";
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className={cn("py-12 sm:py-16", className)}>
      <div className="container-site">
        <Heading id={headingId} className="sr-only">
          {title}
        </Heading>
        <ul className={cn("grid gap-5 sm:grid-cols-2", items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {items.map((p, i) => {
            const Icon = FEATURE_ICONS[p.icon];
            return (
              <li key={p.href} {...reveal(i)} className="flex">
                <article className="luxe-card luxe-card-quiet flex w-full flex-col gap-3 rounded-[1.375rem] p-7">
                  <span className="grid size-[2.875rem] place-items-center rounded-[0.875rem] border border-link/30 text-link" aria-hidden="true">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="mt-3">
                    {/* From sm up the label line keeps its height when empty, so every title in the row lines up. */}
                    <p className={cn("min-h-[1.125rem] text-xs font-semibold uppercase tracking-[0.12em] text-subtle-foreground", !p.tag && "hidden sm:block")} aria-hidden={!p.tag || undefined}>
                      {p.tag}
                    </p>
                    <Card className="mt-1 font-heading text-xl font-medium text-foreground">{p.title}</Card>
                  </div>
                  <p className="flex-1 text-[0.9375rem] text-muted-foreground">{p.text}</p>
                  <Button href={p.href} variant="secondary" fullWidth className="mt-4">
                    {p.cta}
                  </Button>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
