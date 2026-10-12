import { NextResponse } from "next/server";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { getActor } from "@/lib/auth/session";
import { rateLimited } from "@/lib/forms/guard";
import { Media } from "@/lib/models/media";
import { portalDb } from "@/lib/portal/db";
import { logError, toObjectId } from "@/lib/portal/result";
import { MAX_UPLOAD_BYTES, isUploadType, matchesSignature, storageConfigured, uploadImage } from "@/lib/storage/s3";

export const runtime = "nodejs";

type UploadResponse = { url: string } | { error: string };

/** Image upload from the page builder, for signed-in staff and admins. JPEG, PNG, WebP or GIF, up to 5 MB, stored in S3. */
export async function POST(req: Request): Promise<NextResponse<UploadResponse>> {
  try {
    // Same-site requests only (the session cookie is SameSite=Lax as well).
    const origin = req.headers.get("origin");
    if (origin && new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"))) return NextResponse.json({ error: PORTAL_ERRORS.forbidden }, { status: 403 });
    const actor = await getActor();
    if (!actor) return NextResponse.json({ error: PORTAL_ERRORS.signedOut }, { status: 401 });
    if (!can(actor.role, "media.upload")) return NextResponse.json({ error: PORTAL_ERRORS.forbidden }, { status: 403 });
    if (!storageConfigured()) return NextResponse.json({ error: PORTAL_ERRORS.upload.disabled }, { status: 503 });
    if (rateLimited(`upload:${actor.id}`, 30, 10 * 60 * 1000)) return NextResponse.json({ error: PORTAL_ERRORS.generic }, { status: 429 });

    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_UPLOAD_BYTES + 64 * 1024) return NextResponse.json({ error: PORTAL_ERRORS.upload.size }, { status: 413 });

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: PORTAL_ERRORS.upload.type }, { status: 400 });
    if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: PORTAL_ERRORS.upload.size }, { status: 413 });
    if (!isUploadType(file.type)) return NextResponse.json({ error: PORTAL_ERRORS.upload.type }, { status: 415 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!matchesSignature(file.type, bytes)) return NextResponse.json({ error: PORTAL_ERRORS.upload.type }, { status: 415 });

    const { url, key } = await uploadImage(file.type, bytes);
    // Recorded for the media library; a failure here still returns the uploaded image.
    await portalDb()
      .then(() => Media.create({ url, key, name: file.name.slice(0, 200), type: file.type, size: file.size, uploadedBy: toObjectId(actor.id) }))
      .catch((err: unknown) => logError("api.portal.media_record_failed", err));
    return NextResponse.json({ url });
  } catch (err) {
    logError("api.portal.upload_failed", err);
    return NextResponse.json({ error: PORTAL_ERRORS.upload.failed }, { status: 500 });
  }
}
