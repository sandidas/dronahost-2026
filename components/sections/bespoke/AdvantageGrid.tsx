import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { Link } from "@/i18n/link";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import LuxeHeader from "../luxe/LuxeHeader";

export type Advantage = {
  /** The large figure, for example "99.99%". It must come from a commitment that renders. */
  value: string;
  title: string;
  text: string;
  /** The policy that states the commitment. */
  link: { label: string; href: string };
  /** A decision we made ourselves (trust rule TR7): shows a small "Our decision" label. */
  firstHand?: boolean;
};

type AdvantageGridProps = {
  eyebrow?: string;
  title: string;
  /** Closing phrase of the title, set heavier. */
  accent?: string;
  description?: string;
  /** Three or four items, already gated by their claims. Fewer than `minItems` and the section is omitted. */
  items: readonly Advantage[];
  minItems?: number;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/**
 * The advantage row: three or four commitments as large light numerals on a hairline rule, each with a short title, one line
 * and a link to the policy that states it. An item shows only while its claim renders.
 */
export default function AdvantageGrid({ eyebrow, title, accent, description, items, minItems = 2, headingLevel = "h2", className }: AdvantageGridProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (items.length < minItems) return null;
  return (
    <section aria-labelledby={headingId} className={cn("section-luxe", className)}>
      <div className="container-site">
        <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={accent} description={description} headingLevel={headingLevel} layout="split" />
        <ul className={cn("mt-14 grid border-t border-border-strong sm:mt-16 sm:grid-cols-2", COLS[items.length] ?? "lg:grid-cols-4")}>
          {items.map((item, i) => (
            <li
              key={item.title}
              {...reveal(i)}
              className={cn(
                "flex flex-col border-b border-border py-9 sm:pe-8 lg:border-b-0 lg:py-10",
                i < items.length - 1 && "lg:border-e",
                i > 0 && "lg:ps-8",
                i % 2 === 1 && "sm:ps-8 sm:border-s lg:border-s-0",
              )}
            >
              <span className="t-luxe-numeral text-[0.9375rem] text-link">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-luxe-numeral mt-5 text-[clamp(2.75rem,2rem+2.4vw,3.375rem)] text-foreground">{item.value}</span>
              {item.firstHand && <span className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">{UI.limits.firstHand}</span>}
              <Item className={cn("font-heading text-xl font-medium tracking-[-0.01em] text-foreground", item.firstHand ? "mt-1.5" : "mt-5")}>{item.title}</Item>
              <p className="mt-2.5 flex-1 text-base text-muted-foreground">{item.text}</p>
              <Link href={item.link.href} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-bold text-link">
                {item.link.label}
                <ArrowRight className="arrow-nudge size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
