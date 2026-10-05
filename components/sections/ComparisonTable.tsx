import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { Fragment, useId } from "react";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type ComparisonColumn = {
  key: string;
  label: string;
  /** Small line under the column label, e.g. a price or tagline. */
  sublabel?: string;
  /** Highlights this column (the recommended option). */
  highlight?: boolean;
  href?: string;
};

/** true = included, false = not included, string = shown as text, null = not applicable. */
export type ComparisonValue = boolean | string | null;

export type ComparisonRow = {
  label: string;
  hint?: string;
  values: Record<string, ComparisonValue>;
};

export type ComparisonGroup = {
  /** Optional group heading, rendered as a full-width row. */
  title?: string;
  rows: readonly ComparisonRow[];
};

type ComparisonTableProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Accessible table caption (visually hidden). */
  caption: string;
  columns: readonly ComparisonColumn[];
  groups: readonly ComparisonGroup[];
  /** Text of the top-left header cell. Default "Feature". */
  rowHeader?: string;
  headingLevel?: "h2" | "h3";
  /** Render only the scrollable table (no section, container or header), e.g. inside <details>. */
  bare?: boolean;
  className?: string;
};

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true)
    return (
      <>
        <Check className="mx-auto size-5 text-success" aria-hidden="true" strokeWidth={2.5} />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus className="mx-auto size-5 text-subtle-foreground" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  if (value === null) return <span className="text-subtle-foreground">Not applicable</span>;
  return <span className="text-foreground">{value}</span>;
}

/**
 * Accessible comparison table: a real <table> with a caption, column and row headers, a
 * keyboard-scrollable wrapper on narrow screens and a sticky first column. Booleans render
 * as icons with screen-reader text. Handles 2 to 6 columns and any number of rows.
 */
export default function ComparisonTable({
  eyebrow,
  title,
  description,
  caption,
  columns,
  groups,
  rowHeader = "Feature",
  headingLevel = "h2",
  bare = false,
  className,
}: ComparisonTableProps) {
  const headingId = useId();
  if (columns.length === 0 || groups.length === 0) return null;

  const scrollArea = (
        <div
          role="region"
          aria-label={`${caption} (scrollable)`}
          tabIndex={0}
          className={cn("surface overflow-x-auto !rounded-2xl", !bare && title ? "mt-3 sm:mt-14" : "mt-0")}
        >
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky start-0 z-10 w-28 bg-card px-3 py-5 sm:w-[34%] sm:px-5 text-start align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {rowHeader}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn("px-4 py-5 text-center align-bottom", col.highlight && "bg-accent/10")}
                  >
                    <span className="block text-base font-semibold text-foreground">
                      {col.href ? (
                        <Link href={col.href} className="hover:underline">
                          {col.label}
                        </Link>
                      ) : (
                        col.label
                      )}
                    </span>
                    {col.sublabel && <span className="mt-1 block text-xs font-normal text-muted-foreground">{col.sublabel}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, gi) => (
                <Fragment key={group.title ?? gi}>
                  {group.title && (
                    <tr>
                      <th scope="colgroup" colSpan={columns.length + 1} className="border-t border-border bg-muted px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </th>
                    </tr>
                  )}
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-t border-border">
                      <th scope="row" className="sticky start-0 z-10 bg-card px-3 py-4 text-start font-medium text-foreground sm:px-5">
                        {row.label}
                        {row.hint && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{row.hint}</span>}
                      </th>
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-4 py-4 text-center align-middle", col.highlight && "bg-accent/10")}>
                          <Cell value={row.values[col.key] ?? null} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
  );

  if (bare) return scrollArea;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <p className="t-small mt-8 text-center text-muted-foreground sm:hidden">Scroll sideways to compare every column.</p>
        <div
          role="region"
          aria-label={`${caption} (scrollable)`}
          tabIndex={0}
          className={cn("surface overflow-x-auto !rounded-2xl", title ? "mt-3 sm:mt-14" : "mt-0")}
        >
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky start-0 z-10 w-28 bg-card px-3 py-5 sm:w-[34%] sm:px-5 text-start align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {rowHeader}
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn("px-4 py-5 text-center align-bottom", col.highlight && "bg-accent/10")}
                  >
                    <span className="block text-base font-semibold text-foreground">
                      {col.href ? (
                        <Link href={col.href} className="hover:underline">
                          {col.label}
                        </Link>
                      ) : (
                        col.label
                      )}
                    </span>
                    {col.sublabel && <span className="mt-1 block text-xs font-normal text-muted-foreground">{col.sublabel}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group, gi) => (
                <Fragment key={group.title ?? gi}>
                  {group.title && (
                    <tr>
                      <th scope="colgroup" colSpan={columns.length + 1} className="border-t border-border bg-muted px-5 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </th>
                    </tr>
                  )}
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-t border-border">
                      <th scope="row" className="sticky start-0 z-10 bg-card px-3 py-4 text-start font-medium text-foreground sm:px-5">
                        {row.label}
                        {row.hint && <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{row.hint}</span>}
                      </th>
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-4 py-4 text-center align-middle", col.highlight && "bg-accent/10")}>
                          <Cell value={row.values[col.key] ?? null} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
