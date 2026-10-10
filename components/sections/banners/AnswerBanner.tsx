import { useId } from "react";
import { Link } from "@/i18n/link";
import { UI } from "@/content/strings";
import { longDate } from "@/components/sections/bespoke/PageProvenance";
import { cn } from "@/utils/cn";
import BannerShell, { QuietLink } from "./BannerShell";

export type AnswerBannerProps = {
  eyebrow?: string;
  /** The question the reader typed, as the headword. */
  question: string;
  /** The direct answer, 40 to 80 words, first sentence answers. Set as definition 1. */
  answer: string;
  /** The small line under the headword, like a word class: "noun phrase". */
  partOfSpeech?: string;
  /** Who reviewed it and when (ISO date). */
  byline?: { reviewer: string; reviewedOn: string };
  readingTime?: string;
  /** Sections of the guide. `entry` shows them as a "see also" line, `margin` as notes in the side column. */
  toc?: readonly { label: string; href: string }[];
  /** One link to the next step. Never a sales push on a Learn page. */
  next?: { label: string; href: string };
  /** entry = headword and definition · margin = notes column beside it · centered = a short explainer. */
  layout?: "entry" | "margin" | "centered";
  /** Sets the entry on a ruled index card. */
  card?: boolean;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Informational intent, banner 1, "dictionary entry": the question is the headword, the answer is definition 1, the
 * reviewer signs it. A large teal question mark is cropped off the edge. Built for the reader who wants the answer first
 * and for the answer engine that quotes it.
 */
export default function AnswerBanner({ eyebrow, question, answer, partOfSpeech, byline, readingTime, toc, next, layout = "entry", card = false, headingLevel = "h1", className }: AnswerBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const margin = layout === "margin" && Boolean(toc?.length);
  const centered = layout === "centered";
  const small = [partOfSpeech, readingTime].filter(Boolean);

  const entry = (
    <div className={cn("min-w-0", centered && "mx-auto max-w-4xl text-center")}>
      {eyebrow && <p className="t-meta mb-6 text-link">{eyebrow}</p>}
      <Heading id={headingId} className="font-heading text-[clamp(2.375rem,1.3rem+3.4vw,4.5rem)] leading-[1.02] tracking-[-0.04em] text-balance text-foreground">
        {question}
      </Heading>
      {small.length > 0 && <p className="mt-5 font-sans text-xl text-muted-foreground">{small.join(" · ")}</p>}
      <div className={cn("mt-10 flex gap-5 sm:gap-7", centered && "mx-auto max-w-3xl text-start")}>
        <span aria-hidden="true" className="font-heading text-4xl leading-none text-link sm:text-5xl">
          1.
        </span>
        <div className="min-w-0 border-s border-border ps-5 sm:ps-7">
          <p className="sr-only">{UI.banners.definition}</p>
          <p className="text-lg leading-relaxed text-foreground sm:text-xl sm:leading-relaxed">{answer}</p>
          {byline && (
            <p className="t-small mt-6 text-muted-foreground">
              {UI.banners.reviewedBy} <span className="font-sans text-lg text-foreground">{byline.reviewer}</span>, <time dateTime={byline.reviewedOn}>{longDate(byline.reviewedOn)}</time>
            </p>
          )}
        </div>
      </div>
      {toc && toc.length > 0 && !margin && (
        <nav aria-label={UI.banners.inThisGuide} className={cn("mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-2", centered && "justify-center")}>
          <span className="font-sans text-lg text-muted-foreground">{UI.banners.inThisGuide}:</span>
          {toc.map((t, i) => (
            <span key={t.label} className="inline-flex items-baseline gap-3">
              <Link href={t.href} className="link-quiet text-[0.9375rem] font-semibold text-foreground hover:text-link">
                {t.label}
              </Link>
              {i < toc.length - 1 && (
                <span aria-hidden="true" className="text-link">
                  ·
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      {next && <QuietLink href={next.href} className="mt-6">{next.label}</QuietLink>}
    </div>
  );

  const notes = margin && toc && (
    <nav aria-label={UI.banners.inThisGuide} className="lg:border-s lg:border-border lg:ps-10">
      <p className="font-heading text-2xl text-foreground">{UI.banners.notes}</p>
      <ol className="mt-6 space-y-4">
        {toc.map((t, i) => (
          <li key={t.label} className="flex items-baseline gap-4">
            <span aria-hidden="true" className="font-heading text-lg text-link">
              §{i + 1}
            </span>
            <Link href={t.href} className="link-quiet text-base text-foreground hover:text-link">
              {t.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );

  const body = margin ? (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
      {entry}
      {notes}
    </div>
  ) : (
    entry
  );

  return (
    <BannerShell
      headingId={headingId}
      className={cn(card ? "py-12 sm:py-16" : "bg-background", className)}
      size={card ? "none" : "hero"}
      art={
        !card && !margin && (
          <span aria-hidden="true" className={cn("outline-text pointer-events-none absolute -z-10 select-none font-heading leading-none [-webkit-text-stroke-width:2px]", centered ? "opacity-15 start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem]" : "-end-20 -top-24 text-[22rem] opacity-40 sm:text-[30rem]")}>
            ?
          </span>
        )
      }
    >
      {card ? (
        <div className="index-card relative overflow-hidden rounded-sm border border-border bg-card px-6 pb-12 pt-16 shadow-lg sm:px-14 sm:pb-16 lg:px-20">
          <span aria-hidden="true" className="absolute inset-x-0 top-11 h-px bg-action/40" />
          <span aria-hidden="true" className="absolute inset-y-0 start-4 w-px bg-accent/40 sm:start-9 lg:start-12" />
          {body}
        </div>
      ) : (
        body
      )}
    </BannerShell>
  );
}
