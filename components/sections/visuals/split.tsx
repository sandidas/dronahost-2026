import { ArrowRight, Check, Lock, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { Line, Toggle, VisualFrame } from "./shared";

/**
 * Designed visuals for TwoColumn sections. Pure CSS/SVG and theme-aware. They illustrate a
 * workflow with shapes and short labels only: no figures, scores or customer data.
 */

const panel = "rounded-xl border border-border bg-card shadow-sm";

export function WordPressSettingsVisual() {
  const rows = ["Page cache", "SSL certificate", "Staging copy", "Automatic updates"];
  return (
    <VisualFrame>
      <div className={cn(panel, "mx-auto max-w-md overflow-hidden")}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="size-7 rounded-md bg-accent/25 ring-1 ring-accent/40" />
          <Line className="w-28 !h-2.5 !bg-foreground/70" />
        </div>
        <ul>
          {rows.map((label) => (
            <li key={label} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <Toggle />
            </li>
          ))}
        </ul>
      </div>
    </VisualFrame>
  );
}

export function MigrationVisual() {
  return (
    <VisualFrame>
      <div className="mx-auto flex max-w-lg flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <div className={cn(panel, "flex-1 p-4")}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-subtle-foreground">Your current host</p>
          <div className="mt-4 space-y-2.5">
            <Line className="w-full" />
            <Line className="w-4/5" />
            <Line className="w-3/5" />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-center text-link">
          <span className="flex size-10 items-center justify-center rounded-full border border-accent/30 bg-accent/12">
            <ArrowRight className="size-5 rotate-90 sm:rotate-0" strokeWidth={2} />
          </span>
        </div>
        <div className={cn(panel, "flex-1 border-accent/40 p-4")}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-link">DronaHost</p>
          <div className="mt-4 space-y-3">
            {["Files", "Database"].map((label) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <Check className="size-3.5 text-success" strokeWidth={3} />
                </div>
                <div className="h-1.5 rounded-full bg-border">
                  <span className="block h-full w-full rounded-full bg-accent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 flex max-w-lg items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
        <RefreshCw className="size-3.5" /> Review the copy, then switch your domain
      </p>
    </VisualFrame>
  );
}

export function ProtectionVisual() {
  const checks = ["Malware scanning", "Firewall rules", "Automatic backups"];
  return (
    <VisualFrame>
      <div className="mx-auto grid max-w-lg items-center gap-5 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto flex size-24 items-center justify-center rounded-2xl border border-accent/30 bg-accent/12 text-link sm:size-28">
          <ShieldCheck className="size-12 sm:size-14" strokeWidth={1.5} />
        </div>
        <ul className={cn(panel, "divide-y divide-border")}>
          {checks.map((label) => (
            <li key={label} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-surface text-success">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-5 flex max-w-lg items-center gap-2">
        <Lock className="size-4 shrink-0 text-link" />
        <div className="relative h-1 flex-1 rounded-full bg-border">
          {[8, 30, 52, 74, 96].map((left) => (
            <span key={left} className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-card bg-accent" style={{ insetInlineStart: `${left}%` }} />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Restore points</span>
      </div>
    </VisualFrame>
  );
}

export function SupportChannelsVisual() {
  return (
    <VisualFrame>
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex flex-wrap gap-2">
          {["Ticket", "Live chat", "WhatsApp"].map((label, i) => (
            <span
              key={label}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm font-semibold",
                i === 1 ? "border-accent/40 bg-accent/15 text-link" : "border-border bg-card text-muted-foreground",
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={cn(panel, "space-y-4 p-4")}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageCircle className="size-4" />
            </span>
            <div className="w-4/5 space-y-2 rounded-xl rounded-ss-sm bg-muted p-3">
              <Line className="w-full" />
              <Line className="w-2/3" />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-3/4 space-y-2 rounded-xl rounded-se-sm bg-accent/15 p-3 ring-1 ring-accent/25">
              <Line className="w-full !bg-accent/50" />
              <Line className="w-5/6 !bg-accent/50" />
              <Line className="w-1/2 !bg-accent/50" />
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
