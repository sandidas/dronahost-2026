import { Check, ChevronDown, Copy, Database, FileText, Folder, Globe, Layers, Lock, Palette, Plug, RotateCcw, Server, BarChart3, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";

const NAV_ICONS: readonly LucideIcon[] = [Globe, Folder, Database, BarChart3, Layers];
const TOOL_ICONS: readonly LucideIcon[] = [Folder, Plug, Palette, Database, Copy, FileText, RotateCcw];

/** A small on switch, drawn in CSS. Decorative. */
function Toggle({ delay = 900 }: { delay?: number }) {
  return (
    <span className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-accent">
      <span className="gx-toggle absolute end-0.5 size-3 rounded-full bg-surface-raised" style={{ "--d": `${delay}ms` } as CSSProperties} />
    </span>
  );
}

function PanelTitle({ children }: { children: string }) {
  return <p className="font-heading text-sm font-medium text-foreground">{children}</p>;
}

/**
 * The hosting control panel a WordPress customer uses, drawn in code and modeled on the real Plesk dashboard (owner
 * screenshot, 2026-10-11) with no customer data. Labels come from `UI.panelMockup`; the domain and the caption from the
 * page JSON. With `alt` (page JSON `visual.alt`) the picture is an image for screen readers; without it, it is aria-hidden. The
 * visible caption says it is an illustration. Follows the theme.
 */
export function PanelMockup({ domain, caption, alt, className }: { domain: string; caption: string; alt?: string; className?: string }) {
  const t = UI.panelMockup;
  return (
    <figure className={cn("relative", className)}>
      <div {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })} className="surface surface-raised overflow-hidden !rounded-2xl text-[0.6875rem] shadow-xl sm:text-xs">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="grid grid-cols-[2.75rem_1fr] sm:grid-cols-[9.5rem_1fr]">
          <nav className="space-y-1 border-e border-border bg-muted/60 p-2">
            {t.nav.map((label, i) => {
              const Icon = NAV_ICONS[i] ?? Globe;
              return (
                <span key={label} className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground", i === 0 && "bg-card text-foreground")}>
                  <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="hidden truncate sm:inline">{label}</span>
                </span>
              );
            })}
          </nav>
          <div className="min-w-0 space-y-3 p-3 sm:p-4">
            <p className="font-heading text-base font-light text-foreground sm:text-lg">{t.title}</p>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <span className="flex min-w-0 items-center gap-2">
                <ChevronDown className="size-3.5 shrink-0 text-subtle-foreground" />
                <span className="truncate font-semibold text-foreground">{domain}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-success">
                <span className="size-1.5 rounded-full bg-success" />
                {t.active}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex gap-4 border-b border-border pb-2">
                {t.tabs.map((tab, i) => (
                  <span key={tab} className={cn("whitespace-nowrap", i === 0 ? "border-b-2 border-accent pb-1 font-semibold text-foreground" : "text-muted-foreground", i === 2 && "hidden sm:inline")}>
                    {tab}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-link">
                {t.tools.map((tool, i) => {
                  const Icon = TOOL_ICONS[i] ?? Folder;
                  return (
                    <span key={tool} className="inline-flex items-center gap-1">
                      <Icon className="size-3" strokeWidth={1.75} />
                      {tool}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <PanelTitle>{t.updatesTitle}</PanelTitle>
                  {t.updates.map(([name, state], i) => (
                    <p key={name} className="gx-row flex items-center justify-between gap-2" style={{ "--d": `${400 + i * 220}ms` } as CSSProperties}>
                      <span className="text-muted-foreground">{name}</span>
                      <span className="inline-flex items-center gap-1 text-success">
                        <Check className="tick-in size-3" strokeWidth={2.5} style={{ "--d": `${700 + i * 220}ms` } as CSSProperties} />
                        {state}
                      </span>
                    </p>
                  ))}
                  <div className="pt-2">
                    <PanelTitle>{t.performanceTitle}</PanelTitle>
                  </div>
                  {t.performance.map((p) => (
                    <p key={p} className="flex items-center gap-2 text-muted-foreground">
                      <Toggle delay={1900} />
                      <Zap className="size-3" strokeWidth={1.75} />
                      {p}
                    </p>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <PanelTitle>{t.securityTitle}</PanelTitle>
                  {t.security.map((item, i) => (
                    <p key={item} className="gx-row flex items-center gap-2 text-muted-foreground" style={{ "--d": `${500 + i * 220}ms` } as CSSProperties}>
                      {i === 0 ? <Lock className="size-3 text-success" strokeWidth={2} /> : <Toggle delay={1000 + i * 250} />}
                      {i === 0 ? null : i === 3 ? <ShieldCheck className="size-3" strokeWidth={1.75} /> : <Server className="size-3" strokeWidth={1.75} />}
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-subtle-foreground">{caption}</figcaption>
    </figure>
  );
}
