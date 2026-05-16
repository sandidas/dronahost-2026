"use client";

import { useEffect, useState } from "react";

const R = 30;
const CIRC = 2 * Math.PI * R; // 188.5

const scores = [
  { label: "Performance", value: 98,  color: "#22c55e", delay: 100 },
  { label: "SEO",         value: 100, color: "#22c55e", delay: 380 },
  { label: "Speed",       value: 95,  color: "#22c55e", delay: 660 },
] as const;

type ScoreProps = (typeof scores)[number];

function ScoreRing({ label, value, color, delay }: ScoreProps) {
  const [active, setActive] = useState(false);
  const [count, setCount]   = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setActive(true);
      let n = 0;
      const ticker = setInterval(() => {
        n = Math.min(n + 3, value);
        setCount(n);
        if (n >= value) clearInterval(ticker);
      }, 18);
      return () => clearInterval(ticker);
    }, delay);
    return () => clearTimeout(t);
  }, [delay, value]);

  const dashOffset = CIRC * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[68px] w-[68px]">
        <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
          {/* Track */}
          <circle
            cx="34" cy="34" r={R}
            fill="none" strokeWidth="5"
            className="stroke-slate-100 dark:stroke-white/[0.08]"
          />
          {/* Animated fill */}
          <circle
            cx="34" cy="34" r={R}
            fill="none" strokeWidth="5"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={active ? dashOffset : CIRC}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-heading)] text-[18px] font-bold leading-none text-slate-900 dark:text-white">
          {count}
        </span>
      </div>
      <span className="text-center text-[11px] text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

export default function HeroPerformanceCard() {
  const [phase, setPhase]         = useState<"scanning" | "ready">("scanning");
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    // Double-rAF so the element is painted at w-0 before the transition fires
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setScanActive(true))
    );
    const t = setTimeout(() => setPhase("ready"), 680);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  return (
    <div className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200/60 bg-white/85 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">

      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/60 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400"     aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400"   aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded-md bg-white/70 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-white/10 dark:text-slate-400">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-emerald-500" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          dronahost-demo.com
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {phase === "scanning" ? (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" aria-hidden="true" />
              Analyzing website performance…
            </div>

            {/* Scan bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                style={{
                  width: scanActive ? "100%" : "0%",
                  transition: "width 0.58s ease-out",
                }}
              />
            </div>

            {/* Skeleton rows */}
            <div className="mt-1 space-y-2.5">
              {([78, 55, 88] as const).map((w, i) => (
                <div
                  key={i}
                  className="h-2 animate-pulse rounded-full bg-slate-100 dark:bg-white/10"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Lighthouse audit complete
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                All green
              </span>
            </p>

            <div className="flex items-start justify-between">
              {scores.map((s) => (
                <ScoreRing key={s.label} {...s} />
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-200/60 pt-3.5 dark:border-white/10">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Tested 2 seconds ago · 99.95% uptime this month
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
