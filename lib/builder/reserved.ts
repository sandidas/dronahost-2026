/**
 * Addresses a builder page can never take: every top-level route the site already has (a hand-built page would win
 * and the builder page would never show), the portals, and words kept for the system. tests/portal/builder.test.ts
 * fails when a new folder under app/[locale]/(marketing) is missing here.
 */
export const RESERVED_PAGE_SLUGS: ReadonlySet<string> = new Set([
  // app/[locale]/(marketing)
  "about",
  "backup-policy",
  "blog",
  "business-hosting",
  "cloud-web-hosting",
  "consultation",
  "contact",
  "cookie-policy",
  "data-processing",
  "domains",
  "growth-services",
  "hosting",
  "managed-vps-hosting",
  "migration",
  "migration-terms",
  "pricing",
  "pricing-policy",
  "privacy",
  "refund-policy",
  "security",
  "seo-services",
  "sla",
  "support-policy",
  "terms",
  "vs",
  "wordpress-hosting",
  "wordpress-website-design",
  // Portals, development pages, API and files
  "dashboard",
  "office",
  "sign-in",
  "no-access",
  "v2",
  "api",
  "admin",
  "account",
  "checkout",
  "kb",
  "experience",
  "sitemap",
  "robots",
  "llms",
  "images",
  "logo",
  "screenshots",
  "fonts",
  // The editor uses /dashboard/posts/new for a new post or page.
  "new",
]);

/** A locale-looking first segment ("en-gb", "de") is routed as a locale, so a page there would never show. */
const LOCALE_LIKE = /^(?:[a-z]{2}-[a-z]{2}|ar|de|en|es|fr|hi|it|ja|nl|pt|ru|zh)$/;

export const isReservedPageSlug = (slug: string): boolean => RESERVED_PAGE_SLUGS.has(slug) || LOCALE_LIKE.test(slug);
