import { z } from "zod";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { parseTiptapDoc, type TiptapDoc } from "@/lib/editor/schema";
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

export type PostInput = { title: string; slug: string; excerpt: string; coverImage: string; content: TiptapDoc };

export function parsePostInput(raw: unknown): Result<PostInput> {
  const parsed = PostFields.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error.issues);
    return fail(Object.values(fieldErrors)[0] ?? PORTAL_ERRORS.generic, fieldErrors);
  }
  const doc = parseTiptapDoc(parsed.data.content);
  if (!doc.ok) return fail(doc.error, { content: doc.error });
  const slug = parsed.data.slug || slugify(parsed.data.title);
  if (!SLUG_PATTERN.test(slug)) return fail(PORTAL_ERRORS.slug, { slug: PORTAL_ERRORS.slug });
  return { ok: true, data: { ...parsed.data, slug, content: doc.doc } };
}
