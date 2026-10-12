import { z } from "zod";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import type { BuilderDoc, PostKind } from "@/lib/builder/model";
import { isReservedPageSlug } from "@/lib/builder/reserved";
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
  content: z.unknown(),
});

export type PostInput = { title: string; slug: string; excerpt: string; coverImage: string; content: BuilderDoc };

/** Validates a save. `kind` comes from the stored post (or the create request), never from the fields being saved. */
export function parsePostInput(raw: unknown, kind: PostKind): Result<PostInput> {
  const parsed = PostFields.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    return fail(Object.values(fieldErrors)[0] ?? PORTAL_ERRORS.generic, fieldErrors);
  }
  const doc = parseBuilderDoc(parsed.data.content, kind);
  if (!doc.ok) return fail(doc.error, { content: doc.error });
  const slug = parsed.data.slug || slugify(parsed.data.title);
  if (!SLUG_PATTERN.test(slug)) return fail(PORTAL_ERRORS.slug, { slug: PORTAL_ERRORS.slug });
  // "new" is the editor's own address (/dashboard/posts/new); a page also cannot take an address the site already uses.
  if (slug === "new" || (kind === "page" && isReservedPageSlug(slug))) return fail(PORTAL_ERRORS.reservedSlug, { slug: PORTAL_ERRORS.reservedSlug });
  return { ok: true, data: { ...parsed.data, slug, content: doc.doc } };
}
