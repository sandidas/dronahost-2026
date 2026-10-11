import { Post, type IPost } from "@/lib/models/post";
import { connectToDatabase } from "@/lib/mongodb";
import { docText } from "@/lib/editor/schema";
import { renderTiptapHtml } from "@/lib/editor/render";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { prepareArticle, plainText, readingMinutes, withHeadingIds } from "./sanitize";
import { BlogUnavailableError, type BlogCategory, type BlogListItem, type BlogPage, type BlogPost } from "./types";

/** MongoDB source: posts written in the portal (and older imported posts). Used while WORDPRESS_API_URL is not set. */

/** Portal posts store Tiptap JSON; posts from before the portal store HTML. Both come out sanitised. */
function renderContent(content: IPost["content"]) {
  if (typeof content === "string") return prepareArticle(content);
  return withHeadingIds(renderTiptapHtml(content));
}

const contentMinutes = (content: IPost["content"]) =>
  typeof content === "string" ? readingMinutes(content) : Math.max(1, Math.round(docText(content).split(/\s+/).filter(Boolean).length / 220));

const catSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function toItem(p: IPost): BlogListItem {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    published: new Date(p.publishedAt ?? p.createdAt).toISOString(),
    modified: new Date(p.updatedAt).toISOString(),
    category: p.category ? { name: p.category, slug: catSlug(p.category) } : null,
    author: { name: p.author?.name || "DronaHost team", bio: p.author?.bio?.trim() || null, avatar: p.author?.avatar || null },
    image: isSafeImageSrc(p.coverImage) ? { url: p.coverImage, alt: "", width: 1200, height: 630 } : null,
    readingMinutes: contentMinutes(p.content),
  };
}

/** Visitors see published, undeleted posts only. Drafts never match, whatever slug is requested. */
const live = { status: "published", deletedAt: null } as const;

async function db() {
  try {
    await connectToDatabase();
  } catch {
    throw new BlogUnavailableError();
  }
}

export async function listPosts({ page = 1, perPage = 9, category }: { page?: number; perPage?: number; category?: string } = {}): Promise<BlogPage> {
  await db();
  const all = (await Post.find(live).sort({ publishedAt: -1 }).lean()) as unknown as IPost[];
  const filtered = category ? all.filter((p) => catSlug(p.category) === category) : all;
  const start = (page - 1) * perPage;
  return { posts: filtered.slice(start, start + perPage).map(toItem), page, totalPages: Math.max(1, Math.ceil(filtered.length / perPage)) };
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 200) return null;
  await db();
  const p = (await Post.findOne({ slug, ...live }).lean()) as unknown as IPost | null;
  if (!p) return null;
  return { ...toItem(p), ...renderContent(p.content), excerpt: plainText(p.excerpt) };
}

export async function listCategories(): Promise<BlogCategory[]> {
  await db();
  const all = (await Post.find(live, { category: 1 }).lean()) as unknown as IPost[];
  const counts = new Map<string, { name: string; count: number }>();
  for (const p of all) {
    if (!p.category) continue;
    const slug = catSlug(p.category);
    counts.set(slug, { name: p.category, count: (counts.get(slug)?.count ?? 0) + 1 });
  }
  return [...counts].map(([slug, v]) => ({ slug, ...v }));
}

export async function listSlugs(): Promise<{ slug: string; modified: string }[]> {
  await db();
  const rows = (await Post.find(live, { slug: 1, updatedAt: 1 }).lean()) as unknown as IPost[];
  return rows.map((p) => ({ slug: p.slug, modified: new Date(p.updatedAt).toISOString() }));
}
