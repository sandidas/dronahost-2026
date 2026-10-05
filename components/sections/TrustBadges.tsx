import { ACCEPTED_PAYMENT_METHODS } from "@/content/claims";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

type TrustBadgesProps = {
  /** Showcase only: also render payment methods that are not yet verified. */
  showSamples?: boolean;
};

/**
 * Accepted payment methods only. Payment brands are shown as methods the
 * checkout accepts, never as trust or endorsement marks. Trust claims
 * (guarantee, reviews, CDN) live in `content/claims.ts` and render elsewhere
 * once verified.
 */
export default function TrustBadges({ showSamples = false }: TrustBadgesProps) {
  const methods = ACCEPTED_PAYMENT_METHODS.filter((m) => showSamples || m.verified);
  if (methods.length === 0) return null;

  return (
    <section
      className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      aria-labelledby="payment-methods-heading"
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <h2
          id="payment-methods-heading"
          className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300"
        >
          Accepted payment methods
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {methods.map((method) => (
            <li key={method.id} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <LockIcon />
              {method.label}
              {!method.verified && <span className="text-xs text-amber-600">(unverified)</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
