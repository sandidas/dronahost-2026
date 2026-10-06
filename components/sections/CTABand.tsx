import { useId } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import type { HeroCta } from "./hero/types";

type CTABandProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** The single primary action. */
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  /** Fine print under the actions. Only true statements. */
  note?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Closing call-to-action band: one primary action, one optional quieter action. */
export default function CTABand({ eyebrow, title, description, primaryCta, secondaryCta, note, headingLevel = "h2", className }: CTABandProps) {
  const headingId = useId();
  const Heading = headingLevel;
  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <div className="surface surface-raised grain relative isolate overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20" {...reveal()}>
          <div className="ambient-glow absolute inset-0 -z-10" aria-hidden="true" />
          <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <Heading id={headingId} className={cn("t-h2 mx-auto max-w-2xl text-foreground", eyebrow && "mt-3")}>
            {title}
          </Heading>
          {description && <p className="t-lead mx-auto mt-4">{description}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="secondary" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </div>
          {note && <p className="t-small mt-5 text-muted-foreground">{note}</p>}
        </div>
      </div>
    </section>
  );
}
