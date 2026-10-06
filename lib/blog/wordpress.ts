import { plainText, prepareArticle, readingMinutes } from "./sanitize";
import { BlogUnavailableError, type BlogCategory, type BlogListItem, type BlogPage, type BlogPost } from "./types";

/**
 * Headless WordPress source (REST API, read-only, no auth). Set WORDPRESS_API_URL to the REST
 * base, e.g. https://cms.dronahost.com/wp-json/wp/v2. Responses are cached with ISR and
 * revalidated hourly; a stale copy is served if WordPress is briefly down.
 */
const REVALIDATE = 3600;

type WpTerm = { id: number; name: string; slug: string; taxonomy: string };
type WpPost = {
  slug: string;
  date_gmt: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    author?: { name?: string; description?: string; avatar_urls?: Record<string, string> }[];
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }[];
    "wp:term"?: WpTerm[][];
  };
};

export const wordpressConfigured = (): boolean => Boolean(process.env.WORDPRESS_API_URL);

async function wp<T>(path: string): Promise<{ data: T; headers: Headers }> {
  const base = process.env.WORDPRESS_API_URL;
  if (!base) throw new BlogUnavailableError();
  try {
    const res = await fetch(`${base}${path}`, { next: { revalidate: REVALIDATE, tags: ["blog"] }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new BlogUnavailableError();
    return { data: (await res.json()) as T, headers: res.headers };
  } catch {
    throw new BlogUnavailableError();
  }
}

const iso = (gmt: string) => (gmt.endsWith("Z") ? gmt : `${gmt}Z`);

function toItem(p: WpPost): BlogListItem {
  const cat = p._embedded?.["wp:term"]?.[0]?.find((t) => t.taxonomy === "category");
  const author = p._embedded?.author?.[0];
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const avatars = author?.avatar_urls ?? {};
  return {
    slug: p.slug,
    title: plainText(p.title.rendered),
    excerpt: plainText(p.excerpt.rendered).slice(0, 300),
    published: iso(p.date_gmt),
    modified: iso(p.modified_gmt),
    category: cat ? { name: cat.name, slug: cat.slug } : null,
    author: { name: author?.name || "DronaHost team", bio: author?.description?.trim() || null, avatar: avatars["96"] ?? avatars["48"] ?? null },
    image: media?.source_url ? { url: media.source_url, alt: media.alt_text ?? "", width: media.media_details?.width ?? 1200, height: media.media_details?.height ?? 630 } : null,
    readingMinutes: readingMinutes(p.content.rendered),
  };
}

export async function listPosts({ page = 1, perPage = 9, category }: { page?: number; perPage?: number; category?: string } = {}): Promise<BlogPage> {
  let catQuery = "";
  if (category) {
    const { data } = await wp<{ id: number }[]>(`/categories?slug=${encodeURIComponent(category)}&_fields=id`);
    if (data[0]) catQuery = `&categories=${data[0].id}`;
    else return { posts: [], page, totalPages: 1 };
  }
  const { data, headers } = await wp<WpPost[]>(`/posts?_embed=1&per_page=${perPage}&page=${page}${catQuery}`);
  return { posts: data.map(toItem), page, totalPages: Number(headers.get("x-wp-totalpages") ?? 1) || 1 };
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const { data } = await wp<WpPost[]>(`/posts?_embed=1&slug=${encodeURIComponent(slug)}`);
  const p = data[0];
  if (!p) return null;
  return { ...toItem(p), ...prepareArticle(p.content.rendered) };
}

export async function listCategories(): Promise<BlogCategory[]> {
  const { data } = await wp<{ name: string; slug: string; count: number }[]>(`/categories?per_page=50&hide_empty=true&_fields=name,slug,count`);
  return data.filter((c) => c.slug !== "uncategorized").map(({ name, slug, count }) => ({ name, slug, count }));
}

export async function listSlugs(): Promise<{ slug: string; modified: string }[]> {
  const { data } = await wp<{ slug: string; modified_gmt: string }[]>(`/posts?per_page=100&_fields=slug,modified_gmt`);
  return data.map((p) => ({ slug: p.slug, modified: iso(p.modified_gmt) }));
}
