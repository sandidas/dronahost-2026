import { Clock } from "lucide-react";
import { useId } from "react";
import { UI } from "@/content/strings";
import { longDate } from "@/components/sections/bespoke/PageProvenance";
import { cn } from "@/utils/cn";
import BannerShell, {
  type BannerScope,
  Kicker,
  QuietLink,
  SCOPE,
} from "./BannerShell";

export type GuideBannerProps = {
  eyebrow?: string;
  /** Optional for the page builder, where nothing is required. */
  title?: string;
  /** Two or three sentences on what the guide covers and who it is for. */
  summary?: string;
  meta?: { readingTime?: string; updatedOn?: string; reviewer?: string };
  /** Three to five outcomes the reader will have at the end: the stops on the route. */
  learn: readonly string[];
  /** Quiet action only: a Learn page never leads with a sale. */
  cta?: { label: string; href: string };
  /** line = the route runs across under the text · vertical = the route runs down beside it. */
  layout?: "line" | "vertical";
  /** Number the stops (step-by-step guides). */
  numbered?: boolean;
  /** ink = navy map with contour lines · page = the site background. */
  scope?: BannerScope;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Informational intent, banner 2, "route map": the guide's outcomes are drawn as a transit line, from an orange start
 * through teal stops to the end, with the reading time on a sign like a journey time. The reader sees the whole trip
 * before they start.
 */
export default function GuideBanner({
  eyebrow,
  title,
  summary,
  meta,
  learn,
  cta,
  layout = "line",
  numbered = false,
  scope = "ink",
  headingLevel = "h1",
  className,
}: GuideBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const vertical = layout === "vertical";
  const stops = learn.length;

  const sign = meta &&
    (meta.readingTime || meta.updatedOn || meta.reviewer) && (
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        {meta.readingTime && (
          <span className="inline-flex items-center gap-2 rounded-sm bg-accent px-3 py-1.5 text-accent-foreground">
            <Clock className="size-3.5" aria-hidden="true" />
            <span className="t-meta">
              <span className="sr-only">{UI.banners.readingTime}: </span>
              {meta.readingTime}
            </span>
          </span>
        )}
        {meta.updatedOn && (
          <span className="t-meta text-muted-foreground">
            {UI.banners.updated}{" "}
            <time dateTime={meta.updatedOn}>{longDate(meta.updatedOn)}</time>
          </span>
        )}
        {meta.reviewer && (
          <span className="t-meta text-muted-foreground">
            {UI.banners.reviewedBy}{" "}
            <span className="text-foreground">{meta.reviewer}</span>
          </span>
        )}
      </div>
    );

  // Route: a line through the stop markers. Horizontal from md for the `line` layout; vertical otherwise.
  const List = numbered ? "ol" : "ul";
  const route = (
    <div className="relative">
      <p className="t-meta mb-8 text-muted-foreground">
        {UI.banners.youWillLearn}
      </p>
      <div className="relative">
        <span
          aria-hidden="true"
          className={cn(
            "absolute bg-gradient-to-b from-[var(--action-fill)] via-accent to-accent start-[11px] top-3 bottom-3 w-0.5",
            !vertical &&
              "md:bg-gradient-to-r md:start-3 md:end-3 md:top-[11px] md:bottom-auto md:h-0.5 md:w-auto",
          )}
        />
        <List
          className={cn(
            "relative grid gap-8",
            !vertical &&
              "md:grid-cols-[repeat(var(--stops),minmax(0,1fr))] md:gap-6",
          )}
          style={{ ["--stops" as string]: stops }}
        >
          {learn.map((item, i) => {
            const first = i === 0;
            const last = i === stops - 1;
            return (
              <li
                key={item}
                className={cn(
                  "flex gap-5",
                  !vertical && "md:flex-col md:gap-5",
                )}
                data-stop={i}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 grid size-6 shrink-0 place-items-center rounded-full border-2 tabular-nums text-[0.625rem] font-semibold",
                    first
                      ? "border-[var(--action-fill)] bg-[var(--action-fill)] text-[var(--on-action)]"
                      : last
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-accent bg-background text-link",
                  )}
                >
                  {numbered ? i + 1 : ""}
                </span>
                <span className="min-w-0">
                  {(first || last) && (
                    <span
                      className={cn(
                        "t-meta mb-1 block",
                        first ? "text-foreground" : "text-link",
                      )}
                    >
                      {first ? UI.banners.start : UI.banners.finish}
                    </span>
                  )}
                  <span className="block text-[0.9375rem] leading-snug text-foreground sm:text-base">
                    {item}
                  </span>
                </span>
              </li>
            );
          })}
        </List>
      </div>
    </div>
  );

  const ink = scope === "ink";
  const art = (
    <div aria-hidden="true" className="contours absolute inset-0 -z-10" />
  );

  return (
    <BannerShell
      headingId={title ? headingId : undefined}
      className={cn(
        SCOPE[scope],
        ink ? "band-ink" : "bg-background",
        className,
      )}
      art={art}
    >
      <div
        className={cn(
          "grid gap-14",
          vertical && "lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20",
        )}
      >
        <div className="min-w-0">
          {eyebrow && <Kicker className="mb-7">{eyebrow}</Kicker>}
          {title && (
            <Heading
              id={headingId}
              className="t-statement max-w-4xl text-foreground"
            >
              {title}
            </Heading>
          )}
          {summary && <p className={cn("t-lead max-w-[58ch]", title && "mt-7")}>{summary}</p>}
          {sign}
          {cta && (
            <QuietLink href={cta.href} className="mt-6">
              {cta.label}
            </QuietLink>
          )}
        </div>
        {stops > 0 && <div className={cn(vertical && "lg:self-center")}>{route}</div>}
      </div>
    </BannerShell>
  );
}
