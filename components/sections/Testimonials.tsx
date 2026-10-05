import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Verifiable source: LinkedIn profile, company site or review page. Required for public rendering. */
  sourceUrl?: string;
  /** Optional headshot. Initials are shown when absent. */
  photo?: { src: string; alt?: string };
};

type TestimonialsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: readonly TestimonialItem[];
  /** Showcase only: render unverified samples with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const isVerifiable = (t: TestimonialItem) => Boolean(t.quote && t.name && t.role && t.company && t.sourceUrl);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

/**
 * Customer testimonials. A testimonial renders only with a full name, role, company and a
 * source link; if none qualify the whole section is hidden rather than showing vague
 * quotes. Photo is optional (initials fallback). Layout copes with 1 to 6 items.
 */
export default function Testimonials({ eyebrow, title, description, items, showSamples = false, headingLevel = "h2", className }: TestimonialsProps) {
  const headingId = useId();
  const entries = showSamples ? items : items.filter(isVerifiable);
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <ul
          className={cn(
            "grid grid-cols-1 gap-5",
            title && "mt-12 sm:mt-14",
            entries.length === 1 ? "mx-auto max-w-2xl" : entries.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {entries.map((t) => (
            <li key={`${t.name}-${t.company}`} className="flex">
              <figure className="surface flex w-full flex-col p-6 sm:p-7">
                <blockquote className="flex-1">
                  <p className="t-body text-foreground">“{t.quote}”</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  {t.photo ? (
                    <Image src={t.photo.src} alt={t.photo.alt ?? t.name} width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/12 text-sm font-semibold text-link">
                      {initials(t.name)}
                    </span>
                  )}
                  <span className="min-w-0 text-sm">
                    <cite className="block font-semibold not-italic text-foreground">{t.name}</cite>
                    <span className="block text-muted-foreground">
                      {t.role}, {t.company}
                    </span>
                    {t.sourceUrl ? (
                      <Link href={t.sourceUrl} rel="noopener noreferrer" target="_blank" className="mt-0.5 inline-block text-xs font-semibold text-link underline underline-offset-4">
                        Verify on {t.sourceUrl.includes("linkedin.com") ? "LinkedIn" : "their site"}
                      </Link>
                    ) : (
                      <span className="mt-0.5 block text-xs font-semibold text-warning">Sample, unverified</span>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
