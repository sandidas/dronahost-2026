import { ChevronDown } from "lucide-react";
import { useId } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type FaqItem = { question: string; answer: string };

type FAQSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: readonly FaqItem[];
  /** Optional side panel (left on large screens), e.g. contact prompt. */
  aside?: { title: string; body: string; cta?: { label: string; href: string } };
  /** Opens the first question by default. */
  openFirst?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * FAQ accordion built on native <details>/<summary>: every answer is in the initial HTML,
 * it works without JavaScript, is keyboard operable and announced correctly by screen
 * readers. Items share a `name`, so opening one closes the others in supporting browsers.
 * Only render FAQPage JSON-LD for the same visible items (see lib/seo/jsonld.ts).
 */
export default function FAQSection({ eyebrow, title, description, items, aside, openFirst = false, headingLevel = "h2", className }: FAQSectionProps) {
  const headingId = useId();
  const groupName = useId();
  const Question = headingLevel === "h2" ? "h3" : "h4";
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <div className={cn(aside && "grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16")}>
          <div>
            <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align={aside ? "start" : "center"} />
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
          <div className={cn("space-y-3", !aside && "mx-auto mt-12 max-w-3xl sm:mt-14")}>
            {items.map((item, i) => (
              <details key={item.question} name={groupName} open={openFirst && i === 0} className="group surface overflow-hidden open:border-border-strong">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start focus-visible:outline-offset-[-3px] [&::-webkit-details-marker]:hidden">
                  <Question className="text-base font-semibold text-foreground">{item.question}</Question>
                  <ChevronDown className="size-5 shrink-0 text-link transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                </summary>
                <div className="mx-5 border-t border-border pb-5 pt-4">
                  <p className="t-body text-muted-foreground">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
