import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, currencySymbol, Kicker, SCOPE } from "./BannerShell";

export type ServiceRegion = {
  label: string;
  /** ISO currency code billed in the region. Its symbol heads the column. */
  currency: string;
  href?: string;
  note?: string;
};

export type ServiceAreaBannerProps = {
  eyebrow?: string;
  title: string;
  description: string;
  /** The regions served, each linking to its regional page when one is published. */
  regions: readonly ServiceRegion[];
  /** The honest line: no local office, support by ticket and email, in which language. */
  honestLine: string;
  /** wall = one column per region under a giant currency symbol · list = rows with a symbol seal. */
  layout?: "wall" | "list";
  scope?: BannerScope;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Local intent, banner 2, "currency wall": the regions served, each under its giant currency symbol, filled where a
 * regional page is published and outlined where it is not yet. It answers "do you serve my country?" with what changes
 * (the currency and the rules), not with a map or a "near me" claim.
 */
export default function ServiceAreaBanner({ eyebrow, title, description, regions, honestLine, layout = "wall", scope = "ink", headingLevel = "h2", className }: ServiceAreaBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const ink = scope === "ink";

  const wall = (
    <ul className="grid grid-cols-2 border-s border-t border-border sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ["--n" as string]: regions.length }}>
      {regions.map((r) => {
        const symbol = currencySymbol(r.currency);
        const inner = (
          <>
            <span aria-hidden="true" className={cn("block font-heading leading-none tracking-[-0.04em] transition-transform duration-500 group-hover:-translate-y-1", symbol.length > 1 ? "text-[clamp(3rem,2rem+3vw,5rem)] h-[clamp(4.5rem,3rem+5vw,8rem)] flex items-end" : "text-[clamp(4.5rem,3rem+5vw,8rem)]", r.href ? "text-link" : "outline-text [--outline-stroke:var(--border-strong)]")}>
              {symbol}
            </span>
            <span className="mt-8 flex items-center justify-between gap-2">
              <span className="text-base font-semibold text-foreground">{r.label}</span>
              {r.href && <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-link rtl:rotate-180" />}
            </span>
            <span className="t-meta mt-1 block text-muted-foreground">{r.currency}</span>
            {r.note && <span className="t-small mt-3 block text-muted-foreground">{r.note}</span>}
          </>
        );
        return (
          <li key={r.label} className="border-b border-e border-border">
            {r.href ? (
              <Link href={r.href} className="group block h-full p-5 transition-colors hover:bg-foreground/[0.04] sm:p-6">
                {inner}
              </Link>
            ) : (
              <div className="group h-full p-5 sm:p-6">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const list = (
    <ul className="border-t border-border">
      {regions.map((r) => {
        const row = (
          <>
            <span aria-hidden="true" className={cn("grid size-14 shrink-0 place-items-center rounded-full border font-heading text-2xl", r.href ? "border-accent bg-accent/10 text-link" : "border-border-strong text-muted-foreground")}>
              {currencySymbol(r.currency)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-xl tracking-[-0.02em] text-foreground">{r.label}</span>
              {r.note && <span className="t-small block text-muted-foreground">{r.note}</span>}
            </span>
            <span className="t-meta hidden text-muted-foreground sm:block">{r.currency}</span>
            {r.href && <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-link rtl:rotate-180" />}
          </>
        );
        return (
          <li key={r.label} className="border-b border-border">
            {r.href ? (
              <Link href={r.href} className="group flex items-center gap-5 py-5">
                {row}
              </Link>
            ) : (
              <div className="flex items-center gap-5 py-5">{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <BannerShell headingId={headingId} size="section" className={cn(SCOPE[scope], ink ? "band-ink" : "bg-background", className)}>
      <div className={cn("grid gap-12", layout === "list" ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20" : "lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:gap-20")}>
        <div className="min-w-0">
          {eyebrow && <Kicker className="mb-6">{eyebrow}</Kicker>}
          <Heading id={headingId} className="t-statement-sm text-foreground">
            {title}
          </Heading>
          <p className="t-lead mt-6">{description}</p>
        </div>
        {layout === "list" ? (
          <div className="min-w-0">
            <p className="t-meta mb-4 text-muted-foreground">{UI.banners.regions}</p>
            {list}
          </div>
        ) : (
          <p className="t-small border-s-2 border-accent ps-5 text-muted-foreground">{honestLine}</p>
        )}
      </div>
      {layout === "wall" ? (
        <div className="mt-14">
          <p className="t-meta mb-4 text-muted-foreground">{UI.banners.regions}</p>
          {wall}
        </div>
      ) : (
        <p className="t-small mt-10 max-w-xl border-s-2 border-accent ps-5 text-muted-foreground">{honestLine}</p>
      )}
    </BannerShell>
  );
}
