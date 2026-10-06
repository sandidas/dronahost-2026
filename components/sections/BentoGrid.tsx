import { Link } from "@/i18n/link";
import { useId, type ReactNode } from "react";
import FeatureIcon, { type FeatureIconName } from "@/components/ui/FeatureIcon";
import Surface from "@/components/ui/Surface";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type BentoItem = {
  title: string;
  description: string;
  icon?: FeatureIconName;
  /** Decorative visual (aria-hidden). Reserves fixed height so nothing shifts. */
  visual?: ReactNode;
  href?: string;
  linkLabel?: string;
  /** Width on large screens in a 6-column grid. Default "half" (3 of 6). */
  span?: "third" | "half" | "twoThirds" | "full";
};

type BentoGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** 1 to 6 tiles. Rows are balanced by `span`; unspecified tiles are half width. */
  items: readonly BentoItem[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

const SPAN = {
  third: "lg:col-span-2",
  half: "lg:col-span-3",
  twoThirds: "lg:col-span-4",
  full: "lg:col-span-6",
} as const;

/**
 * Bento grid: asymmetric tiles that each pair a short claim with a small visual.
 * One column on phones, two on tablets, six-column mosaic on large screens.
 */
export default function BentoGrid({ eyebrow, title, description, items, headingLevel = "h2", className }: BentoGridProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-6", title && "mt-12 sm:mt-14")}>
          {items.map((item) => (
            <li key={item.title} className={cn("flex", SPAN[item.span ?? "half"], item.span === "full" && "sm:col-span-2")}>
              <Surface
                padding="none"
                interactive={Boolean(item.href)}
                className="relative flex w-full flex-col overflow-hidden"
              >
                {item.visual && (
                  <div aria-hidden="true" className="relative h-48 shrink-0 border-b border-border bg-muted/60 sm:h-52">
                    <div className="bg-grid absolute inset-0 opacity-60" />
                    <div className="relative flex h-full items-center justify-center p-6">{item.visual}</div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {item.icon && !item.visual && <FeatureIcon name={item.icon} className="mb-5" />}
                  <Item className="t-h4 text-foreground">{item.title}</Item>
                  <p className="t-small mt-2 flex-1 text-muted-foreground">{item.description}</p>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="btn btn-link mt-3 static self-start after:absolute after:inset-0 after:content-['']"
                    >
                      {item.linkLabel ?? "Learn more"}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  )}
                </div>
              </Surface>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
