import { useId, type ReactNode } from "react";
import HeroContent from "./hero/HeroContent";
import { SiteDashboardMockup } from "./hero/mockups";
import type { HeroBaseProps } from "./hero/types";
import { cn } from "@/utils/cn";

type ProductHeroProps = HeroBaseProps & {
  /** Visual on the right. Defaults to the site-dashboard mockup. */
  visual?: ReactNode;
};

/**
 * Product hero: large display headline, one primary action, verified highlights, and a
 * dashboard mockup over a soft ambient glow. Use on the homepage and flagship product pages.
 */
export default function ProductHero({ visual, className, ...content }: ProductHeroProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn("grain relative isolate overflow-hidden", className)}>
      <div className="ambient-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div className="mx-auto grid max-w-(--container-max) items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
        <HeroContent {...content} headingId={headingId} scale="display" />
        <div className="relative min-w-0">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_45%,var(--glow-teal),transparent)]" aria-hidden="true" />
          {visual ?? <SiteDashboardMockup className="drop-shadow-2xl" />}
        </div>
      </div>
    </section>
  );
}
