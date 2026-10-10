import { Link } from "@/i18n/link";
import { useId } from "react";
import { UI } from "@/content/strings";
import { longDate } from "@/components/sections/bespoke/PageProvenance";
import { cn } from "@/utils/cn";
import BannerShell, { type BannerScope, Kicker, SCOPE } from "./BannerShell";

export type CitableFact = {
  /** One self-contained sentence: subject, fact, reason. It must make sense pasted alone into an answer. */
  sentence: string;
  /** The page that states the terms or the method behind it. */
  source: { label: string; href: string };
  /** ISO date the fact was last checked. */
  checkedOn?: string;
};

export type CitableFactBannerProps = {
  eyebrow?: string;
  /** Optional heading; with none, the first fact is the heading of the landmark. */
  title?: string;
  facts: readonly CitableFact[];
  /** article = the facts as one footnoted paragraph · quote = the first fact as an oversized pull quote · cards = citation cards. */
  layout?: "article" | "quote" | "cards";
  scope?: BannerScope;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Generative AI intent, banner 1, "footnoted article": statements written to be quoted, set like a research paper. Each
 * sentence carries a superscript number that links to its footnote: the source page and the date it was checked. Only
 * facts that render from the claims registry belong here.
 */
export default function CitableFactBanner({ eyebrow, title, facts, layout = "article", scope = "page", headingLevel = "h2", className }: CitableFactBannerProps) {
  const headingId = useId();
  const noteId = useId();
  const Heading = headingLevel;
  const shown = layout === "quote" ? facts.slice(0, 1) : facts;
  const fn = (i: number) => `${noteId}-fn-${i + 1}`;
  const ink = scope === "ink";

  const heading = title ? (
    <div className="mb-12">
      {eyebrow && <Kicker className="mb-6">{eyebrow}</Kicker>}
      <Heading id={headingId} className="t-statement-sm max-w-3xl text-foreground">
        {title}
      </Heading>
    </div>
  ) : (
    <Heading id={headingId} className="sr-only">
      {shown[0]?.sentence}
    </Heading>
  );

  const sup = (i: number) => (
    <sup className="ms-0.5">
      <a href={`#${fn(i)}`} className="rounded-sm px-1 tabular-nums text-[0.6em] font-semibold text-link no-underline hover:bg-accent/15">
        [{i + 1}]
      </a>
    </sup>
  );

  const footnotes = (
    <ol aria-label={UI.banners.footnotes} className={cn("grid gap-x-10 gap-y-4 border-t border-border pt-6", shown.length > 1 && "md:grid-cols-3")}>
      {shown.map((f, i) => (
        <li key={f.sentence} id={fn(i)} className="flex gap-3 scroll-mt-28">
          <span className="tabular-nums text-xs text-link">[{i + 1}]</span>
          <span className="t-small text-muted-foreground">
            <Link href={f.source.href} className="link-quiet font-semibold text-foreground hover:text-link">
              {f.source.label}
            </Link>
            {f.checkedOn && (
              <>
                . {UI.banners.checkedOn} <time dateTime={f.checkedOn}>{longDate(f.checkedOn)}</time>.
              </>
            )}
          </span>
        </li>
      ))}
    </ol>
  );

  let body;
  if (layout === "quote" && shown[0]) {
    body = (
      <figure className="relative mx-auto max-w-5xl">
        <span aria-hidden="true" className="pointer-events-none absolute -start-4 -top-20 select-none font-heading text-[14rem] leading-none text-accent opacity-25 sm:-start-12 sm:-top-28 sm:text-[20rem]">
          &ldquo;
        </span>
        <blockquote className="relative font-heading text-[clamp(2rem,1.2rem+2.8vw,3.75rem)] leading-[1.12] tracking-[-0.01em] text-balance text-foreground">
          {shown[0].sentence}
          {sup(0)}
        </blockquote>
        <figcaption className="mt-12">{footnotes}</figcaption>
      </figure>
    );
  } else if (layout === "cards") {
    body = (
      <ul className="grid gap-5 md:grid-cols-3">
        {shown.map((f, i) => (
          <li key={f.sentence} id={fn(i)} className={cn("relative flex flex-col justify-between rounded-sm border border-border bg-card p-7 shadow-lg transition-transform duration-500 hover:rotate-0", i % 2 === 0 ? "md:-rotate-1" : "md:rotate-1")}>
            <span aria-hidden="true" className="absolute -top-3 start-7 rounded-sm bg-accent px-2 py-0.5 tabular-nums text-xs font-semibold text-accent-foreground">
              [{i + 1}]
            </span>
            <p className="font-sans text-2xl leading-snug text-foreground">{f.sentence}</p>
            <p className="t-small mt-8 border-t border-border pt-4 text-muted-foreground">
              <span className="t-meta me-2">{UI.banners.citeAs}</span>
              <Link href={f.source.href} className="link-quiet font-semibold text-foreground hover:text-link">
                {f.source.label}
              </Link>
              {f.checkedOn && (
                <>
                  , <time dateTime={f.checkedOn}>{longDate(f.checkedOn)}</time>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    );
  } else {
    body = (
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16">
        <div>
          <p className="font-sans text-[clamp(1.625rem,1.1rem+1.6vw,2.5rem)] leading-[1.3] text-pretty text-foreground first-letter:float-left first-letter:me-3 first-letter:mt-1 first-letter:font-sans first-letter:text-[4.5em] first-letter:leading-[0.8] first-letter:text-link">
            {shown.map((f, i) => (
              <span key={f.sentence}>
                {f.sentence}
                {sup(i)}{" "}
              </span>
            ))}
          </p>
          <div className="mt-12">{footnotes}</div>
        </div>
        <aside aria-hidden="true" className="hidden border-s border-border ps-8 lg:block">
          <p className="font-sans text-lg text-muted-foreground">{UI.banners.footnotes}</p>
          <p className="mt-3 tabular-nums text-5xl text-link">{shown.length}</p>
        </aside>
      </div>
    );
  }

  return (
    <BannerShell headingId={headingId} size="section" className={cn(SCOPE[scope], ink ? "band-ink" : layout === "cards" ? "bg-muted" : "bg-background", className)}>
      {heading}
      {body}
    </BannerShell>
  );
}
