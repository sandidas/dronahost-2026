import { NextResponse } from "next/server";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { getActor } from "@/lib/auth/session";
import { Media, type IMedia } from "@/lib/models/media";
import { portalDb } from "@/lib/portal/db";
import { logError } from "@/lib/portal/result";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE = 40;

/**
 * The media library: uploaded images, newest first, 40 at a time. `?before=<ISO date>` continues after the last one
 * shown. Staff and admins (the same people who may upload).
 */
export async function GET(req: Request) {
  try {
    const actor = await getActor();
    if (!actor) return NextResponse.json({ error: PORTAL_ERRORS.signedOut }, { status: 401 });
    if (!can(actor.role, "media.upload")) return NextResponse.json({ error: PORTAL_ERRORS.forbidden }, { status: 403 });
    const raw = new URL(req.url).searchParams.get("before");
    const before = raw ? new Date(raw) : null;
    const filter = before && !Number.isNaN(before.getTime()) ? { createdAt: { $lt: before } } : {};
    await portalDb();
    const rows = (await Media.find(filter).sort({ createdAt: -1 }).limit(PAGE + 1).lean()) as IMedia[];
    const page = rows.slice(0, PAGE);
    return NextResponse.json(
      {
        items: page.map((m) => ({ id: String(m._id), url: m.url, name: m.name, createdAt: new Date(m.createdAt).toISOString() })),
        next: rows.length > PAGE ? new Date(page[page.length - 1]!.createdAt).toISOString() : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    logError("api.portal.media_list_failed", err);
    return NextResponse.json({ error: PORTAL_ERRORS.generic }, { status: 500 });
  }
}
