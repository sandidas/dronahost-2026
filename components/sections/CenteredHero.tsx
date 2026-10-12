import { useId, type ReactNode } from "react";
import HeroContent from "./hero/HeroContent";
import type { HeroBaseProps } from "./hero/types";
import { cn } from "@/utils/cn";

/** Headline and summary are optional (the page builder requires nothing); what is empty is left out. */
type CenteredHeroProps = Omit<HeroBaseProps, "title" | "description"> & {
  title?: string;
  description?: string;
  /** Optional content under the actions, e.g. a verified logo strip. */
  children?: ReactNode;
};

/**
 * Minimal centered hero: eyebrow, headline, summary and actions with no imagery.
 * For About, legal, comparison and other text-led pages.
 */
export default function CenteredHero({ children, className, ...content }: CenteredHeroProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={content.title || content.titleAccent ? headingId : undefined} className={cn("grain relative isolate overflow-hidden border-b border-border", className)}>
      <div className="ambient-glow absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <div className="mx-auto max-w-(--container-max) px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <HeroContent {...content} headingId={headingId} scale="h1" align="center" />
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
