import { Link } from "@/i18n/link";
import { useId } from "react";
import FeatureIcon, { type FeatureIconName } from "@/components/ui/FeatureIcon";
import Surface from "@/components/ui/Surface";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type FeatureGridItem = {
  icon?: FeatureIconName;
  title: string;
  description: string;
  /** Optional link; the whole card becomes the click target. */
  cta?: { label: string; href: string };
};

type FeatureGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: readonly FeatureGridItem[];
  /** 2, 3 or 4 columns at large widths; always 1 on phones. Default 3. */
  columns?: 2 | 3 | 4;
  /** cards = surfaces with gaps · divided = hairline-separated cells · plain = no chrome. */
  variant?: "cards" | "divided" | "plain";
  /** Heading level of the section title; item titles sit one level below. Default "h2". */
  headingLevel?: "h2" | "h3";
  className?: string;
};

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Feature or service grid. Handles 1 to 12 items, long text and missing icons.
 * Cards with a `cta` are fully clickable through a stretched link, so the link text stays
 * descriptive and crawlable while the whole tile is the target.
 */
export default function FeatureGrid({
  eyebrow,
  title,
  description,
  items,
  columns = 3,
  variant = "cards",
  headingLevel = "h2",
  className,
}: FeatureGridProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <ul
          className={cn(
            "grid grid-cols-1",
            title && "mt-12 sm:mt-14",
            variant === "divided" ? "gap-px overflow-hidden rounded-2xl border border-border bg-border" : "gap-4 sm:gap-6",
            COLS[columns],
          )}
        >
          {items.map((item, i) => (
            <li key={item.title} className="flex" {...reveal(i)}>
              <Surface
                as="div"
                interactive={Boolean(item.cta) && variant === "cards"}
                padding="lg"
                className={cn(
                  "relative flex w-full flex-col",
                  variant === "divided" && "!rounded-none !border-0 !shadow-none",
                  variant === "plain" && "!border-0 !bg-transparent !p-0 !shadow-none",
                )}
              >
                {item.icon && <FeatureIcon name={item.icon} className="mb-5" />}
                <Item className="t-h4 text-foreground">{item.title}</Item>
                <p className="t-small mt-2 flex-1 text-muted-foreground">{item.description}</p>
                {item.cta && (
                  <Link
                    href={item.cta.href}
                    className="btn btn-link mt-3 static self-start after:absolute after:inset-0 after:content-['']"
                  >
                    {item.cta.label}
                    <span aria-hidden="true" className="arrow-nudge"> →</span>
                  </Link>
                )}
              </Surface>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
