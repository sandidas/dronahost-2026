import { NextResponse } from "next/server";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { getActor } from "@/lib/auth/session";
import { rateLimited } from "@/lib/forms/guard";
import { logError } from "@/lib/portal/result";
import { MAX_UPLOAD_BYTES, isUploadType, matchesSignature, storageConfigured, uploadImage } from "@/lib/storage/s3";

export const runtime = "nodejs";

type UploadResponse = { url: string } | { error: string };

/** Blog image upload for signed-in staff and admins. JPEG, PNG, WebP or GIF, up to 5 MB. */
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

    const url = await uploadImage(file.type, bytes);
    return NextResponse.json({ url });
  } catch (err) {
    logError("api.portal.upload_failed", err);
    return NextResponse.json({ error: PORTAL_ERRORS.upload.failed }, { status: 500 });
  }
}
