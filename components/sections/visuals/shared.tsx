import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

/** Skeleton line used by illustrative visuals so no real-looking data appears. */
export function Line({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-border-strong", className)} />;
}

/** Soft framed canvas that hosts a split-section visual. aria-hidden; the copy carries the meaning. */
export function VisualFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative isolate overflow-hidden rounded-2xl border border-border bg-muted/50 p-5 sm:p-8", className)}>
      <div className="ambient-glow absolute inset-0 -z-10" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-50" />
      {children}
    </div>
  );
}

export function Toggle({ on = true }: { on?: boolean }) {
  return (
    <span className={cn("relative inline-flex h-5 w-9 shrink-0 rounded-full", on ? "bg-accent" : "bg-border-strong")}>
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow-sm", on ? "end-0.5" : "start-0.5")} />
    </span>
  );
}
