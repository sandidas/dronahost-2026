import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { Line } from "./shared";

/** Compact visuals for BentoGrid tiles. Shapes and short labels only. */

export function CacheVisual() {
  const bars = [38, 64, 46, 82, 58, 94, 70];
  return (
    <div className="flex h-28 w-full max-w-xs items-end gap-2.5">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-t-md", i === 5 ? "bg-accent" : "bg-accent/30")}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function GrowthVisual() {
  const steps = ["Managed", "Cloud", "VPS"];
  return (
    <div className="flex w-full max-w-xs items-end gap-3">
      {steps.map((label, i) => (
        <div key={label} className="flex-1 text-center">
          <div
            className={cn("rounded-lg border", i === 2 ? "border-accent/50 bg-accent/20" : "border-border bg-card")}
            style={{ height: `${44 + i * 28}px` }}
          />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function RestoreVisual() {
  return (
    <div className="w-full max-w-xs space-y-3">
      {["Before update", "After update"].map((label, i) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
          <span className={cn("flex size-6 items-center justify-center rounded-full", i === 0 ? "bg-success-surface text-success" : "bg-accent/20 text-link")}>
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
          <Line className="w-10" />
        </div>
      ))}
    </div>
  );
}

export function ChannelsVisual() {
  return (
    <div className="flex w-full max-w-xs flex-wrap justify-center gap-2.5">
      {["Ticket", "Follow-up", "Resolved"].map((label) => (
        <span key={label} className="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm">
          {label}
        </span>
      ))}
    </div>
  );
}

/** A month of daily uptime bars, all up: the picture behind the uptime SLA tile. Decorative, no figures. */
export function UptimeVisual() {
  return (
    <div className="flex h-16 w-full max-w-xs items-end gap-1" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => (
        <span key={i} className={cn("flex-1 rounded-sm bg-success/70", i % 7 === 3 ? "h-full" : "h-[85%]")} />
      ))}
    </div>
  );
}

/** A site moving from its current host to DronaHost, for the free migration tile. */
export function MoveVisual() {
  return (
    <div className="flex w-full max-w-xs items-center gap-2.5">
      <span className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-border bg-card px-3 text-sm font-medium text-muted-foreground">Current host</span>
      <span aria-hidden="true" className="h-px w-8 bg-accent" />
      <span className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-accent/50 bg-accent/20 px-3 text-sm font-semibold text-foreground">DronaHost</span>
    </div>
  );
}
