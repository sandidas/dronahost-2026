import type { Metadata } from "next";
import AnswerBlock from "@/components/sections/AnswerBlock";
import PathRouter from "@/components/sections/bespoke/PathRouter";
import ResponsibilitySplit from "@/components/sections/bespoke/ResponsibilitySplit";
import {
  SAMPLE_ANSWER,
  SAMPLE_PATHS,
  SAMPLE_SPLIT_KEEP,
  SAMPLE_SPLIT_LOOK_AFTER,
} from "@/content/placeholders";

export const metadata: Metadata = {
  title: "Phase 1 preview",
  robots: { index: false, follow: false },
};

/**
 * Dev-only: the three home-page components exactly as they will sit on a page (full width, page rhythm, h2 headings),
 * with samples forced on. Used for review at real phone and desktop widths. Not the home page.
 */
export default function Phase1Preview() {
  return (
    <main id="main-content" tabIndex={-1} className="bg-background">
      <PathRouter eyebrow="Start here" title="Where are you starting from?" description="Pick the line that sounds like you and we will point you to the right place." paths={SAMPLE_PATHS} showSamples />
      <AnswerBlock eyebrow="In plain words" title={SAMPLE_ANSWER.title} answer={SAMPLE_ANSWER.answer} detail={SAMPLE_ANSWER.detail} link={{ label: "See WordPress hosting", href: "/wordpress-hosting" }} claim="managed-hosting-tasks" showSamples />
      <ResponsibilitySplit
        eyebrow="Plainly"
        title="What we look after, and what stays with you"
        description="So you know exactly what you are buying."
        weLookAfter={SAMPLE_SPLIT_LOOK_AFTER}
        youKeep={SAMPLE_SPLIT_KEEP}
        showSamples
      />
    </main>
  );
}
