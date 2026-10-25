import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LIVE_LOCALES, LOCALES, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/config";
import { isBlocked } from "@/lib/seo/indexing";

// ─── Static pages ─────────────────────────────────────────────────────────────

const ALL_STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "weekly" },
  { url: `${SITE_URL}/wordpress-hosting`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${SITE_URL}/pricing`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${SITE_URL}/domains`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/managed-vps-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/cloud-web-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/business-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/wordpress-website-design`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/seo-services`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/growth-services`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/about`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: "yearly" },
  { url: `${SITE_URL}/migration`, priority: 0.6, changeFrequency: "yearly" },
  { url: `${SITE_URL}/consultation`, priority: 0.6, changeFrequency: "yearly" },
  { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: "daily" },
  // Regional
  { url: `${SITE_URL}/hosting/us`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/uk`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/eu`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/uae`, priority: 0.6, changeFrequency: "monthly" },
  // Legal
  { url: `${SITE_URL}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/cookie-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/terms`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/refund-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/support-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/pricing-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/migration-terms`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/backup-policy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/sla`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/security`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/data-processing`, priority: 0.3, changeFrequency: "yearly" },
];

/** Pages that are noindex in their own metadata whatever the page map says (decision 42: legal pages are finished after the main pages). */
const ALWAYS_NOINDEX = new Set(["/terms", "/privacy", "/data-processing", "/security", "/hosting/us", "/hosting/uk", "/hosting/eu", "/hosting/uae"]);

/** Only Ready pages (content engine page map) that are not noindex go in the sitemap. */
const STATIC_PAGES: MetadataRoute.Sitemap = ALL_STATIC_PAGES.filter((p) => {
  const path = p.url.slice(SITE_URL.length) || "/";
  return !isBlocked(path) && !ALWAYS_NOINDEX.has(path);
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published blog post slugs + updatedAt from MongoDB.
  // Falls back to empty array if DB is unreachable at build time.
  // Published pages from the page builder (/dashboard), except those set to noindex in their SEO tab. Started before the
  // blog query so both share one database wait when the database is unreachable at build time.
  const builderPagesPromise = import("@/lib/builder/pages")
    .then(({ listPublishedPageSlugs }) => listPublishedPageSlugs({ indexable: true }))
    .catch(() => [] as { slug: string; modified: string }[]);
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const { listSlugs } = await import("@/lib/blog");
    const posts = await listSlugs();
    blogEntries = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.modified),
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // DB unreachable at build time — sitemap still valid without blog entries
  }

  const builderPages: MetadataRoute.Sitemap = (await builderPagesPromise).map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: new Date(p.modified),
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  // One entry per live locale; with several live locales each entry lists every version (hreflang).
  const toLocale = (url: string, locale: (typeof LIVE_LOCALES)[number]) => `${SITE_URL}${localePath(url.slice(SITE_URL.length) || "/", locale)}`;
  return [...STATIC_PAGES, ...blogEntries, ...builderPages].flatMap((entry) =>
    LIVE_LOCALES.map((locale) => ({
      ...entry,
      url: toLocale(entry.url, locale),
      ...(LIVE_LOCALES.length > 1 && {
        alternates: { languages: { ...Object.fromEntries(LIVE_LOCALES.map((l) => [LOCALES[l].tag, toLocale(entry.url, l)])), "x-default": toLocale(entry.url, DEFAULT_LOCALE) } },
      }),
    })),
  );
}
