import { ArrowRight, Check } from "lucide-react";
import { useId } from "react";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/link";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import { LuxeTitle } from "../luxe/LuxeHeader";
import HeroSiteForm, { type HeroFormCopy } from "./HeroSiteForm";
import type { HeroBaseProps } from "./types";

export type ConsoleTile = { label: string; value: string };
export type ConsoleStep = { title: string; note: string; state: "done" | "current" | "next" };
export type ConsoleCopy = {
  /** Header of the console window, for example "Migration · yourbusiness.com". */
  title: string;
  /** Status next to the title. */
  status: string;
  /** Visible caption that says the picture is an example. */
  caption: string;
  /** Up to three tiles, already gated by their claims. */
  tiles: readonly ConsoleTile[];
  /** Up to four steps. */
  steps: readonly ConsoleStep[];
};
/** One line of the assurance rail under the hero: a rendering claim and the page that states its terms. */
export type HeroAssurance = { title: string; href: string; linkLabel: string };

export type ConsoleHeroProps = Omit<HeroBaseProps, "highlights" | "note"> & {
  /** The one-field form. When set it replaces the primary button; the secondary action stays as a quiet link. */
  form?: HeroFormCopy;
  console: ConsoleCopy;
  assurances?: readonly HeroAssurance[];
};

const STATE_CLASS: Record<ConsoleStep["state"], { row: string; dot: string; tag: string }> = {
  done: { row: "", dot: "bg-link text-ink border border-link", tag: "text-link" },
  current: { row: "bg-action/10", dot: "bg-action text-ink border border-action", tag: "text-action" },
  next: { row: "", dot: "border border-dashed border-border-strong", tag: "text-subtle-foreground" },
};

/** The decorative product console: a migration in progress. Hidden from assistive technology; the caption says it is an example. */
function ConsoleVisual({ title, status, caption, tiles, steps }: ConsoleCopy) {
  const reached = steps.findIndex((s) => s.state !== "done");
  const position = reached === -1 ? steps.length : steps[reached]?.state === "current" ? reached + 1 : reached;
  const pct = steps.length ? Math.round((position / steps.length) * 100) : 0;
  return (
    <figure className="relative min-w-0">
      <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_45%,var(--glow-teal),transparent)]" aria-hidden="true" />
      <div aria-hidden="true" className="console-frame">
        <div className="console-body">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <span className="truncate font-heading text-[0.9375rem] font-medium text-foreground">{title}</span>
            <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-link">
              <span className="size-[7px] rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]" />
              {status}
            </span>
          </div>
          {tiles.length > 0 && (
            <div className={cn("grid gap-2.5 px-5 pt-6 sm:gap-3 sm:px-6", tiles.length === 3 ? "grid-cols-3" : tiles.length === 2 ? "grid-cols-2" : "grid-cols-1")}>
              {tiles.map((t) => (
                <div key={t.label} className="min-w-0 rounded-2xl border border-border p-2.5 sm:p-3.5">
                  <div className="text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.08em] text-subtle-foreground sm:text-[0.6875rem] sm:tracking-[0.14em]">{t.label}</div>
                  <div className="mt-1.5 whitespace-nowrap font-heading text-lg font-normal tracking-[-0.02em] text-foreground first-letter:uppercase sm:text-2xl">{t.value}</div>
                </div>
              ))}
            </div>
          )}
          {steps.length > 0 && (
            <>
              <div className="px-5 pt-5 sm:px-6">
                <div className="mb-2.5 flex justify-between text-[0.8125rem] text-subtle-foreground">
                  <span>{UI.console.progress}</span>
                  <span>{UI.console.stepOf(Math.max(position, 1), steps.length)}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-border">
                  <div className="console-progress h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <ol className="px-2 pb-3 pt-3.5">
                {steps.map((s) => (
                  <li key={s.title} className={cn("flex items-center gap-3.5 rounded-2xl px-3 py-3 sm:px-4", STATE_CLASS[s.state].row)}>
                    <span className={cn("grid size-[26px] flex-none place-items-center rounded-full", STATE_CLASS[s.state].dot)}>
                      {s.state !== "next" && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold text-foreground">{s.title}</span>
                      <span className="block text-[0.8125rem] text-subtle-foreground">{s.note}</span>
                    </span>
                    <span className={cn("hidden shrink-0 text-xs font-semibold min-[400px]:inline", STATE_CLASS[s.state].tag)}>{UI.console.state[s.state]}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-subtle-foreground">{caption}</figcaption>
    </figure>
  );
}

/**
 * ProductHero, "console" variant: an ink band with a fine dot texture and soft light, a very large light headline with a
 * heavier closing phrase, the one-field migration form (or the two actions), the product console, and a hairline rail of the
 * commitments that render. No entrance animation: everything here is above the fold.
 */
export default function ConsoleHero({ eyebrow, title, titleAccent, description, primaryCta, secondaryCta, form, console: consoleCopy, assurances = [], headingLevel = "h1", className }: ConsoleHeroProps) {
  const headingId = useId();
  const Heading = headingLevel;
  return (
    <section aria-labelledby={headingId} className={cn("luxe-band luxe-glow dot-field", className)}>
      <div className="container-site grid items-center gap-14 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow-rule">{eyebrow}</p>}
          <Heading id={headingId} className={cn("t-luxe-display", eyebrow && "mt-6")}>
            <LuxeTitle title={titleAccent ? `${title} ${titleAccent}` : title} accent={titleAccent} />
          </Heading>
          <p className="t-luxe-lead mt-6 max-w-[38rem]">{description}</p>
          {form ? (
            <>
              <HeroSiteForm {...form} className="mt-10" />
              {secondaryCta && (
                <p className="mt-3 ps-5">
                  <Link href={secondaryCta.href} className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-link link-quiet">
                    {secondaryCta.label}
                    <ArrowRight className="arrow-nudge size-4" aria-hidden="true" />
                  </Link>
                </p>
              )}
            </>
          ) : (
            (primaryCta || secondaryCta) && (
              <div className="mt-10 flex flex-wrap items-center gap-3">
                {primaryCta && (
                  <Button href={primaryCta.href} size="lg" className="btn-glow rounded-full" trailingIcon={<ArrowRight className="arrow-nudge size-[1.125rem]" aria-hidden="true" />}>
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button href={secondaryCta.href} variant="secondary" size="lg" className="rounded-full bg-transparent">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )
          )}
        </div>
        <ConsoleVisual {...consoleCopy} />
      </div>
      {assurances.length > 0 && (
        <div className="border-t border-border">
          <ul aria-label={UI.luxe.assurances} className="container-site grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
            {assurances.map((a) => (
              <li key={a.title} className="flex flex-col gap-1 border-s border-link/35 ps-[1.125rem]">
                <span className="font-heading text-[1.0625rem] font-normal text-foreground first-letter:uppercase">{a.title}</span>
                <Link href={a.href} className="t-small self-start text-subtle-foreground link-quiet hover:text-foreground">
                  {a.linkLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
