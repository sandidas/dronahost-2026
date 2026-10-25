import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useId } from "react";
import type { TestimonialItem } from "@/components/sections/Testimonials";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import LuxeHeader from "../luxe/LuxeHeader";

export type ShowcaseStudy = {
  title: string;
  description: string;
  metrics: readonly { value: string; label: string }[];
  /** The published page with the full story, when one exists. */
  sourceUrl?: string;
  /** The customer's site, named in the screenshot frame. */
  site?: { url: string; label: string };
  /** A real screenshot of the customer's site. */
  image?: { src: string; alt: string; width: number; height: number; capturedOn: string };
  /** Development placeholder: labelled and never shown in production. */
  sample?: boolean;
};

const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

type ReviewsShowcaseProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  /** One approved case study (content/case-studies.ts), shown as the featured story. */
  study?: ShowcaseStudy | null;
  /** Verified reviews (lib/content/reviews.ts). */
  reviews: readonly TestimonialItem[];
  /** Development preview only: the study and reviews are samples and are labelled as such. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

/** A review renders only with a full name, role, company and a source link, unless it is a labelled development sample. */
const isVerifiable = (t: TestimonialItem) => Boolean(t.quote && t.name && t.role && t.company && t.sourceUrl);

/**
 * Reviews after the move: one approved case study as the featured story, beside review cards. Everything comes from
 * verified data, so the section is hidden until a real study or review exists. Development samples carry a visible label.
 */
export default function ReviewsShowcase({ eyebrow, title, accent, description, study, reviews, showSamples = false, headingLevel = "h2", className }: ReviewsShowcaseProps) {
  const headingId = useId();
  const shownStudy = study && (!study.sample || showSamples) ? study : null;
  const shownReviews = showSamples ? reviews : reviews.filter(isVerifiable);
  if (!shownStudy && shownReviews.length === 0) return null;
  const StudyTitle = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section aria-labelledby={headingId} className={cn("section-luxe", className)}>
      <div className="container-site">
        <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={accent} description={description} headingLevel={headingLevel} />
        <div className={cn("mt-14 grid gap-5 sm:mt-16", shownStudy && shownReviews.length > 0 && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]")}>
          {shownStudy && (
            <article {...reveal()} className="relative isolate flex min-h-[26rem] flex-col gap-6 overflow-hidden rounded-[1.75rem] border border-border bg-surface-raised p-8 text-foreground shadow-lg sm:p-12">
              <span aria-hidden="true" className="absolute -right-28 -top-28 -z-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--glow-orange),transparent)] opacity-90" />
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="eyebrow-rule">{UI.caseStudy.eyebrow}</span>
              </p>
              <StudyTitle className="t-luxe-h3 !font-light text-[clamp(1.75rem,1.3rem+1.6vw,2.125rem)] leading-tight">{shownStudy.title}</StudyTitle>
              <p className={cn("text-base text-muted-foreground", !shownStudy.image && "flex-1")}>{shownStudy.description}</p>
              {shownStudy.image && (
                <figure className="flex flex-1 flex-col gap-2">
                  <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
                    <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                      <span className="size-2 rounded-full bg-border-strong" />
                      <span className="size-2 rounded-full bg-border-strong" />
                      <span className="size-2 rounded-full bg-border-strong" />
                      {shownStudy.site && <span className="ms-2 truncate text-[0.6875rem] text-subtle-foreground">{shownStudy.site.label}</span>}
                    </div>
                    <Image src={shownStudy.image.src} alt={shownStudy.image.alt} width={shownStudy.image.width} height={shownStudy.image.height} sizes="(min-width: 1024px) 40vw, 90vw" className="h-auto w-full" />
                  </div>
                  <figcaption className="text-xs text-subtle-foreground">
                    {UI.caseStudy.screenshotCaption} {formatDate(shownStudy.image.capturedOn)}
                  </figcaption>
                </figure>
              )}
              {shownStudy.metrics.length > 0 && (
                <dl className="grid grid-cols-2 gap-5 border-t border-border-strong pt-6">
                  {shownStudy.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="flex flex-col-reverse gap-1.5">
                      <dt className="text-[0.8125rem] text-subtle-foreground">{m.label}</dt>
                      <dd className="t-luxe-numeral text-3xl text-foreground">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {shownStudy.sourceUrl && (
                <a href={shownStudy.sourceUrl} className="inline-flex min-h-11 items-center gap-2 self-start font-bold text-link">
                  {UI.caseStudy.read}
                  <ArrowRight className="arrow-nudge size-4" aria-hidden="true" />
                </a>
              )}
            </article>
          )}
          {shownReviews.length > 0 && (
            <ul className={cn("grid gap-5", !shownStudy && "md:grid-cols-2 lg:grid-cols-3", shownStudy && shownReviews.length > 1 && "sm:grid-cols-2")}>
              {shownReviews.slice(0, 4).map((r, i) => (
                <li key={r.name} {...reveal(i)} className="flex">
                  <figure className="luxe-card-light flex w-full flex-col gap-5 rounded-3xl p-7">
                    <blockquote className="flex-1 text-base text-foreground">
                      <p>“{r.quote}”</p>
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-muted text-sm font-semibold text-link">
                        {initials(r.name)}
                      </span>
                      <span className="min-w-0 text-sm">
                        <cite className="block font-semibold not-italic text-foreground">{r.name}</cite>
                        {(r.role || r.company) && <span className="block text-muted-foreground">{[r.role, r.company].filter(Boolean).join(", ")}</span>}
                        {r.sourceUrl ? (
                          <a href={r.sourceUrl} rel="noopener noreferrer" target="_blank" className="mt-0.5 inline-block text-xs font-semibold text-link underline underline-offset-4">
                            {UI.luxe.readReview}
                          </a>
                        ) : null}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
