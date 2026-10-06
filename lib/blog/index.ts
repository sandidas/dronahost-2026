import * as mongo from "./mongo";
import * as wordpress from "./wordpress";

export * from "./types";

/** WordPress when WORDPRESS_API_URL is set, otherwise the legacy MongoDB posts. */
const source = () => (wordpress.wordpressConfigured() ? wordpress : mongo);

export const listPosts = (...a: Parameters<typeof wordpress.listPosts>) => source().listPosts(...a);
export const getPost = (slug: string) => source().getPost(slug);
export const listCategories = () => source().listCategories();
export const listSlugs = () => source().listSlugs();

/** Up to `limit` other posts, same category first. Never throws: related posts are optional. */
export async function relatedPosts(current: { slug: string; category: { slug: string } | null }, limit = 3) {
  try {
    const { posts } = await listPosts({ perPage: 12, category: current.category?.slug });
    const same = posts.filter((p) => p.slug !== current.slug);
    if (same.length >= limit || !current.category) return same.slice(0, limit);
    const { posts: more } = await listPosts({ perPage: 12 });
    return [...same, ...more.filter((p) => p.slug !== current.slug && !same.some((s) => s.slug === p.slug))].slice(0, limit);
  } catch {
    return [];
  }
}
