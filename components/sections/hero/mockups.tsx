import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/utils/cn";

/**
 * Illustrative interface mockups for heroes. Pure CSS/SVG, theme-aware, no data:
 * bars and shapes stand in for content so nothing here reads as a metric or claim.
 * Both are aria-hidden; the hero copy carries the meaning.
 */

function Bar({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-border-strong", className)} />;
}

function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
      </span>
      <span className="flex-1 truncate rounded-md bg-muted px-3 py-1 text-center text-xs text-subtle-foreground">{label}</span>
    </div>
  );
}

/** A site-management dashboard: navigation rail, trend chart and status tiles. */
export function SiteDashboardMockup({ className, tiles = ["Site", "Backups", "Support"] }: { className?: string; /** Three tile labels. Keep them to things the page can back up: the mockup is decoration, so it must not hint at an unverified feature such as speed or security scores. */ tiles?: readonly string[] }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <div className="surface surface-raised overflow-hidden !rounded-2xl shadow-xl">
        <WindowChrome label="yoursite.com" />
        <div className="grid grid-cols-[3.5rem_1fr]">
          <div className="space-y-3 border-e border-border bg-muted/60 p-3">
            <span className="block size-8 rounded-lg bg-accent/25 ring-1 ring-accent/40" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block size-8 rounded-lg bg-border" />
            ))}
          </div>
          <div className="min-w-0 space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <Bar className="w-28 !h-2.5 !bg-foreground/70" />
                <Bar className="w-20" />
              </div>
              <span className="hero-pill rounded-full border border-success/30 bg-success-surface px-2.5 py-1 text-[0.6875rem] font-semibold text-success">
                Online
              </span>
            </div>

            <div className="rounded-xl border border-border bg-card p-3">
              <svg viewBox="0 0 400 130" className="h-auto w-full" role="presentation" focusable="false">
                <defs>
                  <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[32, 64, 96].map((y) => (
                  <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
                ))}
                <path
                  className="hero-area"
                  d="M0 96 C40 90 60 62 100 66 S160 100 200 70 S270 28 310 44 S370 52 400 24 V130 H0 Z"
                  fill="url(#hero-area)"
                />
                <path
                  className="draw-line"
                  pathLength={1}
                  d="M0 96 C40 90 60 62 100 66 S160 100 200 70 S270 28 310 44 S370 52 400 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {tiles.slice(0, 3).map((label, i) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-subtle-foreground">{label}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                    <span className="bar-fill block h-full w-4/5 rounded-full bg-accent" style={{ "--d": `${450 + i * 120}ms` } as CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { label: "Clone your live site to staging", done: true },
  { label: "Update plugins and themes safely", done: true },
  { label: "Review the changes", done: true },
  { label: "Push to your live site", done: false },
];

/** A staging-to-live workflow: a private copy, a checklist and a final push step. */
export function StagingFlowMockup({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      <div className="surface surface-raised overflow-hidden !rounded-2xl shadow-xl">
        <WindowChrome label="staging.yoursite.com" />
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Bar className="w-32 !h-2.5 !bg-foreground/70" />
              <Bar className="w-24" />
            </div>
            <span className="rounded-full border border-accent/30 bg-accent/12 px-2.5 py-1 text-[0.6875rem] font-semibold text-link">
              Private copy
            </span>
          </div>

          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li
                key={step.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm",
                  step.done ? "border-border bg-card text-foreground" : "border-accent/40 bg-accent/10 text-foreground",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                    step.done ? "bg-success-surface text-success" : "bg-accent text-accent-foreground",
                  )}
                >
                  <span className="tick-in inline-flex" style={{ "--d": `${350 + i * 120}ms` } as CSSProperties}>
                    {step.done ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
                  </span>
                </span>
                <span className="min-w-0 flex-1 truncate">{step.label}</span>
              </li>
            ))}
          </ol>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <Bar className="w-24" />
            <span className="go-live relative inline-flex h-9 items-center rounded-lg bg-(--action-fill) px-4 text-sm font-semibold text-(--on-action)">Go live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
