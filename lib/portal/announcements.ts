import { z } from "zod";
import { ANNOUNCEMENTS_TEXT, PORTAL_ERRORS } from "@/content/portal-strings";
import { assertCan } from "@/lib/auth/permissions";
import { Announcement, type IAnnouncement } from "@/lib/models/announcement";
import { portalDb } from "./db";
import { fail, fieldErrorsFrom, guarded, ok, toObjectId, type Actor, type Result } from "./result";

export type AnnouncementView = {
  id: string;
  message: string;
  linkUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  updatedAt: string;
};

/** What the public banner needs. Plain data: the message is rendered as text. */
export type PublicAnnouncement = { id: string; message: string; linkUrl: string | null; version: string };

const SITE_PATH = /^\/(?!\/)[^\s\\]*$/;
const isBannerLink = (v: string) => {
  if (SITE_PATH.test(v)) return true;
  try {
    return ["http:", "https:"].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

const OptionalDate = z
  .string()
  .trim()
  .max(40)
  .default("")
  .transform((v, ctx) => {
    if (v === "") return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({ code: "custom", message: ANNOUNCEMENTS_TEXT.errors.date });
      return z.NEVER;
    }
    return d;
  });

const AnnouncementFields = z
  .object({
    message: z.string({ error: ANNOUNCEMENTS_TEXT.errors.message }).trim().min(1, ANNOUNCEMENTS_TEXT.errors.message).max(280, ANNOUNCEMENTS_TEXT.errors.message),
    linkUrl: z
      .string()
      .trim()
      .max(2048, ANNOUNCEMENTS_TEXT.errors.link)
      .default("")
      .refine((v) => v === "" || isBannerLink(v), ANNOUNCEMENTS_TEXT.errors.link),
    startsAt: OptionalDate,
    endsAt: OptionalDate,
    active: z.union([z.boolean(), z.enum(["true", "false", "on"])]).default(false).transform((v) => v === true || v === "true" || v === "on"),
  })
  .refine((v) => !v.startsAt || !v.endsAt || v.endsAt > v.startsAt, { message: ANNOUNCEMENTS_TEXT.errors.window, path: ["endsAt"] });

const toView = (a: IAnnouncement): AnnouncementView => ({
  id: String(a._id),
  message: a.message,
  linkUrl: a.linkUrl ?? null,
  startsAt: a.startsAt ? new Date(a.startsAt).toISOString() : null,
  endsAt: a.endsAt ? new Date(a.endsAt).toISOString() : null,
  active: Boolean(a.active),
  updatedAt: new Date(a.updatedAt).toISOString(),
});

export async function listAnnouncements(actor: Actor): Promise<Result<AnnouncementView[]>> {
  return guarded("portal.announcements.list", async () => {
    assertCan(actor.role, "announcement.manage");
    await portalDb();
    const rows = (await Announcement.find({}).sort({ updatedAt: -1 }).limit(200).lean()) as IAnnouncement[];
    return ok(rows.map(toView));
  });
}

/** Creates an announcement (no id) or replaces the fields of an existing one. */
export async function saveAnnouncement(actor: Actor, rawId: unknown, raw: unknown): Promise<Result<AnnouncementView>> {
  return guarded("portal.announcements.save", async () => {
    assertCan(actor.role, "announcement.manage");
    const parsed = AnnouncementFields.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = fieldErrorsFrom(parsed.error.issues);
      return fail(Object.values(fieldErrors)[0] ?? PORTAL_ERRORS.generic, fieldErrors);
    }
    const data = { ...parsed.data, linkUrl: parsed.data.linkUrl || null };
    await portalDb();
    if (rawId === null || rawId === undefined || rawId === "") {
      const created = await Announcement.create({ ...data, createdBy: toObjectId(actor.id) });
      return ok(toView(created.toObject() as IAnnouncement));
    }
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.generic);
    const updated = (await Announcement.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after" }).lean()) as IAnnouncement | null;
    return updated ? ok(toView(updated)) : fail(PORTAL_ERRORS.generic);
  });
}

export async function setAnnouncementActive(actor: Actor, rawId: unknown, active: boolean): Promise<Result<undefined>> {
  return guarded("portal.announcements.toggle", async () => {
    assertCan(actor.role, "announcement.manage");
    const id = toObjectId(rawId);
    if (!id || typeof active !== "boolean") return fail(PORTAL_ERRORS.generic);
    await portalDb();
    await Announcement.updateOne({ _id: id }, { $set: { active } });
    return ok(undefined);
  });
}

export async function deleteAnnouncement(actor: Actor, rawId: unknown): Promise<Result<undefined>> {
  return guarded("portal.announcements.delete", async () => {
    assertCan(actor.role, "announcement.manage");
    const id = toObjectId(rawId);
    if (!id) return fail(PORTAL_ERRORS.generic);
    await portalDb();
    await Announcement.deleteOne({ _id: id });
    return ok(undefined);
  });
}

/** Active announcements whose time window includes `now`, newest first. Public: no actor needed. */
export async function findActiveAnnouncements(now = new Date(), limit = 3): Promise<PublicAnnouncement[]> {
  await portalDb();
  const rows = (await Announcement.find({
    active: true,
    $and: [{ $or: [{ startsAt: null }, { startsAt: { $lte: now } }] }, { $or: [{ endsAt: null }, { endsAt: { $gt: now } }] }],
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean()) as IAnnouncement[];
  return rows.map((a) => ({ id: String(a._id), message: a.message, linkUrl: a.linkUrl ?? null, version: new Date(a.updatedAt).getTime().toString(36) }));
}

export async function countActiveAnnouncements(actor: Actor): Promise<Result<number>> {
  return guarded("portal.announcements.count", async () => {
    assertCan(actor.role, "announcement.manage");
    return ok((await findActiveAnnouncements(new Date(), 100)).length);
  });
}
