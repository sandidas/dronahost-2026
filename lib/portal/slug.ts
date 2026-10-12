export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MAX = 120;

/** "Hello, World! 2026" -> "hello-world-2026". Accents are folded to plain letters. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");
}

/** The slug a new draft gets before it has a title ("draft-1a2b3c4d"); the editor replaces it from the first title. */
export const DRAFT_SLUG = /^draft-[a-f0-9]{8}$/;
export const isDraftSlug = (slug: string): boolean => DRAFT_SLUG.test(slug);
