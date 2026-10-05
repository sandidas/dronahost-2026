import { verifiedClaims, type Claim } from "@/content/claims";

type StatsBarProps = {
  /** Claim ids to display, in order. Defaults to every verified claim. */
  ids?: readonly string[];
  /** Accessible name for the region. */
  label?: string;
  /** Showcase only: renders the supplied claims even when unverified, with a label. */
  claims?: readonly Claim[];
};

/**
 * Stats strip driven by `content/claims.ts`. Renders nothing until at least one
 * claim is marked verified, so no unproven number can reach a public page.
 */
export default function StatsBar({ ids, label = "Service statistics", claims }: StatsBarProps) {
  const stats = claims ?? verifiedClaims(ids);
  if (stats.length === 0) return null;

  return (
    <section className="bg-slate-900 dark:bg-slate-950" aria-label={label}>
      <dl className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-slate-700 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-300">{stat.label}</dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</dd>
            {stat.note && <dd className="mt-1 text-xs text-slate-300">{stat.note}</dd>}
            {!stat.verified && <dd className="mt-1 text-xs font-semibold text-amber-300">Sample, unverified</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
