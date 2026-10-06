import Image from "next/image";
import { useId } from "react";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

export type LogoItem = {
  name: string;
  /** Logo image (SVG/PNG). Without it the name is shown as a text wordmark. */
  src?: string;
  href?: string;
  /** True only with written permission from the customer. */
  verified?: boolean;
};

export type LogoRating = {
  score: number;
  outOf: number;
  platform: string;
  count: number;
  /** Public profile that backs the rating. Without it the rating is hidden. */
  sourceUrl: string;
};

type LogoWallProps = {
  eyebrow?: string;
  title?: string;
  logos: readonly LogoItem[];
  rating?: LogoRating;
  /** Showcase only: render unverified logos with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Customer logo strip. Renders only logos flagged `verified` (written permission); hides
 * the whole section otherwise. A third-party rating appears only with a source link.
 * Handles 1 to 12 logos and missing images (text wordmark).
 */
export default function LogoWall({ eyebrow, title, logos, rating, showSamples = false, headingLevel = "h2", className }: LogoWallProps) {
  const headingId = useId();
  const shown = showSamples ? logos : logos.filter((l) => l.verified);
  if (shown.length === 0) return null;
  const Heading = headingLevel;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("py-12 sm:py-16", className)}>
      <div className="container-site text-center">
        {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
        {title && (
          <Heading id={headingId} className="t-h4 mt-2 text-muted-foreground">
            {title}
          </Heading>
        )}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6" {...reveal()}>
          {shown.map((logo) => {
            const mark = logo.src ? (
              <Image src={logo.src} alt={logo.name} width={140} height={40} className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 dark:invert" />
            ) : (
              <span className="text-xl font-semibold tracking-tight text-muted-foreground">{logo.name}</span>
            );
            return (
              <li key={logo.name} className="flex flex-col items-center gap-1">
                {logo.href ? (
                  <a href={logo.href} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-11 items-center">
                    {mark}
                  </a>
                ) : (
                  mark
                )}
                {!logo.verified && <span className="text-[0.6875rem] font-semibold text-warning">Sample, unverified</span>}
              </li>
            );
          })}
        </ul>
        {rating && (
          <p className="t-small mt-8 text-muted-foreground">
            Rated {rating.score} out of {rating.outOf} from {rating.count.toLocaleString("en-US")} reviews on{" "}
            <a href={rating.sourceUrl} rel="noopener noreferrer" target="_blank" className="font-semibold text-link underline underline-offset-4">
              {rating.platform}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
