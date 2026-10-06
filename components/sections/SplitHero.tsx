import { useId, type ReactNode } from "react";
import HeroContent from "./hero/HeroContent";
import { StagingFlowMockup } from "./hero/mockups";
import type { HeroBaseProps } from "./hero/types";
import { cn } from "@/utils/cn";

type SplitHeroProps = HeroBaseProps & {
  /** Visual beside the text. Defaults to the staging-flow mockup. */
  visual?: ReactNode;
  /** Put the visual on the left at large widths. */
  reverse?: boolean;
};

/**
 * Split hero: headline and actions on one side, a product UI mockup on the other.
 * A step down from ProductHero (H1 scale, calmer background) for service and feature pages.
 */
export default function SplitHero({ visual, reverse = false, className, ...content }: SplitHeroProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn("relative isolate overflow-hidden border-b border-border", className)}>
      <div className="ambient-glow absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="mx-auto grid max-w-(--container-max) items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className={cn(reverse && "lg:order-2")}>
          <HeroContent {...content} headingId={headingId} scale="h1" />
        </div>
        <div className={cn("min-w-0", reverse && "lg:order-1")}>{visual ?? <StagingFlowMockup />}</div>
      </div>
    </section>
  );
}
