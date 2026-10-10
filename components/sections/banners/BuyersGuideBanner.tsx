import { Check, Minus } from "lucide-react";
import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, indexNo, QuietLink, SCOPE } from "./BannerShell";

export type BuyersGuideBannerProps = {
  eyebrow?: string;
  title: string;
  summary: string;
  /** What the guide compared or reviewed, as short lines: the contents page. */
  compared: readonly string[];
  /** Who the guide is for, in one sentence, and who it is not for. Honest limits sell. */
  forWho: string;
  notFor?: string;
  /** The issue mark in the masthead, "01". */
  issue?: string;
  /** ISO date or a plain date line for the masthead. */
  dateLine?: string;
  cta?: { label: string; href: string };
  /** cover = title beside the contents · column = one centred column, contents underneath. */
  layout?: "cover" | "column";
  scope?: Exclude<BannerScope, "page">;
  headingLevel?: "h1" | "h2";
  className?: string;
};

function Stamp({ kind }: { kind: "for" | "not" }) {
  const yes = kind === "for";
  return (
    <span aria-hidden="true" className={cn("relative grid size-20 shrink-0 place-items-center rounded-full border-2", yes ? "-rotate-12 border-accent text-link" : "rotate-6 border-border-strong text-muted-foreground")}>
      <span className={cn("absolute inset-1.5 rounded-full border border-dashed", yes ? "border-accent/60" : "border-border-strong/70")} />
      {yes ? <Check className="size-7" strokeWidth={2.25} /> : <Minus className="size-7" strokeWidth={2.25} />}
    </span>
  );
}

/**
 * Commercial intent, banner 2, "magazine cover": a masthead with a double rule and an issue mark, the title in large Sora
 * type, what was compared set as a contents page with dotted leaders, and "best for" and "not for" as two rubber
 * stamps. It states who the guide is for before asking for anything.
 */
export default function BuyersGuideBanner({ eyebrow, title, summary, compared, forWho, notFor, issue, dateLine, cta, layout = "cover", scope = "paper", headingLevel = "h1", className }: BuyersGuideBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const cover = layout === "cover";
  const ink = scope === "ink";

  const contents = (
    <div>
      <p className="border-b-2 border-foreground pb-2 font-heading text-2xl text-foreground">{UI.banners.whatWeCompared}</p>
      <ol className="mt-2">
        {compared.map((c, i) => (
          <li key={c} className="flex items-baseline gap-3 border-b border-border py-3">
            <span className="text-base text-foreground">{c}</span>
            <span aria-hidden="true" className="dotted-leader" />
            <span className="tabular-nums text-xs text-link">{indexNo(i)}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  const fit = (
    <dl className={cn("grid gap-8", notFor && "sm:grid-cols-2")}>
      <div className="flex items-start gap-5">
        <Stamp kind="for" />
        <div>
          <dt className="t-meta text-link">{UI.banners.bestFor}</dt>
          <dd className="mt-2 font-sans text-xl leading-snug text-foreground">{forWho}</dd>
        </div>
      </div>
      {notFor && (
        <div className="flex items-start gap-5">
          <Stamp kind="not" />
          <div>
            <dt className="t-meta text-muted-foreground">{UI.banners.notFor}</dt>
            <dd className="mt-2 font-sans text-xl leading-snug text-muted-foreground">{notFor}</dd>
          </div>
        </div>
      )}
    </dl>
  );

  return (
    <BannerShell headingId={headingId} size="section" className={cn(SCOPE[scope], ink ? "band-ink" : "bg-card", className)}>
      {/* Masthead */}
      <div className="border-b-[3px] border-double border-foreground pb-3">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {eyebrow && <p className="font-heading text-3xl text-foreground sm:text-4xl">{eyebrow}</p>}
          <p className="t-meta flex items-center gap-4 text-muted-foreground">
            {issue && (
              <span>
                {UI.banners.issue} <span className="text-foreground">{issue}</span>
              </span>
            )}
            {dateLine && <span>{dateLine}</span>}
          </p>
        </div>
      </div>

      <div className={cn("mt-12 grid gap-14", cover ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20" : "mx-auto max-w-3xl text-center")}>
        <div className="min-w-0">
          {issue && (
            <span aria-hidden="true" className={cn("outline-text block font-heading text-[7rem] leading-[0.8] sm:text-[10rem]", !cover && "mx-auto")}>
              {issue}
            </span>
          )}
          <Heading id={headingId} className="mt-4 font-heading text-[clamp(2.375rem,1.3rem+3.2vw,4.25rem)] leading-[1.02] tracking-[-0.04em] text-balance text-foreground">
            {title}
          </Heading>
          <p className={cn("t-lead mt-8", !cover && "mx-auto")}>{summary}</p>
          {cta && <QuietLink href={cta.href} className="mt-6">{cta.label}</QuietLink>}
        </div>
        <div className={cn("min-w-0", cover ? "lg:pt-6" : "text-start")}>{contents}</div>
      </div>

      <div className="mt-16 border-t border-border pt-10">{fit}</div>
    </BannerShell>
  );
}
