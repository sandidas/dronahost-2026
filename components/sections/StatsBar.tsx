const stats = [
  {
    value: "99.95%",
    label: "Uptime SLA",
    note: "with service credits",
  },
  {
    value: "< 200ms",
    label: "Avg. TTFB",
    note: "London · New York · Dubai",
  },
  {
    value: "18 min",
    label: "Avg. first reply",
    note: "24/7 across US/UK/UAE",
  },
  {
    value: "2019",
    label: "Founded",
    note: "5+ years serving businesses",
  },
];

export default function StatsBar() {
  return (
    <div
      className="bg-slate-900 dark:bg-slate-950"
      aria-label="Service performance statistics"
    >
      <dl className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-slate-700 sm:grid-cols-4 sm:divide-y-0 px-4 sm:px-6 lg:px-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center px-6 py-8 text-center"
            aria-label={`${stat.value} ${stat.label} — ${stat.note}`}
          >
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {stat.label}
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-slate-500">{stat.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
