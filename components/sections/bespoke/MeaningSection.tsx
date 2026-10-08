import { useId } from "react";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";
import ResponsibilitySplit, { splitHasContent, type SplitItem } from "./ResponsibilitySplit";

type MeaningSectionProps = {
  eyebrow?: string;
  /** One H2 for the whole section. A question reads best, for example "What does managed hosting mean?". */
  title: string;
  /** The direct answer, 40 to 80 words. Leave it out until the claims behind it render: the heading and the split still show. */
  answer?: string;
  weLookAfter: readonly SplitItem[];
  youKeep: readonly SplitItem[];
  lookAfterLabel?: string;
  keepLabel?: string;
  note?: string;
  /** Fewest visible lines each column needs for the split to show. Default 2. */
  minItems?: number;
  /** Showcase only: show gated lines too, with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "What it means" in one section: the direct answer under the heading, then who looks after what. It replaces an AnswerBlock
 * followed by a ResponsibilitySplit, which said the same thing twice under two headings. The answer and each split line are
 * gated on their own; with neither left, the section is omitted.
 */
export default function MeaningSection({ eyebrow, title, answer, weLookAfter, youKeep, lookAfterLabel, keepLabel, note, minItems = 2, showSamples = false, headingLevel = "h2", className }: MeaningSectionProps) {
  const headingId = useId();
  const hasSplit = splitHasContent(weLookAfter, youKeep, minItems, showSamples);
  if (!answer && !hasSplit) return null;

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={answer} headingLevel={headingLevel} align="start" />
        {hasSplit && (
          <div className={answer ? "mt-10 sm:mt-12" : "mt-12 sm:mt-14"}>
            <ResponsibilitySplit
              bare
              title={title}
              weLookAfter={weLookAfter}
              youKeep={youKeep}
              lookAfterLabel={lookAfterLabel}
              keepLabel={keepLabel}
              note={note}
              minItems={minItems}
              showSamples={showSamples}
              headingLevel={headingLevel}
            />
          </div>
        )}
      </div>
    </section>
  );
}
