import { Lock } from "lucide-react";
import { useId } from "react";
import { ACCEPTED_PAYMENT_METHODS } from "@/content/claims";

type TrustBadgesProps = {
  /** Showcase only: also render payment methods that are not yet verified. */
  showSamples?: boolean;
};

/**
 * Accepted payment methods only. Payment brands are shown as methods the checkout accepts,
 * never as trust or endorsement marks. Trust claims live in content/trust.ts.
 */
export default function TrustBadges({ showSamples = false }: TrustBadgesProps) {
  const headingId = useId();
  const methods = ACCEPTED_PAYMENT_METHODS.filter((m) => showSamples || m.verified);
  if (methods.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="border-y border-border bg-card/60">
      <div className="container-site flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
        <h2 id={headingId} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accepted payment methods
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {methods.map((m) => (
            <li key={m.id} className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lock className="size-4 text-link" aria-hidden="true" />
              {m.label}
              {!m.verified && <span className="text-xs font-semibold text-warning">(unverified)</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
