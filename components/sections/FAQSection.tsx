import { useId } from "react";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";
import LuxeHeader from "./luxe/LuxeHeader";
import SectionHeader from "./SectionHeader";
import { FaqCollage, type FaqPhoto } from "./visuals/FaqCollage";

export type FaqItem = { question: string; answer: string };

type FAQSectionProps = {
  eyebrow?: string;
  /** Optional for the page builder, where nothing is required. */
  title?: string;
  description?: string;
  items: readonly FaqItem[];
  /** Optional panel under the picture, e.g. a contact prompt. */
  aside?: { title: string; body: string; cta?: { label: string; href: string } };
  /** One text link under the questions. */
  link?: { label: string; href: string };
  /** Real photos for the collage (team or customers who agreed). Without them the collage is a drawn support exchange. */
  photos?: readonly FaqPhoto[];
  /** Kept for older callers; every answer is always open now. */
  openFirst?: boolean;
  /** "lines" uses the light Home headline; both show the same open cards. */
  variant?: "cards" | "lines";
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * The site-wide FAQ: every question and answer is an open card, so the full text is visible on load, in the HTML and to
 * readers who never click. The heading and a collage sit on the left (sticky on large screens), the cards on the right.
 * Only render FAQPage JSON-LD for the same visible items (see lib/seo/jsonld.ts). Data changes per page, not the component.
 */
export default function FAQSection({ eyebrow, title, description, items, aside, link, photos, variant = "cards", headingLevel = "h2", className }: FAQSectionProps) {
  const headingId = useId();
  const Question = headingLevel === "h2" ? "h3" : "h4";
  if (items.length === 0) return null;
  const Header = variant === "lines" ? LuxeHeader : SectionHeader;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn(variant === "lines" ? "section-luxe" : "section-y", className)}>
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            {title && <Header id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="start" />}
            <div className="mt-10 hidden sm:block">
              <FaqCollage question={items[0]?.question || title || ""} photos={photos} />
            </div>
            {aside && (
              <div className="surface mt-8 p-6">
                <p className="t-h4 text-foreground">{aside.title}</p>
                <p className="t-small mt-2 text-muted-foreground">{aside.body}</p>
                {aside.cta && (
                  <div className="mt-5">
                    <Button href={aside.cta.href} variant="secondary" size="sm">
                      {aside.cta.label}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <ul className="grid gap-4">
              {items.map((item, i) => (
                <li key={`${i}-${item.question}`}>
                  <article className="surface h-full p-6 sm:p-7">
                    <p aria-hidden="true" className="font-heading text-xs font-semibold tracking-[0.18em] text-link">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    {item.question && <Question className="mt-2 font-heading text-lg font-medium leading-snug text-foreground">{item.question}</Question>}
                    {item.answer && <p className="t-body mt-3 text-muted-foreground">{item.answer}</p>}
                  </article>
                </li>
              ))}
            </ul>
            {link && (
              <p className="mt-6">
                <Link href={link.href} className="inline-flex min-h-11 items-center font-semibold text-link underline underline-offset-4">
                  {link.label}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
