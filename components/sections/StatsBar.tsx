import { Link } from "@/i18n/link";
import { useId } from "react";
import CountUp from "@/components/motion/CountUp";
import { verifiedClaims, type Claim } from "@/content/claims";
import { cn } from "@/utils/cn";

type StatsBarProps = {
  /** Claim ids to display, in order. Defaults to every verified claim. */
  ids?: readonly string[];
  /** Accessible name for the region. */
  label?: string;
  /** Showcase only: render the supplied claims even when unverified, with a label. */
  claims?: readonly (Claim & { href?: string })[];
  className?: string;
};

/**
 * Stats strip driven by content/claims.ts. Renders nothing until at least one claim is
 * verified. Each stat can link to its proof page (SLA, status, etc.).
 */
export default function StatsBar({ ids, label = "Service statistics", claims, className }: StatsBarProps) {
  const headingId = useId();
  // Measured numbers only. Policy and feature claims ("assurance") render in AssuranceStrip instead.
  const stats = (claims ?? verifiedClaims(ids).filter((c) => c.kind === "stat")).slice(0, 4);
  if (stats.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("py-10 sm:py-12", className)}>
      <h2 id={headingId} className="sr-only">
        {label}
      </h2>
      <div className="container-site">
        <dl className="surface flex flex-wrap overflow-hidden">
          {stats.map((stat, i) => {
            const href = (stat as { href?: string }).href;
            return (
              <div
                key={stat.id}
                data-claim={stat.id}
                className={cn(
                  "flex min-w-0 basis-1/2 flex-col items-center px-4 py-8 text-center lg:basis-0 lg:flex-1",
                  i > 0 && "lg:border-s lg:border-border",
                  i % 2 === 1 && "border-s border-border",
                  i >= 2 && "border-t border-border lg:border-t-0",
                )}
              >
                <dd className="font-[family-name:var(--font-heading)] text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
                  {stat.verified ? <CountUp value={stat.value} /> : stat.value}
                </dd>
                <dt className="mt-2 text-sm font-medium text-muted-foreground">
                  {href ? (
                    <Link href={href} className="underline underline-offset-4 hover:text-foreground">
                      {stat.label}
                    </Link>
                  ) : (
                    stat.label
                  )}
                </dt>
                {stat.note && <dd className="mt-1 text-xs text-subtle-foreground">{stat.note}</dd>}
                {!stat.verified && <dd className="mt-1 text-xs font-semibold text-warning">Sample, unverified</dd>}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
