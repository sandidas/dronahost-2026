import { useId } from "react";
import { UI } from "@/content/strings";
import { longDate } from "@/components/sections/bespoke/PageProvenance";
import { cn } from "@/utils/cn";
import BannerShell, { indexNo, Kicker, PrimaryAction, QuietLink } from "./BannerShell";

export type VerdictOption = { name: string; bestFor: string; href?: string };

export type VerdictBannerProps = {
  eyebrow?: string;
  /** Both options in the heading: "DronaHost vs Example Host". */
  title: string;
  /** One sentence that says which to choose when. First on the page. */
  verdict: string;
  /** ISO date the facts were read. A comparison without a date is not trusted. */
  checkedOn: string;
  /** The criteria used, as short labels. Shown as a scoreboard row. */
  criteria?: readonly string[];
  /** The two options with who each suits. Needed for the `split` layout. */
  options?: readonly [VerdictOption, VerdictOption];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** split = the band is cut in two, navy and paper, with a seal on the line · ribbon = the verdict as a full-width ribbon. */
  layout?: "split" | "ribbon";
  /** Ribbon colour: teal or navy. */
  ribbon?: "teal" | "ink";
  headingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Commercial intent, banner 1, "split screen": the two options face each other on a band cut in half (navy and paper),
 * a round "vs" seal on the cut, the verdict on a ribbon across both halves and the criteria on a scoreboard with the date
 * the facts were checked. Both sides get the same space and an honest "best for".
 */
export default function VerdictBanner({ eyebrow, title, verdict, checkedOn, criteria, options, primaryCta, secondaryCta, layout = "split", ribbon = "teal", headingLevel = "h1", className }: VerdictBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const Sub = headingLevel === "h1" ? "h2" : "h3";
  const split = layout === "split" && Boolean(options);

  const ribbonBand = (
    <div className={cn("relative z-10", ribbon === "teal" ? "bg-accent text-accent-foreground" : "dark bg-background text-foreground")}>
      <div className="container-site flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8">
        <p className="t-meta shrink-0 opacity-80">{UI.banners.verdict}</p>
        <p className="font-heading text-lg leading-snug tracking-[-0.015em] text-pretty sm:text-xl">{verdict}</p>
      </div>
    </div>
  );

  const scoreboard = (
    <div className="container-site">
      <div className="flex flex-col gap-4 border-b border-border py-6 lg:flex-row lg:items-center lg:justify-between">
        {criteria && criteria.length > 0 ? (
          <ul aria-label={UI.banners.criteria} className="flex flex-wrap">
            {criteria.map((c, i) => (
              <li key={c} className="flex items-center gap-2 border-e border-border px-4 py-1 first:ps-0 last:border-e-0">
                <span className="tabular-nums text-[0.6875rem] text-link">{indexNo(i)}</span>
                <span className="t-meta text-foreground">{c}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}
        <p className="t-meta shrink-0 text-muted-foreground">
          {UI.banners.checkedOn} <time dateTime={checkedOn}>{longDate(checkedOn)}</time>
        </p>
      </div>
    </div>
  );

  const actions = (primaryCta || secondaryCta) && (
    <div className="container-site flex flex-wrap items-center gap-x-8 gap-y-4 pt-8">
      {primaryCta && <PrimaryAction href={primaryCta.href}>{primaryCta.label}</PrimaryAction>}
      {secondaryCta && <QuietLink href={secondaryCta.href}>{secondaryCta.label}</QuietLink>}
    </div>
  );

  if (split && options) {
    const half = (o: VerdictOption, i: number) => (
      <div className={cn("relative px-[var(--gutter)] py-16 sm:py-20 lg:py-24", i === 0 ? "dark band-ink lg:ps-[max(var(--gutter),calc((100vw-var(--container-max))/2+var(--gutter)))] lg:pe-20" : "light bg-background lg:pe-[max(var(--gutter),calc((100vw-var(--container-max))/2+var(--gutter)))] lg:ps-20")}>
        <p className="t-meta text-muted-foreground">{indexNo(i)}</p>
        <Sub className="mt-5 font-heading text-[clamp(2.25rem,1.5rem+2.6vw,3.75rem)] leading-none tracking-[-0.04em] text-foreground">{o.name}</Sub>
        <p className="t-meta mt-10 text-link">{UI.banners.bestFor}</p>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-foreground">{o.bestFor}</p>
      </div>
    );
    return (
      <BannerShell headingId={headingId} size="none" bleed className={cn("bg-background pb-12", className)}>
        <div className="container-site pb-12 pt-20 text-center sm:pt-24">
          {eyebrow && (
            <Kicker center className="mb-6">
              {eyebrow}
            </Kicker>
          )}
          <Heading id={headingId} className="t-statement-sm text-foreground">
            {title}
          </Heading>
        </div>
        <div className="relative grid lg:grid-cols-2">
          {half(options[0], 0)}
          {half(options[1], 1)}
          <span aria-hidden="true" className="light absolute start-1/2 top-1/2 z-10 hidden size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border-strong bg-background font-heading text-4xl text-foreground shadow-xl lg:grid rtl:translate-x-1/2">
            <span className="absolute inset-1.5 rounded-full border border-dashed border-accent/60" />
            {UI.banners.vs}
          </span>
        </div>
        {ribbonBand}
        {scoreboard}
        {actions}
      </BannerShell>
    );
  }

  return (
    <BannerShell headingId={headingId} size="none" bleed className={cn("bg-background pb-12", className)}>
      <div className="container-site pb-14 pt-20 sm:pt-28">
        {eyebrow && <Kicker className="mb-6">{eyebrow}</Kicker>}
        <Heading id={headingId} className="t-statement max-w-5xl text-foreground">
          {title}
        </Heading>
      </div>
      {ribbonBand}
      {scoreboard}
      {actions}
    </BannerShell>
  );
}
