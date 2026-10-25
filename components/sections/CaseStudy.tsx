import { Link } from "@/i18n/link";
import { useId, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { UI } from "@/content/strings";

type CaseStudyProps = {
  eyebrow?: string;
  title: string;
  description: string;
  /** 1 to 4 concrete results, e.g. before/after load time. */
  metrics: readonly { value: string; label: string }[];
  /** Link to the published, customer-approved case study. Required for public rendering. */
  sourceUrl?: string;
  cta?: { label: string; href: string };
  /** Optional visual. Defaults to a metric panel. */
  visual?: ReactNode;
  /** Showcase only: render without a source with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Case study with concrete metrics. Hidden unless it links to an approved, published source. */
export default function CaseStudy({
  eyebrow = UI.caseStudy.eyebrow,
  title,
  description,
  metrics,
  sourceUrl,
  cta,
  visual,
  showSamples = false,
  headingLevel = "h2",
  className,
}: CaseStudyProps) {
  const headingId = useId();
  const Heading = headingLevel;
  if (!sourceUrl && !showSamples) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <div className="surface surface-raised grid items-center gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <p className="t-eyebrow">
              {eyebrow}
            </p>
            <Heading id={headingId} className="t-h2 mt-3 text-foreground">
              {title}
            </Heading>
            <p className="t-lead mt-4">{description}</p>
            {(cta || sourceUrl) && (
              <div className="mt-8">
                <Button href={cta?.href ?? sourceUrl ?? "#"} variant="secondary" size="lg">
                  {cta?.label ?? UI.caseStudy.read}
                </Button>
              </div>
            )}
          </div>
          {visual ?? (
            <dl className={cn("grid gap-4", metrics.length > 1 && "sm:grid-cols-2")}>
              {metrics.slice(0, 4).map((m) => (
                <div key={m.label} className="rounded-2xl border border-border bg-card p-6">
                  <dd className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-foreground">{m.value}</dd>
                  <dt className="t-small mt-2 text-muted-foreground">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
        {sourceUrl && (
          <p className="t-small mt-4 text-center text-muted-foreground">
            {UI.caseStudy.source}{" "}
            <Link href={sourceUrl} className="font-semibold text-link underline underline-offset-4">
              {UI.caseStudy.publishedLink}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
