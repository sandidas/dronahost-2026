import { Link } from "@/i18n/link";
import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";

type PageProvenanceProps = {
  /** A real person's name. */
  reviewer: string;
  role: string;
  /** YYYY-MM-DD. Shown as "9 October 2026". */
  reviewedOn: string;
  /** One sentence on how the facts on this page are checked. */
  howLine: string;
  report: { label: string; href: string };
  /** The editorial policy page, already filtered to published pages by the caller. */
  policyHref?: string;
  className?: string;
};

/** "9 October 2026" from an ISO date. Spelled-out month, never a numeric day-month order (content rules: unambiguous dates). */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * The provenance band: who reviewed the page, when, how its facts are checked, and how to report an error. Readers and raters
 * look for who is responsible for a page (rules/eeat-and-people-first.md, trust check TR6). One quiet line near the end,
 * never a badge: it states facts a person can check. The `<time>` element carries the machine date.
 */
export default function PageProvenance({ reviewer, role, reviewedOn, howLine, report, policyHref, className }: PageProvenanceProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn("section-y-sm", className)}>
      <div className="container-site">
        <div className="surface mx-auto max-w-3xl p-6 sm:p-7">
          <h2 id={headingId} className="t-eyebrow">
            {UI.provenance.region}
          </h2>
          <p className="t-body mt-3 text-foreground">
            {UI.provenance.reviewedBy} <span className="font-semibold">{reviewer}</span> ({role}) {UI.provenance.on}{" "}
            <time dateTime={reviewedOn}>{longDate(reviewedOn)}</time>. {howLine}
          </p>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
            <Link href={report.href} className="inline-flex min-h-11 items-center text-base font-semibold text-link underline underline-offset-4">
              {report.label}
            </Link>
            {policyHref && (
              <Link href={policyHref} className="inline-flex min-h-11 items-center text-base font-semibold text-link underline underline-offset-4">
                {UI.provenance.policyLink}
              </Link>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
