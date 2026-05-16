"use client";

import { useEffect, useRef, useState } from "react";

// ─── Typewriter ───────────────────────────────────────────────────────────────

const DEMO_DOMAINS = [
  "yourbusiness.com",
  "myshop.co.uk",
  "mybrand.ae",
  "yourstore.com",
] as const;

function useTypewriter(words: readonly string[]) {
  const [text, setText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stRef = useRef({
    wi: 0,
    ci: 0,
    phase: "typing" as "typing" | "hold" | "deleting",
  });

  useEffect(() => {
    function tick() {
      const s = stRef.current;
      const word = words[s.wi];

      if (s.phase === "typing") {
        s.ci++;
        setText(word.slice(0, s.ci));
        if (s.ci >= word.length) {
          s.phase = "hold";
          timerRef.current = setTimeout(tick, 1900);
        } else {
          timerRef.current = setTimeout(tick, 75);
        }
      } else if (s.phase === "hold") {
        s.phase = "deleting";
        timerRef.current = setTimeout(tick, 50);
      } else {
        s.ci = Math.max(0, s.ci - 1);
        setText(word.slice(0, s.ci));
        if (s.ci <= 0) {
          s.wi = (s.wi + 1) % words.length;
          s.phase = "typing";
          timerRef.current = setTimeout(tick, 380);
        } else {
          timerRef.current = setTimeout(tick, 38);
        }
      }
    }

    timerRef.current = setTimeout(tick, 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [words]);

  return text;
}

// ─── Visitor counter ─────────────────────────────────────────────────────────

function useVisitorCounter(initial: number) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.4) setCount((c) => c + 1);
    }, 1300);
    return () => clearInterval(t);
  }, []);
  return count;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroDashboardCard() {
  const domain   = useTypewriter(DEMO_DOMAINS);
  const visitors = useVisitorCounter(1_247);

  return (
    <div className="w-full max-w-[360px]">
      {/* 1-px gradient border */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/50 via-purple-500/25 to-slate-700/20 p-[1px] shadow-2xl shadow-indigo-500/10">
        <div className="relative overflow-hidden rounded-2xl bg-slate-950">

          {/* Subtle top-of-card radial glow */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18), transparent)",
            }}
            aria-hidden="true"
          />

          {/* ── Header bar ── */}
          <div className="relative flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-2">
              {/* Hexagon logo mark */}
              <svg
                width="15" height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-indigo-400"
                aria-hidden="true"
              >
                <polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                DronaHost
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Live
            </span>
          </div>

          {/* ── Domain typewriter ── */}
          <div className="relative border-b border-white/[0.06] px-4 py-3.5">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-600">
              Active site
            </p>
            {/* min-h keeps the row stable while the typewriter is empty */}
            <p className="min-h-[24px] font-[family-name:var(--font-heading)] text-[15px] font-semibold text-white">
              {domain}
              <span className="animate-pulse text-indigo-400" aria-hidden="true">
                |
              </span>
            </p>
          </div>

          {/* ── Metrics ── */}
          <div className="relative grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
            <div className="flex flex-col gap-0.5 px-3.5 py-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Visitors
              </p>
              <p className="font-[family-name:var(--font-heading)] text-xl font-bold tabular-nums text-white">
                {visitors.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400">↑ today</p>
            </div>

            <div className="flex flex-col gap-0.5 px-3.5 py-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Speed
              </p>
              <p className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                200ms
              </p>
              <p className="text-[10px] text-emerald-400">Top 3% global</p>
            </div>

            <div className="flex flex-col gap-0.5 px-3.5 py-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Uptime
              </p>
              <p className="font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                99.97%
              </p>
              <p className="text-[10px] text-emerald-400">0 incidents</p>
            </div>
          </div>

          {/* ── Action pills ── */}
          <div className="relative flex items-center gap-2 px-4 py-3.5">
            <span className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-slate-400">
              Deploy
            </span>
            <span className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-slate-400">
              Backup
            </span>
            <span className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
              SSL ✓
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
