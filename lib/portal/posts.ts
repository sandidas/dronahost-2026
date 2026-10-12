import type { Types } from "mongoose";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { assertCan, can } from "@/lib/auth/permissions";
import { ROLES } from "@/lib/auth/roles";
import { BUILDER_PROBLEMS } from "@/content/portal-strings";
import { toBuilderDoc, type BuilderDoc, type PostKind } from "@/lib/builder/model";
import { normalizeSeo, type PostSeo } from "@/lib/builder/seo";
import { publishProblems } from "@/lib/builder/validate";
import { Post, type IPost } from "@/lib/models/post";
import { portalDb } from "./db";
import { parsePostInput } from "./post-input";
import { SLUG_PATTERN } from "./slug";
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
      const problems = publishProblems(toBuilderDoc(current.content), current.kind ?? "post");
      if (problems.length) {
        const byBlock: Record<string, string> = {};
        for (const p of problems) byBlock[p.blockId || "page"] = byBlock[p.blockId || "page"] ? `${byBlock[p.blockId || "page"]}\n${p.message}` : p.message;
        return fail(BUILDER_PROBLEMS.publishBlocked, byBlock);
      }
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
