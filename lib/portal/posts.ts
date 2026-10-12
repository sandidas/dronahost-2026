import type { Types } from "mongoose";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { assertCan, can } from "@/lib/auth/permissions";
import { ROLES } from "@/lib/auth/roles";
import { BUILDER_PROBLEMS } from "@/content/portal-strings";
import { toBuilderDoc } from "@/lib/builder/legacy";
import type { BuilderDoc, PostKind } from "@/lib/builder/model";
import { normalizeSeo, type PostSeo } from "@/lib/builder/seo";
import { publishProblems, type Problem } from "@/lib/builder/validate";
import { Post, type IPost } from "@/lib/models/post";
import { portalDb } from "./db";
import { parsePostInput } from "./post-input";
import { isReservedPageSlug } from "@/lib/builder/reserved";
import { SLUG_MAX, SLUG_PATTERN } from "./slug";
import { fail, guarded, isDuplicateKey, ok, toObjectId, type Actor, type Result } from "./result";

export type PostStatus = IPost["status"];

export type PostRow = {
  id: string;
  kind: PostKind;
  title: string;
  slug: string;
  status: PostStatus;
  locked: boolean;
  authorName: string;
  updatedAt: string;
};

export type PostDetail = PostRow & {
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  /** The builder document. Older posts (Tiptap JSON or HTML) arrive converted to one Rich text block. */
  content: BuilderDoc;
  seo: PostSeo;
  publishedAt: string | null;
  publishedByName: string | null;
  canEdit: boolean;
};

/** What a successful change returns, so the caller can refresh the public pages. */
export type PostChange = { id: string; kind: PostKind; slug: string; previousSlug: string; status: PostStatus };

const notDeleted = { deletedAt: null } as const;

/** Publishing problems as field errors keyed by block id ("page" for the document), one message per line. */
function problemsByBlock(problems: Problem[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of problems) {
    const key = p.blockId || "page";
    out[key] = out[key] ? `${out[key]}\n${p.message}` : p.message;
  }
  return out;
}

/**
 * The collection also holds older records, some written by other tools with other field names, so every field gets a
 * safe default: the list and the editor must open them rather than fail.
 */
const toRow = (p: IPost): PostRow => ({
  id: String(p._id),
  kind: p.kind === "page" ? "page" : "post",
  title: typeof p.title === "string" ? p.title : "",
  slug: typeof p.slug === "string" ? p.slug : "",
  status: p.status === "published" ? "published" : "draft",
  locked: Boolean(p.locked),
  authorName: typeof p.author?.name === "string" ? p.author.name : "",
  updatedAt: new Date(p.updatedAt ?? p.createdAt ?? 0).toISOString(),
});

const change = (p: IPost, previousSlug = p.slug): PostChange => ({ id: String(p._id), kind: p.kind ?? "post", slug: p.slug, previousSlug, status: p.status });

async function findLive(id: Types.ObjectId): Promise<IPost | null> {
  return (await Post.findOne({ _id: id, ...notDeleted }).lean()) as IPost | null;
}

/** Documents saved before pages existed have no `kind`; they are posts. */
const kindQuery = (kind: PostKind) => (kind === "page" ? { kind: "page" } : { kind: { $ne: "page" } });

export async function listPortalPosts(actor: Actor, filter: { status?: unknown; kind?: unknown } = {}): Promise<Result<PostRow[]>> {
  return guarded("portal.posts.list", async () => {
    assertCan(actor.role, "post.list");
    await portalDb();
    const status = filter.status === "draft" || filter.status === "published" ? filter.status : undefined;
    const kind = filter.kind === "post" || filter.kind === "page" ? filter.kind : undefined;
    const rows = (await Post.find({ ...notDeleted, ...(status && { status }), ...(kind && kindQuery(kind)) }, { content: 0 })
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean()) as IPost[];
    return ok(rows.map(toRow));
  });
}

function toDetail(actor: Actor, p: IPost): PostDetail {
  return {
    ...toRow(p),
    excerpt: typeof p.excerpt === "string" ? p.excerpt : "",
    coverImage: typeof p.coverImage === "string" ? p.coverImage : "",
    coverImageAlt: typeof p.coverImageAlt === "string" ? p.coverImageAlt : "",
    content: toBuilderDoc(p.content),
    seo: normalizeSeo(p.seo),
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    publishedByName: p.publishedBy?.name || null,
    canEdit: can(actor.role, "post.edit", { locked: Boolean(p.locked) }),
  };
}

export async function getPortalPost(actor: Actor, rawId: unknown): Promise<Result<PostDetail>> {
  return guarded("portal.posts.get", async () => {
    assertCan(actor.role, "post.view");
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const p = await findLive(id);
    return p ? ok(toDetail(actor, p)) : fail(PORTAL_ERRORS.notFound);
  });
}

/** The editor opens posts and pages by slug (/dashboard/posts/<slug>). The slug is matched as a plain string. */
export async function getPortalPostBySlug(actor: Actor, rawSlug: unknown): Promise<Result<PostDetail>> {
  return guarded("portal.posts.get", async () => {
    assertCan(actor.role, "post.view");
    if (typeof rawSlug !== "string" || !SLUG_PATTERN.test(rawSlug)) return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const p = (await Post.findOne({ slug: rawSlug, ...notDeleted }).lean()) as IPost | null;
    return p ? ok(toDetail(actor, p)) : fail(PORTAL_ERRORS.notFound);
  });
}

export type SlugCheckResult = { state: "free" | "taken" | "reserved"; suggestion: string };

/** Words put in front of a taken slug when the page itself offers none. */
const FALLBACK_WORDS: Record<PostKind, readonly string[]> = { post: ["blog", "read"], page: ["page", "about"] };

/**
 * Whether a slug is free for this post or page, and a free one when it is not: the slug with a word in front (the
 * page's own words first, then a plain word for its kind), or as a last resort with a number at the end. Another
 * post, another page and the site's own routes all count as taken. Read-only.
 */
export async function checkSlug(actor: Actor, raw: unknown): Promise<Result<SlugCheckResult>> {
  return guarded("portal.posts.slug", async () => {
    assertCan(actor.role, "post.view");
    const r = (raw && typeof raw === "object" ? raw : {}) as { slug?: unknown; kind?: unknown; postId?: unknown; words?: unknown };
    const kind: PostKind = r.kind === "page" ? "page" : "post";
    const slug = typeof r.slug === "string" ? r.slug.trim().toLowerCase() : "";
    if (!SLUG_PATTERN.test(slug) || slug.length > SLUG_MAX) return fail(PORTAL_ERRORS.slug, { slug: PORTAL_ERRORS.slug });
    const own = toObjectId(r.postId);
    const words = (Array.isArray(r.words) ? r.words : []).filter((w): w is string => typeof w === "string" && /^[a-z0-9]{2,30}$/.test(w)).slice(0, 8);
    const reserved = (s: string) => s === "new" || (kind === "page" && isReservedPageSlug(s));
    const candidates = [...new Set([slug, ...[...words, ...FALLBACK_WORDS[kind]].map((w) => `${w}-${slug}`), ...Array.from({ length: 8 }, (_, i) => `${slug}-${i + 2}`)])].filter(
      (c) => c.length <= SLUG_MAX && !reserved(c),
    );
    await portalDb();
    // Every record counts, deleted ones included: they keep a renamed slug, and the unique index covers them all.
    const taken = new Set(((await Post.find({ slug: { $in: candidates }, ...(own && { _id: { $ne: own } }) }, { slug: 1 }).lean()) as IPost[]).map((p) => p.slug));
    const state = reserved(slug) ? "reserved" : taken.has(slug) ? "taken" : "free";
    const suggestion = state === "free" ? slug : (candidates.find((c) => c !== slug && !taken.has(c)) ?? `${slug}-${Date.now().toString(36)}`);
    return ok({ state, suggestion });
  });
}

/**
 * New posts and pages are always drafts and unlocked, whoever creates them; the author is the signed-in person. The
 * kind (post or page) is set here and never changes afterwards.
 */
export async function createPost(actor: Actor, raw: unknown): Promise<Result<PostChange>> {
  return guarded("portal.posts.create", async () => {
    assertCan(actor.role, "post.create");
    const kind: PostKind = (raw as { kind?: unknown } | null)?.kind === "page" ? "page" : "post";
    const input = parsePostInput(raw, kind);
    if (!input.ok) return input;
    await portalDb();
    // A slug the editor filled in from the title (never typed by the person) moves aside for an existing one, with a
    // word from the page in front, instead of refusing the first save.
    const auto = (raw as { autoSlug?: unknown; slugWords?: unknown }).autoSlug === true;
    if (auto) {
      const free = await checkSlug(actor, { slug: input.data.slug, kind, words: (raw as { slugWords?: unknown }).slugWords });
      if (free.ok) input.data.slug = free.data.suggestion;
    }
    try {
      const doc = await Post.create({
        ...input.data,
        kind,
        status: "draft",
        locked: false,
        author: { name: actor.name || actor.email, bio: "", avatar: "" },
        authorId: toObjectId(actor.id),
        publishedAt: null,
        publishedBy: null,
      });
      return ok(change(doc.toObject() as IPost));
    } catch (err) {
      if (isDuplicateKey(err, "slug")) return fail(PORTAL_ERRORS.duplicateSlug, { slug: PORTAL_ERRORS.duplicateSlug });
      throw err;
    }
  });
}

/**
 * Saves title, slug, excerpt, cover image and content only. For staff the write is conditional on the
 * post still being unlocked, so an admin locking it a moment earlier wins.
 */
export async function updatePost(actor: Actor, rawId: unknown, raw: unknown): Promise<Result<PostChange>> {
  return guarded("portal.posts.update", async () => {
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const current = await findLive(id);
    if (!current) return fail(PORTAL_ERRORS.notFound);
    const input = parsePostInput(raw, current.kind ?? "post");
    if (!input.ok) return input;
    // A live page changes straight away, so it must pass the publishing checks: nothing on it may silently disappear.
    if (current.status === "published") {
      const problems = publishProblems(input.data.content);
      if (problems.length) return fail(BUILDER_PROBLEMS.updateBlocked, problemsByBlock(problems));
    }
    if (!can(actor.role, "post.edit", { locked: Boolean(current.locked) })) {
      return fail(current.locked && actor.role === ROLES.STAFF ? PORTAL_ERRORS.locked : PORTAL_ERRORS.forbidden);
    }
    const condition = actor.role === ROLES.ADMIN ? {} : { locked: { $ne: true } };
    try {
      const updated = (await Post.findOneAndUpdate({ _id: id, ...notDeleted, ...condition }, { $set: input.data }, { returnDocument: "after" }).lean()) as IPost | null;
      if (!updated) return fail(PORTAL_ERRORS.locked);
      return ok(change(updated, current.slug));
    } catch (err) {
      if (isDuplicateKey(err, "slug")) return fail(PORTAL_ERRORS.duplicateSlug, { slug: PORTAL_ERRORS.duplicateSlug });
      throw err;
    }
  });
}

/** Admin only. Publishing locks the post by default; the admin can unlock it afterwards. */
export async function setPublished(actor: Actor, rawId: unknown, publish: boolean): Promise<Result<PostChange>> {
  return guarded("portal.posts.publish", async () => {
    assertCan(actor.role, "post.publish");
    const id = toObjectId(rawId);
    if (!id || typeof publish !== "boolean") return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const current = await findLive(id);
    if (!current) return fail(PORTAL_ERRORS.notFound);
    if (publish) {
      // The same rules as the hand-built pages: every site section passes its schema, images have alt text, ...
      const problems = publishProblems(toBuilderDoc(current.content));
      if (problems.length) return fail(BUILDER_PROBLEMS.publishBlocked, problemsByBlock(problems));
    }
    const update = publish
      ? {
          status: "published" as const,
          locked: true,
          publishedAt: current.publishedAt ?? new Date(),
          publishedBy: { id: toObjectId(actor.id), name: actor.name || actor.email },
        }
      : { status: "draft" as const };
    const updated = (await Post.findOneAndUpdate({ _id: id, ...notDeleted }, { $set: update }, { returnDocument: "after" }).lean()) as IPost | null;
    return updated ? ok(change(updated)) : fail(PORTAL_ERRORS.notFound);
  });
}

export async function setLocked(actor: Actor, rawId: unknown, locked: boolean): Promise<Result<PostChange>> {
  return guarded("portal.posts.lock", async () => {
    assertCan(actor.role, "post.lock");
    const id = toObjectId(rawId);
    if (!id || typeof locked !== "boolean") return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const updated = (await Post.findOneAndUpdate({ _id: id, ...notDeleted }, { $set: { locked } }, { returnDocument: "after" }).lean()) as IPost | null;
    return updated ? ok(change(updated)) : fail(PORTAL_ERRORS.notFound);
  });
}

/**
 * Admin only. A soft delete, like the rest of the project's data: the post leaves the site and the list,
 * and its slug is released so a new post can use it.
 */
export async function deletePost(actor: Actor, rawId: unknown): Promise<Result<PostChange>> {
  return guarded("portal.posts.delete", async () => {
    assertCan(actor.role, "post.delete");
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const current = await findLive(id);
    if (!current) return fail(PORTAL_ERRORS.notFound);
    const updated = (await Post.findOneAndUpdate(
      { _id: id, ...notDeleted },
      { $set: { deletedAt: new Date(), status: "draft", slug: `${current.slug}-deleted-${String(id)}` } },
      { returnDocument: "after" },
    ).lean()) as IPost | null;
    return updated ? ok({ ...change(updated, current.slug), slug: current.slug }) : fail(PORTAL_ERRORS.notFound);
  });
}

export type PostCounts = { draft: number; published: number; locked: number };

export async function countPosts(actor: Actor): Promise<Result<PostCounts>> {
  return guarded("portal.posts.count", async () => {
    assertCan(actor.role, "post.list");
    await portalDb();
    const [draft, published, locked] = await Promise.all([
      Post.countDocuments({ ...notDeleted, status: "draft" }),
      Post.countDocuments({ ...notDeleted, status: "published" }),
      Post.countDocuments({ ...notDeleted, locked: true }),
    ]);
    return ok({ draft, published, locked });
  });
}
