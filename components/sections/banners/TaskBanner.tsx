import { Check } from "lucide-react";
import { useId } from "react";
import { UI } from "@/content/strings";
import { cn } from "@/utils/cn";
import BannerShell, { Kicker, PrimaryAction } from "./BannerShell";

/** One input as the example shows it: a label, the value given, and how full the gauge is (0 to 1). */
export type TaskReading = { label: string; value: string; level?: number };

export type TaskBannerProps = {
  /** What kind of task the page performs. Sets how the example draws its inputs: sliders, ticks or choice chips. */
  kind: "calculator" | "checklist" | "planner";
  eyebrow?: string;
  /** The task in the reader's words: "Estimate what hosting will cost you". */
  title: string;
  description: string;
  /** What the reader needs to have or answer. */
  inputs: readonly string[];
  /** What they get at the end, in one sentence. Label results "estimate" when they are. */
  outcome: string;
  /** A worked example: the question as a reader would ask it, the readings it uses, and the exact answer. */
  example?: {
    question: string;
    answer: string;
    readings?: readonly TaskReading[];
    result?: string;
  };
  cta: { label: string; href: string };
  /** split = text beside the instrument · stacked = the instrument under the text. */
  layout?: "split" | "stacked";
  headingLevel?: "h1" | "h2";
  className?: string;
};

function Reading({
  kind,
  reading,
}: {
  kind: TaskBannerProps["kind"];
  reading: TaskReading;
}) {
  const level = Math.min(Math.max(reading.level ?? 0.5, 0), 1);
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <dt className="t-meta text-muted-foreground">{reading.label}</dt>
        <dd className="tabular-nums text-sm text-foreground">{reading.value}</dd>
      </div>
      <div aria-hidden="true" className="mt-3">
        {kind === "calculator" && (
          <div className="relative h-1.5 rounded-full bg-border">
            <div
              className="absolute inset-y-0 start-0 rounded-full bg-accent"
              style={{ width: `${level * 100}%` }}
            />
            <div
              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-card shadow rtl:translate-x-1/2"
              style={{ insetInlineStart: `${level * 100}%` }}
            />
          </div>
        )}
        {kind === "checklist" && (
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={cn(
                  "grid size-6 place-items-center rounded-sm border",
                  n < Math.round(level * 5)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border",
                )}
              >
                {n < Math.round(level * 5) && (
                  <Check className="size-3.5" strokeWidth={3} />
                )}
              </span>
            ))}
          </div>
        )}
        {kind === "planner" && (
          <div className="grid grid-cols-3 gap-1 rounded-md border border-border p-1">
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className={cn(
                  "h-6 rounded-sm",
                  n === Math.min(Math.floor(level * 3), 2)
                    ? "bg-accent"
                    : "bg-foreground/[0.05]",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generative AI intent, banner 2, "instrument panel": a tool-page opener on graph paper. The text says what the reader
 * needs and what they get; the worked example is drawn as an instrument (sliders for a calculator, ticks for a
 * checklist, choice chips for a planner) with the answer on a dark result screen. It is an illustration: the real tool
 * sits below, and the page is complete as text without it.
 */
export default function TaskBanner({
  kind,
  eyebrow,
  title,
  description,
  inputs,
  outcome,
  example,
  cta,
  layout = "split",
  headingLevel = "h1",
  className,
}: TaskBannerProps) {
  const headingId = useId();
  const Heading = headingLevel;
  const split = layout === "split" && Boolean(example);

  const instrument = example && (
    <figure className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <figcaption className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="t-meta text-muted-foreground">
          {UI.banners.example}
        </span>
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
      </figcaption>
      <div className="px-6 pt-5 sm:px-7">
        <p className="t-meta text-muted-foreground">{UI.banners.question}</p>
        <p className="mt-2 font-heading text-lg leading-snug tracking-[-0.01em] text-foreground">
          {example.question}
        </p>
        {example.readings && example.readings.length > 0 && (
          <dl className="mt-4 divide-y divide-border border-t border-border">
            {example.readings.map((r) => (
              <Reading key={r.label} kind={kind} reading={r} />
            ))}
          </dl>
        )}
      </div>
      <div className="dark m-3 mt-4 rounded-xl bg-background p-5 text-foreground sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-meta text-link">{UI.banners.result}</p>
          {example.result && (
            <p className="tabular-nums text-2xl text-link">{example.result}</p>
          )}
        </div>
        <p className="mt-3 tabular-nums text-[0.8125rem] leading-relaxed text-foreground">
          <span className="text-link">&gt; </span>
          {example.answer}
        </p>
      </div>
    </figure>
  );

  const art = (
    <div
      aria-hidden="true"
      className="graph-paper absolute inset-0 -z-10 [mask-image:linear-gradient(90deg,transparent,black_35%,black)]"
    />
  );

  return (
    <BannerShell
      headingId={headingId}
      className={cn("bg-background", className)}
      art={art}
    >
      <div
        className={cn(
          "grid gap-14",
          split &&
            "lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-20",
        )}
      >
        <div className="min-w-0">
          {eyebrow && <Kicker className="mb-7">{eyebrow}</Kicker>}
          <Heading
            id={headingId}
            className="t-statement max-w-4xl text-foreground"
          >
            {title}
          </Heading>
          <p className="t-lead mt-8 max-w-[56ch]">{description}</p>
          <dl className="mt-10 grid max-w-2xl gap-8 sm:grid-cols-2">
            <div>
              <dt className="t-meta text-muted-foreground">
                {UI.banners.youNeed}
              </dt>
              <dd>
                <ol className="mt-3 space-y-2.5">
                  {inputs.map((input, i) => (
                    <li
                      key={input}
                      className="flex items-baseline gap-3 text-[0.9375rem] text-foreground"
                    >
                      <span className="tabular-nums text-xs text-link">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {input}
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
            <div>
              <dt className="t-meta text-muted-foreground">
                {UI.banners.youGet}
              </dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-foreground">
                {outcome}
              </dd>
            </div>
          </dl>
          <div className="mt-10">
            <PrimaryAction href={cta.href}>{cta.label}</PrimaryAction>
          </div>
        </div>
        {instrument && (
          <div className={cn(!split && "max-w-2xl")}>{instrument}</div>
        )}
      </div>
    </BannerShell>
  );
}
