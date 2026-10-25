import { useId } from "react";
import { UI } from "@/content/strings";
import type { VerifiedRating } from "@/lib/content/reviews";
import { cn } from "@/utils/cn";

type RatingBandProps = {
  /** A verified rating (lib/content/reviews.ts). Null renders nothing. */
  rating: VerifiedRating | null;
  /** Development preview only: the rating is a sample and is labelled as one. */
  showSamples?: boolean;
  /** The band has no visible heading; the level is kept for the shared section API. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

const STAR = "M12 2.5l2.9 6.2 6.6.7-4.9 4.5 1.4 6.6L12 17.2 6 20.5l1.4-6.6L2.5 9.4l6.6-.7z";

/** Five decorative stars. The score is in the text next to them. */
export function Stars({ size = 20 }: { size?: number }) {
  return (
    <span aria-hidden="true" className="flex gap-0.5 text-action">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

/**
 * The rating band under the hero: the score from one public review platform, with links to every profile. Renders only
 * from verified review data, so it shows nothing until a real score exists. Never a made-up number or logo.
 */
export default function RatingBand({ rating, headingLevel = "h2", className }: RatingBandProps) {
  const headingId = useId();
  const Heading = headingLevel;
  if (!rating) return null;
  return (
    <section aria-labelledby={headingId} className={cn("py-10 sm:py-11", className)}>
      <div className="container-site flex flex-wrap items-center justify-between gap-7">
        <div className="flex flex-wrap items-center gap-4">
          <Stars />
          <Heading id={headingId} className="sr-only">
            {UI.luxe.ratingRegion}
          </Heading>
          <p className="text-base">
            <a href={rating.url} rel="noopener" className="link-quiet">
              <span className="font-heading font-medium text-foreground">{UI.luxe.rating(rating.score, rating.outOf, rating.platform, rating.count)}</span>
            </a>
          </p>
        </div>
        {rating.platforms.length > 0 && (
          <ul className="flex flex-wrap gap-3.5">
            {rating.platforms.map((p) => (
              <li key={p.name}>
                <a href={p.url} rel="noopener" className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-[1.125rem] font-heading text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
