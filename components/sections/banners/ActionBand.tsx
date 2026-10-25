import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";

export type ActionBandProps = {
  /** The thing being offered: a plan or product name. Rendered as the band's heading. Optional (the page builder requires nothing). */
  label?: string;
  /** One line: outcome or scope. */
  line?: string;
  /** Formatted from lib/pricing. Omit while prices are hidden. */
  price?: { amount: string; period: string; renewal?: string };
  cta?: { label: string; href: string };
  /** A true fine-print line: the guarantee with its terms, or the tax line. */
  note?: string;
  /** split = navy beside a solid orange block · orange = the whole band is the action colour · pill = a floating bar. */
  variant?: "split" | "orange" | "pill";
  /** Sticks to the viewport while the plans are in view (`pill` sticks to the bottom). Use once per page at most. */
  sticky?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** The action on orange: a navy button, so the orange block is never orange on orange. */
function InkButton({ href, children, className }: { href: string; children: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--ink)] px-6 text-[0.9375rem] font-semibold text-[var(--brand-tint)] transition-transform hover:-translate-y-px", className)}>
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180" aria-hidden="true" />
    </Link>
  );
}

/**
 * Transactional intent, banner 2, "split block": a conversion band for the middle or end of a page. The plan sits on
 * navy, the price and the action on a solid orange block, the one place the action colour is a surface. `pill` is a
 * floating bar for long pages. It repeats the page's primary label, never a second one.
 */
export default function ActionBand({ label, line, price, cta, note, variant = "split", sticky = false, headingLevel = "h2", className }: ActionBandProps) {
  const headingId = useId();
  const Heading = headingLevel;

  const priceText = price && (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className="font-heading text-4xl leading-none tracking-[-0.045em]">{price.amount}</span>
      <span className="t-meta">{price.period}</span>
      {price.renewal && (
        <span className="t-meta basis-full pt-2">
          {UI.banners.renewsAt} {price.renewal}
        </span>
      )}
    </p>
  );

  if (variant === "pill") {
    return (
      <section aria-labelledby={label ? headingId : undefined} className={cn("px-[var(--gutter)] py-6", sticky && "sticky bottom-4 z-30", className)}>
        <div className="dark mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-3 rounded-full border border-border bg-background/90 py-2.5 pe-2.5 ps-6 text-foreground shadow-2xl backdrop-blur-xl max-sm:rounded-2xl max-sm:pe-4 max-sm:pb-4">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--glow-teal)]" />
          <div className="min-w-0 flex-1">
            {label && (
              <Heading id={headingId} className="text-[0.9375rem] font-semibold text-foreground">
                {label}
              </Heading>
            )}
            <p className="truncate text-xs text-muted-foreground">{note ?? line}</p>
          </div>
          {price && (
            <p className="tabular-nums text-sm text-foreground">
              {price.amount} <span className="text-muted-foreground">{price.period}</span>
            </p>
          )}
          {cta && (
            <Link href={cta.href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground max-sm:w-full max-sm:justify-center">
              {cta.label}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (variant === "orange") {
    return (
      <section aria-labelledby={label ? headingId : undefined} className={cn("bg-primary text-[var(--on-action)]", sticky && "sticky top-[4.5rem] z-30", className)}>
        <div className="container-site flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="min-w-0">
            {label && (
              <Heading id={headingId} className="font-heading text-3xl tracking-[-0.03em] sm:text-4xl">
                {label}
              </Heading>
            )}
            {line && <p className="mt-2 text-base">{line}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {priceText}
            <div className="flex flex-col gap-2">
              {cta && <InkButton href={cta.href}>{cta.label}</InkButton>}
              {note && <span className="max-w-60 text-xs">{note}</span>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={label ? headingId : undefined} className={cn("dark overflow-hidden bg-background text-foreground", sticky && "sticky top-[4.5rem] z-30", className)}>
      <div className="grid md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="band-ink relative flex items-center px-[var(--gutter)] py-10 md:ps-[max(var(--gutter),calc((100vw-var(--container-max))/2+var(--gutter)))] md:pe-12">
          <div className="min-w-0">
            <p className="t-meta text-link">{UI.banners.plan}</p>
            {label && (
              <Heading id={headingId} className="mt-3 font-heading text-3xl tracking-[-0.03em] text-foreground sm:text-4xl">
                {label}
              </Heading>
            )}
            {line && <p className="t-small mt-2 max-w-md text-muted-foreground">{line}</p>}
          </div>
        </div>
        <div className="relative flex flex-col justify-center gap-5 bg-primary px-[var(--gutter)] py-10 text-[var(--on-action)] md:min-w-[26rem] md:px-12 md:[clip-path:polygon(2.5rem_0,100%_0,100%_100%,0_100%)] md:ps-20">
          {priceText}
          <div className="flex flex-col items-start gap-2">
            {cta && <InkButton href={cta.href}>{cta.label}</InkButton>}
            {note && <span className="max-w-72 text-xs">{note}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
