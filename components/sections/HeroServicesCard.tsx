"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const services = [
  {
    label: "Host a WordPress site",
    href: "/wordpress-hosting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    label: "Transfer from any host",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4 4 4" />
        <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
      </svg>
    ),
  },
  {
    label: "Launch an online store",
    href: "/wordpress-hosting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Build a custom website",
    href: "/web-design",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "Rank higher on Google",
    href: "/seo-services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    label: "Register a domain",
    href: "/domains",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
] as const;

export default function HeroServicesCard() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % services.length),
      2500,
    );
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-slate-200/60 bg-white/85 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Choose what you want to do"
    >
      <div className="flex flex-col gap-1.5">
        {services.map((svc, i) => {
          const isActive = i === active;
          return (
            <Link
              key={svc.label}
              href={svc.href}
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isActive
                  ? "bg-slate-900 px-4 py-4 dark:bg-white/15"
                  : "bg-slate-100/60 px-4 py-2.5 opacity-50 hover:opacity-80 dark:bg-white/[0.04]",
              )}
            >
              {/* Icon */}
              <span
                className={cn(
                  "shrink-0 transition-all duration-500",
                  isActive
                    ? "h-[22px] w-[22px] text-white"
                    : "h-[17px] w-[17px] text-slate-500 dark:text-slate-400",
                )}
                aria-hidden="true"
              >
                {svc.icon}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "flex-1 font-medium transition-all duration-500",
                  isActive
                    ? "text-base text-white"
                    : "text-sm text-slate-600 dark:text-slate-300",
                )}
              >
                {svc.label}
              </span>

              {/* Checkmark — always rendered, transitions in/out */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isActive
                    ? "scale-100 bg-emerald-500 opacity-100"
                    : "scale-75 opacity-0",
                )}
                aria-hidden="true"
              >
                <svg
                  width="10" height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
