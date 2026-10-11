"use server";

import { revalidatePath, updateTag } from "next/cache";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { getActor } from "@/lib/auth/session";
import { ANNOUNCEMENTS_TAG } from "../announcement-feed";
import { deleteAnnouncement, saveAnnouncement, setAnnouncementActive, type AnnouncementView } from "../announcements";
import { fail, type Actor, type Result } from "../result";

async function run<T>(op: (actor: Actor) => Promise<Result<T>>): Promise<Result<T>> {
  const actor = await getActor();
  if (!actor) return fail(PORTAL_ERRORS.signedOut);
  const res = await op(actor);
  if (res.ok) {
    // The banner cache and every page that rendered it pick up the change on the next request.
    updateTag(ANNOUNCEMENTS_TAG);
    revalidatePath("/dashboard/announcements");
  }
  return res;
}

export type AnnouncementInput = { message: string; linkUrl: string; startsAt: string; endsAt: string; active: boolean };

export async function saveAnnouncementAction(id: string | null, input: AnnouncementInput): Promise<Result<AnnouncementView>> {
  return run((actor) => saveAnnouncement(actor, id, input));
}

export async function setAnnouncementActiveAction(id: string, active: boolean): Promise<Result<undefined>> {
  return run((actor) => setAnnouncementActive(actor, id, active));
}

export async function deleteAnnouncementAction(id: string): Promise<Result<undefined>> {
  return run((actor) => deleteAnnouncement(actor, id));
}
