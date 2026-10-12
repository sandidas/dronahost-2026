import { z } from "zod";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import type { BuilderDoc, PostKind } from "@/lib/builder/model";
import { isReservedPageSlug } from "@/lib/builder/reserved";
import { DEFAULT_SEO, type PostSeo } from "@/lib/builder/seo";
import { SITE_URL } from "@/lib/seo/config";
import { parseBuilderDoc } from "@/lib/builder/validate";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { fail, fieldErrorsFrom, type Result } from "./result";
import { SLUG_MAX, SLUG_PATTERN, slugify } from "./slug";

/**
 * The only post fields a save accepts. zod drops every other key, so a status, lock, author or
 * published-by value in the request is ignored: publishing and locking have their own admin-only actions.
 */
const PostFields = z.object({
  title: z.string({ error: PORTAL_ERRORS.title }).trim().min(1, PORTAL_ERRORS.title).max(200, PORTAL_ERRORS.title),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(SLUG_MAX, PORTAL_ERRORS.slug)
    .refine((v) => v === "" || SLUG_PATTERN.test(v), PORTAL_ERRORS.slug)
    .default(""),
  excerpt: z.string().trim().max(300, PORTAL_ERRORS.excerpt).default(""),
  coverImage: z
    .string()
    .trim()
    .max(2048, PORTAL_ERRORS.coverImage)
    .refine((v) => v === "" || isSafeImageSrc(v), PORTAL_ERRORS.coverImage)
    .default(""),
  coverImageAlt: z.string().trim().max(200, PORTAL_ERRORS.coverImageAlt).default(""),
  content: z.unknown(),
  seo: z
    .object({
      title: z.string().trim().max(70, PORTAL_ERRORS.seo.title).default(""),
      description: z.string().trim().max(170, PORTAL_ERRORS.seo.description).default(""),
      focusKeyword: z.string().trim().max(60, PORTAL_ERRORS.seo.keyword).default(""),
      canonical: z.string().trim().max(500, PORTAL_ERRORS.seo.canonical).refine((v) => v === "" || isCanonical(v), PORTAL_ERRORS.seo.canonical).default(""),
      noindex: z.boolean().default(false),
      ogTitle: z.string().trim().max(90, PORTAL_ERRORS.seo.ogTitle).default(""),
      ogDescription: z.string().trim().max(200, PORTAL_ERRORS.seo.ogDescription).default(""),
      ogImage: z.string().trim().max(2048).refine((v) => v === "" || isSafeImageSrc(v), PORTAL_ERRORS.coverImage).default(""),
      faqSchema: z.boolean().default(true),
    })
    .default(DEFAULT_SEO),
});

/** A canonical address is a site path or a full https address on this site, never another domain. */
function isCanonical(value: string): boolean {
  if (/^\/(?!\/)[A-Za-z0-9\-_/.]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === new URL(SITE_URL).hostname;
  } catch {
    return false;
  }
}

export type PostInput = { title: string; slug: string; excerpt: string; coverImage: string; coverImageAlt: string; content: BuilderDoc; seo: PostSeo };

/** Validates a save. `kind` is where it will print, read by the caller: a page cannot take an address the site uses. */
export function parsePostInput(raw: unknown, kind: PostKind): Result<PostInput> {
  const parsed = PostFields.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    return fail(Object.values(fieldErrors)[0] ?? PORTAL_ERRORS.generic, fieldErrors);
  }
  const doc = parseBuilderDoc(parsed.data.content);
  if (!doc.ok) return fail(doc.error, { content: doc.error });
  const slug = parsed.data.slug || slugify(parsed.data.title);
  if (!SLUG_PATTERN.test(slug)) return fail(PORTAL_ERRORS.slug, { slug: PORTAL_ERRORS.slug });
  // "new" is the editor's own address (/dashboard/posts/new); a page also cannot take an address the site already uses.
  if (slug === "new" || (kind === "page" && isReservedPageSlug(slug))) return fail(PORTAL_ERRORS.reservedSlug, { slug: PORTAL_ERRORS.reservedSlug });
  return { ok: true, data: { ...parsed.data, slug, content: doc.doc } };
}
