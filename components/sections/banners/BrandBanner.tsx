import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { useId, type ReactNode } from "react";
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, PrimaryAction, SCOPE } from "./BannerShell";

/** `icon` is kept for older data; the directory board shows letters instead. */
export type BrandDestination = { label: string; href: string; icon?: FeatureIconName };

export type BrandBannerProps = {
  /** The brand name as the heading. A reader who typed it wants to see it. */
  name: string;
  /** The one entity sentence: what the business is, the same wording site-wide. */
  entityLine: string;
  /** Where a brand searcher usually wants to go: pricing, support, login, about. Three to five. */
  destinations: readonly BrandDestination[];
  primaryCta?: { label: string; href: string };
  /** A logo or wordmark element above the name. */
  logo?: ReactNode;
  /** board = name above a lobby directory · inline = name beside the directory. */
  layout?: "board" | "inline";
  /** ink = navy lobby · paper = light stone lobby. */
  scope?: Exclude<BannerScope, "page">;
  headingLevel?: "h1" | "h2";
  className?: string;
};

const LETTERS = "ABCDEFGH";

/**
 * Navigational intent, banner 1, "lobby directory": the brand name cropped huge across the band as an outline watermark,
 * the entity sentence, and the places a brand searcher wants listed like a building directory, lettered, with dotted
 * leaders to the arrow. It does not re-sell to someone who already knows us.
 */
export default function BrandBanner({ name, entityLine, destinations, primaryCta, logo, layout = "board", scope = "ink", headingLevel = "h1", className }: BrandBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const inline = layout === "inline";
  const ink = scope === "ink";

  const board = (
    <nav aria-label={UI.banners.quickLinks} className={cn("rounded-md border border-border p-2 shadow-2xl backdrop-blur-md", ink ? "bg-background/70" : "bg-card/85")}>
      <p className="t-meta flex items-center justify-between border-b border-border px-4 pb-3 pt-2 text-muted-foreground">
        <span>{UI.banners.quickLinks}</span>
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="size-1.5 rounded-full bg-border-strong" />
        </span>
      </p>
      <ul>
        {destinations.map((d, i) => (
          <li key={d.label}>
            <Link href={d.href} className="group flex min-h-14 items-center gap-4 rounded-sm px-4 py-3 transition-colors hover:bg-foreground/[0.05]">
              <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-sm border border-accent/40 bg-accent/10 tabular-nums text-xs font-semibold text-link">
                {LETTERS[i] ?? i + 1}
              </span>
              <span className="text-base font-semibold text-foreground">{d.label}</span>
              <span aria-hidden="true" className="dotted-leader" />
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-link rtl:rotate-180" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <BannerShell
      headingId={headingId}
      className={cn(SCOPE[scope], ink ? "band-ink" : "bg-muted", className)}
      art={
        <span aria-hidden="true" className="outline-text pointer-events-none absolute inset-x-0 -bottom-[0.18em] -z-10 select-none whitespace-nowrap text-center font-heading text-[clamp(7rem,22vw,22rem)] font-semibold leading-none tracking-[-0.05em] opacity-50 [--outline-stroke:var(--border-strong)]">
          {name}
        </span>
      }
    >
      <div className={cn("grid gap-14", inline ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-20" : "justify-items-center text-center")}>
        <div className={cn("min-w-0", !inline && "max-w-3xl")}>
          {logo && <div className={cn("mb-10", !inline && "flex justify-center")}>{logo}</div>}
          <Heading id={headingId} className="t-statement text-foreground">
            {name}
          </Heading>
          <p className={cn("t-lead mt-7", !inline && "mx-auto")}>{entityLine}</p>
          {primaryCta && (
            <div className="mt-10">
              <PrimaryAction href={primaryCta.href}>{primaryCta.label}</PrimaryAction>
            </div>
          )}
        </div>
        <div className={cn("w-full text-start", !inline && "max-w-xl pb-10 sm:pb-16")}>{board}</div>
      </div>
    </BannerShell>
  );
}
