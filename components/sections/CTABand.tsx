import { useId } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import type { HeroCta } from "./hero/types";
import { LuxeTitle, lastSentence } from "./luxe/LuxeHeader";

type CTABandProps = {
  eyebrow?: string;
  /** Optional for the page builder, where nothing is required; what is empty is left out. */
  title?: string;
  description?: string;
  /** The single primary action. */
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  /** Fine print under the actions. Only true statements. */
  note?: string;
  /** "card" (default): a raised card in the page band. "ink": a full-width ink band with a dot texture and pill actions (the Home look). */
  tone?: "card" | "ink";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Closing call-to-action band: one primary action, one optional quieter action. */
export default function CTABand({ eyebrow, title, description, primaryCta, secondaryCta, note, tone = "card", headingLevel = "h2", className }: CTABandProps) {
  const headingId = useId();
  const Heading = headingLevel;
  if (tone === "ink") {
    return (
      <section aria-labelledby={title ? headingId : undefined} className={cn("luxe-band luxe-glow dot-field dot-field-center", className)}>
        <div className="container-site py-24 text-center sm:py-32" {...reveal()}>
          {eyebrow && <p className="eyebrow-plain">{eyebrow}</p>}
          {title && (
            <Heading id={headingId} className={cn("t-luxe-display mx-auto max-w-[56rem] !text-[clamp(2.4rem,1.5rem+3.6vw,4.25rem)]", eyebrow && "mt-4")}>
              <LuxeTitle title={title} accent={lastSentence(title)} />
            </Heading>
          )}
          {description && <p className="t-luxe-lead mx-auto mt-6 max-w-[37.5rem]">{description}</p>}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            {primaryCta && (
              <Button href={primaryCta.href} size="lg" className="btn-glow rounded-full">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="secondary" size="lg" className="rounded-full bg-transparent">
                {secondaryCta.label}
              </Button>
            )}
          </div>
          {note && <p className="t-small mt-6 text-subtle-foreground">{note}</p>}
        </div>
      </section>
    );
  }
  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        <div className="surface surface-raised grain relative isolate overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20" {...reveal()}>
          <div className="ambient-glow absolute inset-0 -z-10" aria-hidden="true" />
          <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          {title && (
            <Heading id={headingId} className={cn("t-h2 mx-auto max-w-2xl text-foreground", eyebrow && "mt-3")}>
              {title}
            </Heading>
          )}
          {description && <p className="t-lead mx-auto mt-4">{description}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryCta && (
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
            )}
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
