import { Link } from "@/i18n/link";
import { useId } from "react";
import { Minus } from "lucide-react";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";

export type Limit = {
  /** The limit in plain words: "We do not host email." */
  text: string;
  /** Why, or what to do instead. */
  reason?: string;
  link?: { label: string; href: string };
  /** A decision we made ourselves. Shown with a small label so the reader knows it is first-hand, not a generic caveat. */
  firstHand?: boolean;
};

type HonestLimitsProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Already gated by their claims. Fewer than `minItems` and the section is omitted. */
  items: readonly Limit[];
  minItems?: number;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "What we do not do." Honest limits build trust (rules/eeat-and-people-first.md, rule 4; trust check TR4) and send a reader
 * with the wrong need elsewhere before they waste time. A plain list, one limit per line, with the reason and a link to the
 * better option where one exists. Nothing here is a feature in disguise.
 */
export default function HonestLimits({ eyebrow, title, description, items, minItems = 2, headingLevel = "h2", className }: HonestLimitsProps) {
  const headingId = useId();
  if (items.length < minItems) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />
        <ul className="mx-auto mt-12 max-w-3xl divide-y divide-border sm:mt-14">
          {items.map((item, i) => (
            <li key={item.text} className="flex gap-4 py-5 sm:gap-5" {...reveal(i)}>
              <span aria-hidden="true" className="mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                <Minus className="size-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="t-h4 text-foreground">
                  {item.text}
                  {item.firstHand && <span className="ml-3 align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground">{UI.limits.firstHand}</span>}
                </p>
                {item.reason && <p className="t-body mt-1.5 text-muted-foreground">{item.reason}</p>}
                {item.link && (
                  <Link href={item.link.href} className="mt-2 inline-flex min-h-11 items-center text-base font-semibold text-link underline underline-offset-4">
                    {item.link.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
