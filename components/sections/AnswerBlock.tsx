import { Link } from "@/i18n/link";
import { useId } from "react";
import { isVerified } from "@/content/claims";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

type AnswerBlockProps = {
  eyebrow?: string;
  /** A real question or topic, e.g. "What is managed WordPress hosting?". */
  title: string;
  /** The direct answer, 40 to 80 words. It is the first thing under the heading, for readers, search and AI answers. */
  answer: string;
  /** Plain-language detail that follows the answer: one or two short paragraphs. */
  detail?: readonly string[];
  link?: { label: string; href: string };
  /** Capability claim this answer depends on. Omitted until it renders. */
  claim?: string;
  /** Showcase only: render even when the claim is not rendering, with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

export const wordCount = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * Answer-first block: a question as the heading, the direct answer immediately under it, then optional detail. Built for
 * featured snippets and AI answers (rules: answer in the first sentence, 40 to 80 words) and for readers who just want
 * the answer. Server-rendered text, no animation above the fold. If `claim` is set and not rendering, nothing shows.
 */
export default function AnswerBlock({ eyebrow, title, answer, detail, link, claim, showSamples = false, headingLevel = "h2", className }: AnswerBlockProps) {
  const headingId = useId();
  const Heading = headingLevel;
  if (claim && !showSamples && !isVerified(claim)) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <div className="mx-auto max-w-4xl border-s-2 border-accent/60 ps-6 sm:ps-8" {...reveal(0)}>
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <Heading id={headingId} className={cn("t-h2 text-balance text-foreground", eyebrow && "mt-3")}>
            {title}
          </Heading>
          <p className="t-lead mt-5 !max-w-none !text-foreground">{answer}</p>
          {detail?.map((p) => (
            <p key={p} className="t-body mt-4 text-muted-foreground">
              {p}
            </p>
          ))}
          {link && (
            <Link href={link.href} className="mt-6 inline-flex min-h-11 items-center text-base font-semibold text-link underline underline-offset-4">
              {link.label}
            </Link>
          )}
          {showSamples && claim && <p className="mt-4 text-xs font-semibold text-warning">Sample: hidden until &ldquo;{claim}&rdquo; is confirmed</p>}
        </div>
      </div>
    </section>
  );
}
