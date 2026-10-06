import { Link } from "@/i18n/link";
import { useId } from "react";
import FeatureIcon from "@/components/ui/FeatureIcon";
import { CLAIMS, verifiedClaims, type Claim } from "@/content/claims";
import { cn } from "@/utils/cn";

type AssuranceStripProps = {
  /** Claim ids to show, in order. Defaults to every claim that may render. */
  ids?: readonly string[];
  /** Accessible name for the region. */
  label?: string;
  /** Showcase only: render the supplied claims even when hidden, with a visible label. */
  claims?: readonly Claim[];
  className?: string;
};

/**
 * Static strip for policy and feature claims (money-back guarantee, support hours, free migration, renewal price).
 * Icon, a short line and a link to the page that publishes its terms. No animation and no count-up: those are for
 * measured numbers only (StatsBar). A claim appears only when it passes the gate in content/claims.ts
 * (verified AND its terms page is published), so the link target always exists and has been reviewed.
 */
export default function AssuranceStrip({ ids, label = "Our commitments", claims, className }: AssuranceStripProps) {
  const headingId = useId();
  const items = (claims ?? verifiedClaims(ids).filter((c) => c.kind === "assurance")).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("py-10 sm:py-12", className)}>
      <h2 id={headingId} className="sr-only">
        {label}
      </h2>
      <div className="container-site">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c) => (
            <li key={c.id} data-claim={c.id} className="surface flex items-start gap-4 p-5">
              {c.icon && <FeatureIcon name={c.icon} />}
              <div className="min-w-0">
                <p className="text-base font-semibold text-foreground">{c.text}</p>
                {c.termsPage && (
                  <Link href={c.termsPage} className="mt-2 inline-flex min-h-9 items-center text-sm font-semibold text-link underline underline-offset-4">
                    {c.termsLabel ?? "Read the terms"}
                  </Link>
                )}
                {!c.verified && <p className="mt-2 text-xs font-semibold text-warning">Sample, hidden in production</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Showcase helper: the registry's assurance claims, forced on. */
export const SAMPLE_ASSURANCES = CLAIMS.filter((c) => c.kind === "assurance").slice(0, 4);
