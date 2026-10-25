import { Check } from "lucide-react";
import { useId, type ReactNode } from "react";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";

type FeatureSpotlightProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Two to four points, already gated. */
  points: readonly { title: string; text: string }[];
  /** Large decorative graphic on the other side. */
  visual?: ReactNode;
  /** Small print, for example a trademark notice. */
  note?: string;
  /** The outside source the note relies on, linked after it. */
  source?: { label: string; href: string };
  /** Put the visual on the left at large widths. */
  reverse?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * One included feature given its own section: heading, short description and two to four points beside a large animated
 * graphic. Reusable on any page (owner, 2026-10-11: "Include WordPress page builders" on /wordpress-hosting).
 */
export default function FeatureSpotlight({ eyebrow, title, description, points, visual, note, source, reverse = false, headingLevel = "h2", className }: FeatureSpotlightProps) {
  const headingId = useId();
  const Point = headingLevel === "h2" ? "h3" : "h4";
  if (points.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={cn("min-w-0", reverse && "lg:order-2")}>
          <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="start" />
          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <li key={p.title} {...reveal(i)} className="flex gap-4">
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 text-link" aria-hidden="true">
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                <span>
                  <Point className="font-heading text-lg font-medium text-foreground">{p.title}</Point>
                  <span className="mt-1 block text-[0.9375rem] text-muted-foreground">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          {(note || source) && (
            <p className="mt-6 text-xs text-subtle-foreground">
              {note}
              {source && (
                <>
                  {note && " "}
                  <a href={source.href} rel="noopener noreferrer" target="_blank" className="text-link underline underline-offset-4">
                    {source.label}
                  </a>
                </>
              )}
            </p>
          )}
        </div>
        {visual && (
          <div {...reveal(1)} aria-hidden="true" className={cn("flex justify-center", reverse ? "lg:order-1 lg:justify-start" : "lg:justify-end")}>
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
