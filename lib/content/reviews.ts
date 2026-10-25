import { z } from "zod";
import type { TestimonialItem } from "@/components/sections/Testimonials";
import reviewsFile from "@/data/reviews.json";

const ReviewEntry = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  topic: z.string().min(1),
  rating: z.number().min(1).max(5),
  quote: z.string().min(1),
  role: z.string().min(1).nullable(),
  company: z.string().min(1).nullable(),
  sourceUrl: z.url().nullable(),
  /** The owner holds the customer's written permission to publish their name and words. */
  consentOnFile: z.boolean(),
  /** Claims in the quote that DronaHost cannot back yet. Any entry here keeps the review out of production. */
  heldClaims: z.array(z.string()),
});
type ReviewEntry = z.infer<typeof ReviewEntry>;

const entries: ReviewEntry[] = z.array(ReviewEntry).parse(reviewsFile.reviews);

const toItem = (r: ReviewEntry): TestimonialItem => ({
  quote: r.quote,
  name: r.name,
  role: r.role ?? "",
  company: r.company ?? "",
  sourceUrl: r.sourceUrl ?? undefined,
});

const isPublishable = (r: ReviewEntry) => Boolean(r.role && r.company && r.sourceUrl && r.consentOnFile && r.heldClaims.length === 0);

/**
 * Verified customer reviews from `data/reviews.json`: real name, role, company, a source link, consent on file and no
 * held claims. Sections hide themselves when this is empty.
 */
export const loadVerifiedReviews = (): TestimonialItem[] => entries.filter(isPublishable).map(toItem);

/**
 * Every review in `data/reviews.json`, verified or not, for the development preview only (showSamples). No status label
 * is shown on the page (docs/rules/ui-ux-rules.md §3.7); the production gate is `loadVerifiedReviews`.
 */
export const loadPreviewReviews = (): TestimonialItem[] => entries.map(toItem);

/** A rating from a public review platform, with the link where anyone can check it. */
export type VerifiedRating = {
  /** "4.9" as shown by the platform. */
  score: string;
  /** "5". */
  outOf: string;
  /** Number of reviews behind the score, as shown by the platform. */
  count: string;
  /** The platform the score comes from, for example "Trustpilot". */
  platform: string;
  /** The public profile page where the score can be checked. */
  url: string;
  /** Other public profiles, each a real page. */
  platforms: readonly { name: string; url: string }[];
  /** ISO date (YYYY-MM-DD) the score was read. */
  checkedOn: string;
};

/**
 * The verified review rating for the RatingBand. Null until the owner adds a real profile with a real score (in
 * `reviews.json`, validated with Zod), so the band renders nothing in production today.
 */
export const loadVerifiedRating = (): VerifiedRating | null => null;
