import type { CSSProperties } from "react";
import { ArrowRight, Check, Cloud, Copy, Cpu, Database, Folder, Globe, HardDrive, MemoryStick, Palette, Plug, Server, ShieldCheck } from "lucide-react";
import type { ResourceTier } from "@/lib/pricing/plans";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

/*
 * Animated illustrations for product pages (app/styles/graphics.css). Each one plays once: on load above the fold, or
 * when its block scrolls into view (RevealObserver adds `.is-in`). The markup is the final state, so with reduced motion
 * or no JavaScript the picture is complete and still. All of them are decorative (aria-hidden); the copy carries the
 * meaning. Colours come from the theme tokens.
 */

/** The move to DronaHost: current host, the transfer, DronaHost, with the site travelling along the path. */
export function MoveFlowGraphic({ from, middle, to, caption }: { from: string; middle: string; to: string; caption: string }) {
  const stops = [
    { label: from, Icon: Server },
    { label: middle, Icon: ArrowRight },
    { label: to, Icon: Cloud },
  ];
  return (
    <figure {...reveal()} className="gx-scope mx-auto w-full max-w-3xl">
      <div aria-hidden="true" className="relative rounded-[1.75rem] border border-border bg-card/80 px-6 py-8 shadow-lg sm:px-10">
        <div className="relative grid grid-cols-3 items-start gap-2">
          <span className="absolute inset-x-[16%] top-7 h-px bg-border-strong" />
          <span className="gx-path absolute inset-x-[16%] top-7 h-px origin-left bg-accent" />
          <span className="gx-packet absolute top-7 -mt-2 size-4 rounded-full bg-[var(--action-fill)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--action-fill)_20%,transparent)]" />
          {stops.map(({ label, Icon }, i) => (
            <div key={label} className="relative flex flex-col items-center gap-3 text-center">
              <span
                className={cn(
                  "gx-stop grid size-14 place-items-center rounded-2xl border bg-surface-raised",
                  i === 2 ? "border-accent text-link" : "border-border text-muted-foreground",
                )}
                style={{ "--d": `${300 + i * 500}ms` } as CSSProperties}
              >
                <Icon className="size-6" strokeWidth={1.6} />
              </span>
              <span className="text-xs font-semibold text-foreground sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
        <p className="gx-live mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success-surface px-3 py-1 text-xs font-semibold text-success">
          <Globe className="size-3.5" strokeWidth={2} />
          {UI.graphics.dnsSwitched}
        </p>
      </div>
      <figcaption className="mt-3 text-center text-xs text-subtle-foreground">{caption}</figcaption>
    </figure>
  );
}

/** Three security layers as rings around a shield, drawing in one after another. */
export function ShieldVisual() {
  return (
    <div className="gx-scope relative grid size-36 place-items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="gx-ring absolute rounded-full border border-accent/50"
          style={{ inset: `${i * 14}px`, "--d": `${200 + (2 - i) * 260}ms` } as CSSProperties}
        />
      ))}
      <span className="gx-pop relative grid size-14 place-items-center rounded-2xl bg-accent text-[var(--brand-tint)] shadow-lg" style={{ "--d": "900ms" } as CSSProperties}>
        <ShieldCheck className="size-7" strokeWidth={1.8} />
      </span>
    </div>
  );
}

/** Two daily backups: the site copies to a local and an offsite store. */
export function BackupsVisual() {
  const t = UI.graphics;
  return (
    <div className="gx-scope w-full max-w-xs space-y-2.5">
      {[
        { label: t.backupLocal, Icon: HardDrive },
        { label: t.backupOffsite, Icon: Cloud },
      ].map(({ label, Icon }, i) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5">
          <Icon className="size-4 shrink-0 text-link" strokeWidth={1.8} />
          <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
          <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <span className="gx-fill absolute inset-y-0 start-0 w-full origin-left rounded-full bg-accent" style={{ "--d": `${300 + i * 450}ms` } as CSSProperties} />
          </span>
          <Check className="gx-pop size-4 text-success" strokeWidth={3} style={{ "--d": `${1100 + i * 450}ms` } as CSSProperties} />
        </div>
      ))}
    </div>
  );
}

/** A page assembling from builder blocks: header, hero, columns and a button, dropping into place. */
export function BuilderVisual() {
  const blocks = ["h-3 w-full", "h-10 w-full", "h-8 w-[48%]", "h-8 w-[48%]", "h-3 w-1/3"];
  return (
    <div className="gx-scope w-full max-w-[13rem] rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2">
        {blocks.map((cls, i) => (
          <span
            key={i}
            className={cn("gx-drop rounded-md", cls, i === 1 ? "bg-accent/30" : i === 4 ? "bg-[var(--action-fill)]" : "bg-muted")}
            style={{ "--d": `${200 + i * 180}ms` } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

/** The control panel's tools appearing one after another, all in one place. */
export function ControlPanelVisual() {
  const t = UI.graphics;
  const icons = [Folder, Database, Plug, Palette, Copy, HardDrive];
  return (
    <div className="gx-scope grid w-full max-w-xs grid-cols-3 gap-2">
      {t.panelTools.map((tool, i) => {
        const Icon = icons[i] ?? Folder;
        return (
          <span key={tool} className="gx-pop flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2.5 text-[0.6875rem] font-medium text-foreground" style={{ "--d": `${200 + i * 160}ms` } as CSSProperties}>
            <Icon className="size-4 text-link" strokeWidth={1.8} />
            {tool}
          </span>
        );
      })}
    </div>
  );
}

/** The work we do on a site, ticking off one task after another. Generic illustration, not a real account. */
export function CareVisual() {
  const t = UI.graphics;
  return (
    <div className="gx-scope w-full max-w-sm rounded-[1.375rem] border border-border bg-card p-5 shadow-lg">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="size-2 rounded-full bg-success" />
        {t.careTitle}
      </p>
      <ul className="mt-4 space-y-2.5">
        {t.careItems.map((item, i) => (
          <li key={item} className="gx-row flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm" style={{ "--d": `${250 + i * 260}ms` } as CSSProperties}>
            <span className="gx-pop grid size-6 shrink-0 place-items-center rounded-full bg-success-surface text-success" style={{ "--d": `${450 + i * 260}ms` } as CSSProperties}>
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="flex-1 text-foreground">{item}</span>
            <span className="text-xs font-semibold text-success">{t.careDone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Managed against shared: the same four tasks, ticked off by DronaHost in one lane and left to you in the other. */
export function ManagedVsSharedVisual() {
  const t = UI.graphics;
  return (
    <div className="gx-scope grid w-full max-w-md gap-3">
      {[
        { label: t.managedLane, done: true, Icon: ShieldCheck },
        { label: t.sharedLane, done: false, Icon: Server },
      ].map(({ label, done, Icon }, lane) => (
        <div key={label} className={cn("rounded-[1.375rem] border p-4", done ? "border-accent/50 bg-card shadow-lg" : "border-border bg-card/60")}>
          <p className={cn("flex items-center gap-2 text-sm font-semibold", done ? "text-link" : "text-muted-foreground")}>
            <Icon className="size-4" strokeWidth={1.8} />
            {label}
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {t.laneTasks.map((task, i) => (
              <li key={task} className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs text-foreground">
                {done ? (
                  <span className="gx-pop grid size-4 shrink-0 place-items-center rounded-full bg-accent text-[var(--brand-tint)]" style={{ "--d": `${400 + i * 250}ms` } as CSSProperties}>
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                ) : (
                  <span className="size-4 shrink-0 rounded border border-border-strong" style={{ opacity: lane ? 1 : 0 }} />
                )}
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** A visual page editor: a widget panel on the left, blocks dropping onto the canvas, then Publish. */
export function BuilderEditorVisual() {
  const t = UI.graphics;
  const canvas = [
    { cls: "h-4 w-1/2", tone: "bg-foreground/70" },
    { cls: "h-24 w-full", tone: "bg-accent/25" },
    { cls: "h-16 w-[48%]", tone: "bg-muted" },
    { cls: "h-16 w-[48%]", tone: "bg-muted" },
    { cls: "h-9 w-32", tone: "bg-[var(--action-fill)]" },
  ];
  return (
    <div className="gx-scope w-full max-w-xl overflow-hidden rounded-[1.375rem] border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{t.builderTitle}</span>
        <span className="gx-pop rounded-full bg-[var(--action-fill)] px-3 py-1 text-xs font-semibold text-[var(--on-action)]" style={{ "--d": "1700ms" } as CSSProperties}>
          {t.builderPublish}
        </span>
      </div>
      <div className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9rem_1fr]">
        <ul className="space-y-1.5 border-e border-border bg-muted/50 p-3">
          {t.builderWidgets.map((w, i) => (
            <li key={w} className="gx-row rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-medium text-foreground" style={{ "--d": `${150 + i * 120}ms` } as CSSProperties}>
              {w}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap content-start justify-between gap-2.5 p-4">
          {canvas.map((b, i) => (
            <span key={i} className={cn("gx-drop rounded-lg", b.cls, b.tone)} style={{ "--d": `${450 + i * 220}ms` } as CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Resources by plan: each plan's CPU cores and memory as bars that fill one after another, with its resource type. The
 * numbers come from data/pricing.json (passed in), so the picture changes when the plans do. Semi-dedicated and dedicated
 * plans are lit, as the business hosting page leads with them. Decorative: the plan cards and comparison carry the facts.
 */
/** `alt` makes the drawing an image for screen readers (page JSON `visual.alt`); `footnote` is one line under the tiers. */
export function ResourceTiersVisual({ tiers, caption, alt, footnote }: { tiers: readonly ResourceTier[]; caption?: string; alt?: string; footnote?: string }) {
  const t = UI.graphics;
  const maxCpu = Math.max(...tiers.map((x) => x.cpuCores), 1);
  const maxRam = Math.max(...tiers.map((x) => x.ramGB), 1);
  return (
    <figure {...reveal()} className="gx-scope relative mx-auto w-full max-w-lg">
      <span aria-hidden="true" className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side_at_70%_30%,var(--glow-teal),transparent),radial-gradient(closest-side_at_20%_80%,var(--glow-orange),transparent)] blur-2xl" />
      <div {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })} className="rounded-[1.75rem] border border-border bg-card/80 p-2 shadow-2xl backdrop-blur-sm">
        <div className="rounded-[1.375rem] bg-surface-raised p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{t.tiersTitle}</p>
            <p className="flex items-center gap-3 text-[0.6875rem] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Cpu className="size-3.5 text-link" strokeWidth={1.8} />{t.tiersCpu}</span>
              <span className="inline-flex items-center gap-1"><MemoryStick className="size-3.5 text-link" strokeWidth={1.8} />{t.tiersRam}</span>
            </p>
          </div>
          <ul className="mt-5 space-y-3">
            {tiers.map((tier, i) => (
              <li
                key={tier.id}
                className={cn("gx-row rounded-2xl border p-3.5", tier.highlight ? "border-accent/50 bg-card shadow-lg" : "border-border bg-card/60")}
                style={{ "--d": `${200 + i * 220}ms` } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-sm font-semibold text-foreground">{tier.name}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider", tier.highlight ? "border-accent/40 bg-accent/15 text-link" : "border-border text-muted-foreground")}>
                    {tier.type}
                  </span>
                </div>
                {[
                  { value: tier.cpuCores, max: maxCpu, unit: "", Icon: Cpu },
                  { value: tier.ramGB, max: maxRam, unit: " GB", Icon: MemoryStick },
                ].map(({ value, max, unit, Icon }, j) => (
                  <div key={j} className="mt-2.5 flex items-center gap-2.5">
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                    <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn("gx-fill absolute inset-y-0 start-0 origin-left rounded-full", tier.highlight ? "bg-accent" : "bg-foreground/35")}
                        style={{ width: `${(value / max) * 100}%`, "--d": `${400 + i * 220 + j * 120}ms` } as CSSProperties}
                      />
                    </span>
                    <span className="w-10 text-end text-[0.6875rem] font-semibold tabular-nums text-foreground">
                      {value}
                      {unit}
                    </span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
          {footnote && <p className="mt-4 border-t border-border pt-3 text-center text-[0.6875rem] font-semibold text-link">{footnote}</p>}
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-center text-xs text-subtle-foreground">{caption}</figcaption>}
    </figure>
  );
}

