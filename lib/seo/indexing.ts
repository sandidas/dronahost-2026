import pageStatus from "@/content-engine/project/page-status.json";

/**
 * Which pages search engines may index. The content engine's page map decides: a page it marks Blocked (a required
 * section or an owner fact is missing) is noindex and left out of the sitemap until it is Ready. Pages the map does not
 * list (blog posts, approved policy pages) are indexable. Regenerate with `npm run content:page-map -- --write`.
 */
const STATUS: Record<string, string> = pageStatus.pages;

const norm = (path: string): string => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

export function isBlocked(path: string): boolean {
  return STATUS[norm(path)] === "Blocked";
}
