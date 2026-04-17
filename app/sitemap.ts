import type { MetadataRoute } from "next";
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
  { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: "daily" },
  // Regional
  { url: `${SITE_URL}/hosting/us`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/uk`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/eu`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/hosting/uae`, priority: 0.6, changeFrequency: "monthly" },
  // Comparison
  { url: `${SITE_URL}/vs/siteground`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/kinsta`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/wp-engine`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/bluehost`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/hostinger`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/a2-hosting`, priority: 0.6, changeFrequency: "monthly" },
  { url: `${SITE_URL}/vs/cloudways`, priority: 0.6, changeFrequency: "monthly" },
  // Legal
  { url: `${SITE_URL}/privacy`, priority: 0.3, changeFrequency: "yearly" },
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
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not set — skipping blog entries in sitemap");
    }

    const { connectToDatabase } = await import("@/lib/mongodb");
    const { Post } = await import("@/lib/models/post");
    await connectToDatabase();

    const posts = await Post.find(
      { status: "published", deletedAt: null },
      { slug: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean();

    blogEntries = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug as string}`,
      lastModified: new Date(p.updatedAt as Date),
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // DB unreachable at build time — sitemap still valid without blog entries
  }

  return [...STATIC_PAGES, ...blogEntries];
}
