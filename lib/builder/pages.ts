import { Post, type IPost } from "@/lib/models/post";
import { connectToDatabase } from "@/lib/mongodb";
import { SLUG_PATTERN } from "@/lib/portal/slug";
import { isBuilderDoc, type BuilderDoc } from "./model";
import { isReservedPageSlug } from "./reserved";

/** A published builder page, as the public route needs it. */
export type PublicPage = { slug: string; title: string; excerpt: string; coverImage: string; content: BuilderDoc; published: string; modified: string };

/** Visitors see published, undeleted pages only. Drafts never match, whatever address is requested. */
const live = { kind: "page", status: "published", deletedAt: null } as const;

export async function getPublishedPage(slug: string): Promise<PublicPage | null> {
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug) || isReservedPageSlug(slug)) return null;
  await connectToDatabase();
  const p = (await Post.findOne({ slug, ...live }).lean()) as IPost | null;
  if (!p || !isBuilderDoc(p.content)) return null;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    coverImage: p.coverImage ?? "",
    content: p.content,
    published: new Date(p.publishedAt ?? p.createdAt).toISOString(),
    modified: new Date(p.updatedAt).toISOString(),
  };
}

/** Published page addresses, for the sitemap and for prerendering at build time. */
export async function listPublishedPageSlugs(): Promise<{ slug: string; modified: string }[]> {
  await connectToDatabase();
  const rows = (await Post.find(live, { slug: 1, updatedAt: 1 }).lean()) as IPost[];
  return rows.filter((p) => !isReservedPageSlug(p.slug)).map((p) => ({ slug: p.slug, modified: new Date(p.updatedAt).toISOString() }));
}
