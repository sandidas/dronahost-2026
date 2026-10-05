import Link from "next/link";
import { useId } from "react";
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
  const stats = (claims ?? verifiedClaims(ids)).slice(0, 4);
  if (stats.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("py-10 sm:py-12", className)}>
      <h2 id={headingId} className="sr-only">
        {label}
      </h2>
      <dl className="container-site grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {stats.map((stat) => {
          const href = (stat as { href?: string }).href;
          return (
            <div key={stat.id} className="flex flex-col items-center bg-card px-4 py-8 text-center">
              <dd className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{stat.value}</dd>
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
    </section>
  );
}
