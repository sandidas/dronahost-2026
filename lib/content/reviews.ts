import type { TestimonialItem } from "@/components/sections/Testimonials";

/**
 * Verified customer reviews (real name, role, company, a link to the source). None exist yet, so testimonial sections
 * hide themselves. When `reviews.json` is added, load it here and validate every entry with Zod.
 */
export const loadVerifiedReviews = (): TestimonialItem[] => [];
