import { ArrowRight, Check, Eye, Server } from "lucide-react";
import { useId } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import MigrationIllustration from "../visuals/MigrationIllustration";

export type MigrationPromoProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Three short reassurances, shown as a checked list. */
  points: readonly string[];
  /** The one action. `href` is resolved by the renderer (for example the client area), never typed in the page JSON. */
  cta: { label: string; href: string };
  note?: string;
  /** Labels of the three stops in the graphic: where the site is now, the transfer, the destination. */
  graphic: { from: string; middle: string; to: string; caption: string };
  anchorId?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * The migration call to action on Home: copy and one button on one side, an original theme-aware illustration of the move
 * (a parcel arriving by parachute at its new home) above the three stops (current host, the transfer,
 * DronaHost) on the other. No form: the button opens the client area, where the order
 * and the move start (owner, 2026-10-10).
 */
export default function MigrationPromo({ eyebrow, title, description, points, cta, note, graphic, anchorId, headingLevel = "h2", className }: MigrationPromoProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const stops = [
    { label: graphic.from, Icon: Server, tone: "border-border-strong bg-card text-muted-foreground" },
    { label: graphic.middle, Icon: Eye, tone: "border-link/40 bg-surface-raised text-link" },
    { label: graphic.to, Icon: Check, tone: "border-accent bg-accent text-accent-foreground" },
  ];

  return (
    <section id={anchorId} aria-labelledby={headingId} className={cn("luxe-band luxe-glow section-luxe scroll-mt-20", className)}>
      <div className="container-site grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div {...reveal()}>
          {eyebrow && <p className="eyebrow-rule">{eyebrow}</p>}
          <Heading id={headingId} className={cn("t-luxe-h2", eyebrow && "mt-5")}>
            {title}
          </Heading>
          {description && <p className="t-luxe-lead mt-6 max-w-xl">{description}</p>}
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-4 text-foreground">
                <span className="grid size-8 flex-none place-items-center rounded-full border border-link/40">
                  <Check className="size-3.5 text-link" aria-hidden="true" strokeWidth={2.6} />
                </span>
                <span className="pt-1">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={cta.href} external size="lg" className="btn-glow rounded-full" trailingIcon={<ArrowRight className="arrow-nudge size-[1.125rem]" aria-hidden="true" />}>
              {cta.label}
            </Button>
            {note && <p className="t-small text-muted-foreground">{note}</p>}
          </div>
        </div>

        <figure {...reveal(1)} className="relative m-0">
          <div className="console-frame">
            <div className="console-body px-5 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
              <MigrationIllustration className="text-foreground/70" />
              <ol className="mt-6 grid gap-3 sm:grid-cols-3" aria-label={graphic.caption}>
                {stops.map(({ label, Icon, tone }, i) => (
                  <li key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                    <span className={cn("grid size-9 flex-none place-items-center rounded-xl border", tone)}>
                      <Icon className="size-4" aria-hidden="true" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0">
                      <span className="t-eyebrow block text-[0.625rem]">{String(i + 1).padStart(2, "0")}</span>
                      <span className="block text-sm font-semibold leading-snug text-foreground">{label}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <figcaption className="t-small mt-4 text-center text-muted-foreground">{graphic.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
