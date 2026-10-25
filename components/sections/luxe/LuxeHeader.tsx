import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

type LuxeHeaderProps = {
  id: string;
  eyebrow?: string;
  title: string;
  /** The closing phrase of the title, set in a heavier weight. Ignored unless the title ends with it. */
  accent?: string;
  description?: string;
  headingLevel?: "h2" | "h3";
  align?: "start" | "center";
  /** "split" puts the description beside the heading on wide screens. */
  layout?: "stacked" | "split";
  /** No scroll reveal (the block is above the fold). */
  still?: boolean;
  /** Extra content under the description (for example a link). */
  children?: ReactNode;
  className?: string;
};

/** Splits a title into its light part and its heavier closing phrase. */
export function splitAccent(title: string, accent?: string): { lead: string; accent?: string } {
  if (!accent || !title.endsWith(accent) || accent === title) return { lead: title };
  return { lead: title.slice(0, -accent.length).trimEnd(), accent };
}

/** The last sentence of a two-sentence heading ("We move your site. You approve every step."), used as its closing phrase. */
export function lastSentence(title: string): string | undefined {
  const parts = title.split(/(?<=[.!?])\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : undefined;
}

/** A light statement with one heavier closing phrase. Shared by the heroes and section headers of the Home look. */
export function LuxeTitle({ title, accent }: { title: string; accent?: string }) {
  const parts = splitAccent(title, accent);
  return (
    <>
      {parts.lead}
      {parts.accent && (
        <>
          {" "}
          <span className="luxe-accent">{parts.accent}</span>
        </>
      )}
    </>
  );
}

/** Eyebrow with a hairline, a light Sora heading with a heavier closing phrase, and an optional description. */
export default function LuxeHeader({ id, eyebrow, title, accent, description, headingLevel = "h2", align = "start", layout = "stacked", still = false, children, className }: LuxeHeaderProps) {
  const Heading = headingLevel;
  const centered = align === "center";
  const split = layout === "split" && Boolean(description);
  return (
    <div
      {...(still ? {} : reveal())}
      className={cn(
        split ? "grid items-end gap-6 lg:grid-cols-2 lg:gap-12" : "max-w-3xl",
        centered && !split && "mx-auto text-center",
        className,
      )}
    >
      <div>
        {eyebrow && <p className={centered ? "eyebrow-plain" : "eyebrow-rule"}>{eyebrow}</p>}
        <Heading id={id} className={cn("t-luxe-h2", eyebrow && "mt-4")}>
          <LuxeTitle title={title} accent={accent} />
        </Heading>
      </div>
      {(description || children) && (
        <div className={cn(!split && "mt-5", centered && !split && "mx-auto")}>
          {description && <p className={cn("t-luxe-lead max-w-[36rem]", centered && !split && "mx-auto")}>{description}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
