import { useId, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { reveal } from "@/lib/motion";
import LuxeHeader, { lastSentence } from "./luxe/LuxeHeader";
import SectionHeader from "./SectionHeader";

/** One column per step from lg (max 6); a single column with a rail below that. */
const COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export type TimelineStep = { title: string; description: string };

type ProcessTimelineProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** 2 to 6 steps. Horizontal on large screens, vertical with a rail on smaller ones. */
  steps: readonly TimelineStep[];
  /** "rail" (default): numbered dots on a line. "cards": numbered cards with large light numerals (the Home look). */
  variant?: "rail" | "cards";
  /** Optional decorative graphic between the header and the steps. */
  graphic?: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const CARD_COLS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-3" };

/** Numbered process / migration timeline as a semantic ordered list. */
export default function ProcessTimeline({ eyebrow, title, description, steps, variant = "rail", graphic, headingLevel = "h2", className }: ProcessTimelineProps) {
  const headingId = useId();
  const Step = headingLevel === "h2" ? "h3" : "h4";
  if (steps.length === 0) return null;

  if (variant === "cards") {
    return (
      <section aria-labelledby={title ? headingId : undefined} className={cn("section-luxe", className)}>
        <div className="container-site">
          {title && <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={lastSentence(title)} description={description} headingLevel={headingLevel} align="center" />}
          {graphic && <div className="mt-12">{graphic}</div>}
          <ol className={cn("grid gap-5 sm:grid-cols-2", CARD_COLS[Math.min(steps.length, 6)], title && "mt-14 sm:mt-16")}>
            {steps.map((step, i) => (
              <li key={step.title} {...reveal(i)} className="luxe-card-light flex flex-col gap-3.5 rounded-3xl p-8">
                <span className="t-luxe-numeral text-[2.75rem] text-link">{String(i + 1).padStart(2, "0")}</span>
                <Step className="font-heading text-xl font-medium text-foreground">{step.title}</Step>
                <p className="text-base text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        {graphic && <div className="mt-12">{graphic}</div>}
        <ol className={cn("relative grid gap-8 lg:gap-6", COLS[Math.min(steps.length, 6)], title && "mt-12 sm:mt-14")}>
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:gap-5" {...reveal(i)}>
              {i < steps.length - 1 && (
                <>
                  <span aria-hidden="true" className="line-y absolute start-5 top-12 -bottom-8 w-px bg-border-strong lg:hidden" />
                  <span aria-hidden="true" className="line-x absolute start-14 end-[-0.75rem] top-5 hidden h-px bg-border-strong lg:block" />
                </>
              )}
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-card font-[family-name:var(--font-heading)] text-sm font-semibold text-link">
                {i + 1}
              </span>
              <div>
                <Step className="t-h4 text-foreground">{step.title}</Step>
                <p className="t-small mt-1.5 text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
