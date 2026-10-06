import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LIVE_LOCALES, LOCALES, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/config";

// ─── Static pages ─────────────────────────────────────────────────────────────

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "weekly" },
  { url: `${SITE_URL}/wordpress-hosting`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${SITE_URL}/pricing`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${SITE_URL}/domains`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vps-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/cloud-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/business-hosting`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${SITE_URL}/web-design`, priority: 0.8, changeFrequency: "monthly" },
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
  { url: `${SITE_URL}/sla`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/security`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${SITE_URL}/data-processing`, priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published blog post slugs + updatedAt from MongoDB.
  // Falls back to empty array if DB is unreachable at build time.
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

  // One entry per live locale; with several live locales each entry lists every version (hreflang).
  const toLocale = (url: string, locale: (typeof LIVE_LOCALES)[number]) => `${SITE_URL}${localePath(url.slice(SITE_URL.length) || "/", locale)}`;
  return [...STATIC_PAGES, ...blogEntries].flatMap((entry) =>
    LIVE_LOCALES.map((locale) => ({
      ...entry,
      url: toLocale(entry.url, locale),
      ...(LIVE_LOCALES.length > 1 && {
        alternates: { languages: { ...Object.fromEntries(LIVE_LOCALES.map((l) => [LOCALES[l].tag, toLocale(entry.url, l)])), "x-default": toLocale(entry.url, DEFAULT_LOCALE) } },
      }),
    })),
  );
}
