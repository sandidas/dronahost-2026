import { useId, type CSSProperties } from "react";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import LuxeHeader from "../luxe/LuxeHeader";

export type EcosystemPoint = { title: string; text: string };

type EcosystemProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  /** Three or four short points, already gated. */
  points: readonly EcosystemPoint[];
  /** Four to eight labels around the centre. */
  nodes: readonly string[];
  /** The label in the centre. */
  center: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Position of node `i` of `n` on a ring of radius `r` (percent of the box), starting at 12 o'clock. */
function ringPosition(i: number, n: number, r: number): CSSProperties {
  const a = ((-90 + (360 / n) * i) * Math.PI) / 180;
  return { left: `${(50 + r * Math.cos(a)).toFixed(1)}%`, top: `${(50 + r * Math.sin(a)).toFixed(1)}%` };
}

/** The orbit: CSS rings and positioned labels. One image to assistive technology, described by its label. */
function Orbit({ nodes, center }: { nodes: readonly string[]; center: string }) {
  return (
    <div role="img" aria-label={UI.luxe.ecosystemDiagram(center, nodes)} className="relative mx-auto w-full max-w-[35rem]">
      {/* Phones: the labels as a wrapped cluster around the centre, so nothing overflows a narrow screen. */}
      <div aria-hidden="true" className="flex flex-col items-center gap-5 sm:hidden">
        <span className="orbit-core grid size-28 place-items-center rounded-full">
          <span className="font-heading text-lg font-semibold text-foreground">{center}</span>
        </span>
        <ul className="flex flex-wrap justify-center gap-2">
          {nodes.map((n, i) => (
            <li key={n} className="flex items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-3.5 py-2 text-[0.8125rem] font-semibold text-foreground">
              <span className={cn("size-1.5 rounded-full", i % 2 ? "bg-accent" : "bg-action")} />
              {n}
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="relative hidden aspect-square sm:block">
        <span className="orbit-ring inset-0 border border-link/15" />
        <span className="orbit-ring inset-[15%] border border-dashed border-link/25" />
        <span className="orbit-ring orbit-core inset-[31%]" />
        <span className="orbit-ring inset-[38%] grid place-items-center border border-border-strong bg-card shadow-[0_30px_80px_-24px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
          <span className="font-heading text-xl font-semibold text-foreground">{center}</span>
        </span>
        {nodes.map((n, i) => (
          <span key={n} style={ringPosition(i, nodes.length, 40)} className="orbit-node flex items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-3.5 py-2 text-[0.8125rem] font-semibold text-foreground">
            <span className={cn("size-1.5 rounded-full", i % 2 ? "bg-accent" : "bg-action")} />
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The ecosystem: how the services fit together, as a short list of points beside an orbit diagram drawn in CSS. The
 * diagram is one image to screen readers (role="img" with a label that lists every node).
 */
export default function Ecosystem({ eyebrow, title, accent, description, points, nodes, center, headingLevel = "h2", className }: EcosystemProps) {
  const headingId = useId();
  const Point = headingLevel === "h2" ? "h3" : "h4";
  return (
    <section aria-labelledby={headingId} className={cn("luxe-band section-luxe", className)}>
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-[4.5rem]">
        <div className="min-w-0">
          <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={accent} description={description} headingLevel={headingLevel} />
          {points.length > 0 && (
            <ul className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {points.map((p, i) => (
                <li key={p.title} {...reveal(i)} className="border-t border-border-strong pt-[1.125rem]">
                  <Point className="font-heading text-base font-medium text-foreground">{p.title}</Point>
                  <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">{p.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div {...reveal(1)}>
          <Orbit nodes={nodes} center={center} />
        </div>
      </div>
    </section>
  );
}
