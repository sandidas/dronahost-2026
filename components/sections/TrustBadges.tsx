import { Fragment } from "react";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M8 18h8a4 4 0 0 0 .7-7.93A5.5 5.5 0 0 0 6.2 8.2 3.8 3.8 0 0 0 8 18z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RefundIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const badges = [
  {
    label: "Stripe",
    sublabel: "Secure payments",
    icon: <LockIcon />,
  },
  {
    label: "PayPal",
    sublabel: "Accepted",
    icon: <ShieldIcon />,
  },
  {
    label: "Let's Encrypt",
    sublabel: "Free SSL",
    icon: <LockIcon />,
  },
  {
    label: "Cloudflare",
    sublabel: "CDN & DDoS protection",
    icon: <CloudIcon />,
  },
  {
    label: "Trustpilot",
    sublabel: "Verified reviews",
    icon: <StarIcon />,
  },
  {
    label: "30-Day Guarantee",
    sublabel: "Money-back, no questions",
    icon: <RefundIcon />,
  },
];

export default function TrustBadges() {
  return (
    <div
      className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      aria-label="Trust and payment signals"
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Trusted infrastructure &amp; secure payments
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {badges.map((badge, index) => (
            <Fragment key={badge.label}>
              {index > 0 && (
                <span
                  className="hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block"
                  aria-hidden="true"
                />
              )}
              <span className="flex flex-col items-center gap-0.5 text-center sm:flex-row sm:gap-1.5 sm:text-left">
                <span className="text-slate-400 dark:text-slate-500">{badge.icon}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {badge.label}
                </span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
