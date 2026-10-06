"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type TooltipProps = { text: string; children: ReactNode; className?: string };

/**
 * Supplementary hint for a focusable trigger (WCAG 1.4.13): shows on hover and keyboard focus,
 * stays open while the pointer is over it, and Escape dismisses it. Never put essential
 * information here; it is not available on touch without focus.
 */
export default function Tooltip({ text, children, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>
      <span
        role="tooltip"
        id={id}
        hidden={!open}
        className="t-small pointer-events-auto absolute start-1/2 bottom-full z-30 mb-2 w-max max-w-64 -translate-x-1/2 rounded-lg border border-border-strong bg-card px-3 py-2 text-card-foreground shadow-lg rtl:translate-x-1/2"
      >
        {text}
      </span>
    </span>
  );
}
