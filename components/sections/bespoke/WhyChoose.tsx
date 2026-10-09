import { Link } from "@/i18n/link";
import { useId } from "react";
import FeatureIcon, { type FeatureIconName } from "@/components/ui/FeatureIcon";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";

export type Reason = {
  icon?: FeatureIconName;
  /** Six words or fewer. */
  title: string;
  /** One line of 20 words or fewer. */
  text: string;
  /** The page that publishes the terms behind this reason. Every reason needs one. */
  source: { label: string; href: string };
};

type WhyChooseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Three reasons, already gated by their claims. Fewer than `minItems` and the section is omitted. */
  reasons: readonly Reason[];
  minItems?: number;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "Why choose us" in three reasons, each with a source link, so a visitor can read the terms behind the promise. Not a feature
 * list: a reason shows only while its claim renders, and it always links to the page that publishes the terms.
 */
export default function WhyChoose({ eyebrow, title, description, reasons, minItems = 2, headingLevel = "h2", className }: WhyChooseProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (reasons.length < minItems) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />
        <ul className={cn("mt-12 grid gap-5 sm:mt-14", reasons.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
          {reasons.map((r, i) => (
            <li key={r.title} className="surface flex flex-col p-6 sm:p-7" {...reveal(i)}>
              {r.icon && <FeatureIcon name={r.icon} className="mb-5" />}
              <Item className="t-h4 text-balance text-foreground">{r.title}</Item>
              <p className="t-body mt-2 flex-1 text-muted-foreground">{r.text}</p>
              <Link href={r.source.href} className="mt-4 inline-flex min-h-11 items-center self-start text-base font-semibold text-link underline underline-offset-4">
                {r.source.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
