import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, currencySymbol, Kicker, PrimaryAction, QuietLink, SCOPE } from "./BannerShell";
import Ticket from "./Ticket";

export type RegionFact = { label: string; value: string };

export type RegionBannerProps = {
  eyebrow?: string;
  /** "WordPress hosting for UK businesses". Never "UK servers" unless the infrastructure registry confirms it. */
  title: string;
  description: string;
  /** The reader's region as a short code printed large on the pass: "UK", "EU", "US", "UAE". */
  code: string;
  /** ISO currency code billed in this region ("GBP"). Its symbol comes from Intl, never a price. */
  currency: string;
  /** What applies in this region: currency, tax line, support hours with a timezone, the law that applies. Verified only. */
  facts: readonly RegionFact[];
  /** The honest line on where the site is hosted, from the standard answer. */
  hostedLine?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** split = text beside an upright pass · pass = text over a long pass. */
  layout?: "split" | "pass";
  scope?: BannerScope;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Local intent, banner 1, "boarding pass": the region in the reader's terms, its code in giant outline letters and its
 * currency symbol beside it, the facts that change by region printed as pass fields, the action on the stub. It names the
 * reader's region, never a server location: no office, no phone line, no map.
 */
export default function RegionBanner({ eyebrow, title, description, code, currency, facts, hostedLine, primaryCta, secondaryCta, layout = "split", scope = "page", headingLevel = "h1", className }: RegionBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const wide = layout === "pass";
  const symbol = currencySymbol(currency);

  const main = (
    <div>
      <div className="flex items-center justify-between gap-4 bg-accent px-7 py-3 text-accent-foreground sm:px-9">
        <span className="t-meta">{eyebrow ?? title}</span>
        <span className="t-meta opacity-80">{UI.banners.region}</span>
      </div>
      <div className="px-7 pb-8 pt-7 sm:px-9">
        <div className="flex items-end gap-5">
          <span className="outline-text font-heading text-[clamp(5rem,3rem+8vw,8.5rem)] font-semibold leading-[0.85] tracking-[-0.06em] [--outline-stroke:var(--foreground)]">{code}</span>
          <span aria-hidden="true" className="mb-4 h-px flex-1 border-t-2 border-dotted border-border-strong" />
          <span className="font-heading text-[clamp(3.5rem,2.5rem+4vw,5.5rem)] leading-[0.85] text-link">{symbol}</span>
        </div>
        <dl className={cn("mt-8 grid gap-x-8 gap-y-5", wide ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2")}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="t-meta text-muted-foreground">{f.label}</dt>
              <dd className="mt-1.5 text-sm leading-snug text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );

  const stub = (
    <div className="flex h-full flex-col justify-between gap-6 p-7 sm:p-8">
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="t-meta text-muted-foreground">{UI.banners.region}</dt>
          <dd className="mt-1 tabular-nums text-2xl text-foreground">{code}</dd>
        </div>
        <div>
          <dt className="t-meta text-muted-foreground">{UI.banners.currency}</dt>
          <dd className="mt-1 tabular-nums text-2xl text-foreground">
            {currency} <span className="text-link">{symbol}</span>
          </dd>
        </div>
      </dl>
      {primaryCta && (
        <PrimaryAction href={primaryCta.href} className="w-full whitespace-normal text-center">
          {primaryCta.label}
        </PrimaryAction>
      )}
      <span aria-hidden="true" className="barcode block h-9 w-full text-foreground opacity-70" />
    </div>
  );

  const intro = (
    <div className={cn("min-w-0", wide && "mx-auto max-w-3xl text-center")}>
      {eyebrow && (
        <Kicker center={wide} className="mb-7">
          {eyebrow}
        </Kicker>
      )}
      <Heading id={headingId} className="t-statement text-foreground">
        {title}
      </Heading>
      <p className={cn("t-lead mt-8", wide && "mx-auto")}>{description}</p>
      {secondaryCta && <QuietLink href={secondaryCta.href} className="mt-6">{secondaryCta.label}</QuietLink>}
      {hostedLine && <p className={cn("t-small mt-6 max-w-lg border-t border-border pt-5 text-muted-foreground", wide && "mx-auto")}>{hostedLine}</p>}
    </div>
  );

  const ink = scope === "ink";
  return (
    <BannerShell
      headingId={headingId}
      className={cn(SCOPE[scope], ink ? "band-ink" : "bg-background", className)}
      art={<div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-80" />}
    >
      {wide ? (
        <>
          {intro}
          <Ticket row main={main} stub={stub} stubWidth="20rem" className="mx-auto mt-14 max-w-5xl" />
        </>
      ) : (
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
          {intro}
          <Ticket main={main} stub={stub} className="w-full lg:-rotate-2 transition-transform duration-500 lg:hover:rotate-0" />
        </div>
      )}
    </BannerShell>
  );
}
