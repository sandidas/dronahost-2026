"use server";

import { revalidatePath } from "next/cache";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { getActor } from "@/lib/auth/session";
import { createPost, deletePost, setLocked, setPublished, updatePost, type PostChange } from "../posts";
import { fail, type Actor, type Result } from "../result";

/** Refreshes the cached public pages (the blog or the builder page, and the sitemap) after a change visitors can see. */
function refreshPublicBlog(change: PostChange, always = false): void {
  if (!always && change.status !== "published") return;
  if (change.kind === "page") revalidatePath("/[locale]/(marketing)/[slug]", "page");
  else revalidatePath("/[locale]/(marketing)/blog", "layout");
  revalidatePath("/sitemap.xml");
}

async function withActor<T>(run: (actor: Actor) => Promise<Result<T>>): Promise<Result<T>> {
  const actor = await getActor();
  if (!actor) return fail(PORTAL_ERRORS.signedOut);
  return run(actor);
}

/** Creates (id null) or saves a post. Only title, slug, excerpt, cover image and content are read from the input. */
export async function savePostAction(id: string | null, input: unknown): Promise<Result<PostChange>> {
  return withActor(async (actor) => {
    const res = id === null ? await createPost(actor, input) : await updatePost(actor, id, input);
    if (res.ok) refreshPublicBlog(res.data);
    return res;
  });
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
