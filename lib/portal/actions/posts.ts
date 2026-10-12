"use server";

import { revalidatePath } from "next/cache";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { getActor } from "@/lib/auth/session";
import { checkSlug, createDraft, createPost, deletePost, setLocked, setPublished, updatePost, type PostChange, type SlugCheckResult } from "../posts";
import { fail, type Actor, type Result } from "../result";

/**
 * Refreshes the cached public pages (the blog or the builder page, and the sitemap) after a change visitors can see.
 * A switch between post and page refreshes both, so the old address stops printing it.
 */
function refreshPublicBlog(change: PostChange, always = false): void {
  if (!always && change.status !== "published") return;
  for (const kind of new Set([change.kind, change.previousKind])) {
    if (kind === "page") revalidatePath("/[locale]/(marketing)/[slug]", "page");
    else revalidatePath("/[locale]/(marketing)/blog", "layout");
  }
  revalidatePath("/sitemap.xml");
}

async function withActor<T>(run: (actor: Actor) => Promise<Result<T>>): Promise<Result<T>> {
  const actor = await getActor();
  if (!actor) return fail(PORTAL_ERRORS.signedOut);
  return run(actor);
}

/** Creates (id null) or saves a post. Only the kind, title, slug, excerpt, cover image and content are read from the input. */
export async function savePostAction(id: string | null, input: unknown): Promise<Result<PostChange>> {
  return withActor(async (actor) => {
    const res = id === null ? await createPost(actor, input) : await updatePost(actor, id, input);
    if (res.ok) refreshPublicBlog(res.data);
    return res;
  });
}

/** "New post": saves an empty draft; the list then opens it at /dashboard/posts/<id>. */
export async function createDraftAction(): Promise<Result<PostChange>> {
  return withActor((actor) => createDraft(actor));
}

/** Whether a slug is free, and a free one when it is not (the SEO and Page tabs). Changes nothing. */
export async function checkSlugAction(input: { slug: string; kind: string; postId: string | null; words: string[] }): Promise<Result<SlugCheckResult>> {
  return withActor((actor) => checkSlug(actor, input));
}

export async function setPublishedAction(id: string, publish: boolean): Promise<Result<PostChange>> {
  return withActor(async (actor) => {
    const res = await setPublished(actor, id, publish);
    if (res.ok) refreshPublicBlog(res.data, true);
    return res;
  });
}

export async function setLockedAction(id: string, locked: boolean): Promise<Result<PostChange>> {
  return withActor((actor) => setLocked(actor, id, locked));
}

export async function deletePostAction(id: string): Promise<Result<PostChange>> {
  return withActor(async (actor) => {
    const res = await deletePost(actor, id);
    if (res.ok) refreshPublicBlog(res.data, true);
    return res;
  });
}
