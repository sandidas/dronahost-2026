import type { Types } from "mongoose";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { assertCan, can } from "@/lib/auth/permissions";
import { ROLES } from "@/lib/auth/roles";
import type { TiptapDoc } from "@/lib/editor/schema";
import { Post, type IPost } from "@/lib/models/post";
import { portalDb } from "./db";
import { parsePostInput } from "./post-input";
import { fail, guarded, isDuplicateKey, ok, toObjectId, type Actor, type Result } from "./result";

export type PostStatus = IPost["status"];

export type PostRow = {
  id: string;
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
  /** Tiptap JSON, or HTML for posts written before the portal (the editor converts it on first save). */
  content: TiptapDoc | string;
  publishedAt: string | null;
  publishedByName: string | null;
  canEdit: boolean;
};

/** What a successful change returns, so the caller can refresh the public pages. */
export type PostChange = { id: string; slug: string; previousSlug: string; status: PostStatus };

const notDeleted = { deletedAt: null } as const;

const toRow = (p: IPost): PostRow => ({
  id: String(p._id),
  title: p.title,
  slug: p.slug,
  status: p.status,
  locked: Boolean(p.locked),
  authorName: p.author?.name ?? "",
  updatedAt: new Date(p.updatedAt).toISOString(),
});

const change = (p: IPost, previousSlug = p.slug): PostChange => ({ id: String(p._id), slug: p.slug, previousSlug, status: p.status });

async function findLive(id: Types.ObjectId): Promise<IPost | null> {
  return (await Post.findOne({ _id: id, ...notDeleted }).lean()) as IPost | null;
}

export async function listPortalPosts(actor: Actor, filter: { status?: unknown } = {}): Promise<Result<PostRow[]>> {
  return guarded("portal.posts.list", async () => {
    assertCan(actor.role, "post.list");
    await portalDb();
    const status = filter.status === "draft" || filter.status === "published" ? filter.status : undefined;
    const rows = (await Post.find({ ...notDeleted, ...(status && { status }) }, { content: 0 })
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean()) as IPost[];
    return ok(rows.map(toRow));
  });
}

export async function getPortalPost(actor: Actor, rawId: unknown): Promise<Result<PostDetail>> {
  return guarded("portal.posts.get", async () => {
    assertCan(actor.role, "post.view");
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.notFound);
    await portalDb();
    const p = await findLive(id);
    if (!p) return fail(PORTAL_ERRORS.notFound);
    return ok({
      ...toRow(p),
      excerpt: p.excerpt ?? "",
      coverImage: p.coverImage ?? "",
      content: p.content,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
      publishedByName: p.publishedBy?.name || null,
      canEdit: can(actor.role, "post.edit", { locked: Boolean(p.locked) }),
    });
  });
}

/** New posts are always drafts and unlocked, whoever creates them; the author is the signed-in person. */
export async function createPost(actor: Actor, raw: unknown): Promise<Result<PostChange>> {
  return guarded("portal.posts.create", async () => {
    assertCan(actor.role, "post.create");
    const input = parsePostInput(raw);
    if (!input.ok) return input;
    await portalDb();
    try {
      const doc = await Post.create({
        ...input.data,
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
    const input = parsePostInput(raw);
    if (!input.ok) return input;
    await portalDb();
    const current = await findLive(id);
    if (!current) return fail(PORTAL_ERRORS.notFound);
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
