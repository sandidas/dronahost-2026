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
    <section aria-labelledby={headingId} className={cn("relative isolate overflow-hidden", className)}>
      <div className="ambient-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
        <HeroContent {...content} headingId={headingId} scale="display" />
        <div className="min-w-0">{visual ?? <SiteDashboardMockup />}</div>
      </div>
    </section>
  );
}
