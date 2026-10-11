import { PORTAL_ERRORS } from "@/content/portal-strings";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Sends one image to /api/portal/upload. The server repeats every check; these only save a round trip. */
export async function uploadImage(file: File): Promise<{ url: string } | { error: string }> {
  if (!TYPES.includes(file.type)) return { error: PORTAL_ERRORS.upload.type };
  if (file.size > MAX_BYTES) return { error: PORTAL_ERRORS.upload.size };
  const body = new FormData();
  body.append("file", file);
  try {
    const res = await fetch("/api/portal/upload", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { url?: unknown; error?: unknown };
    if (res.ok && typeof data.url === "string") return { url: data.url };
    return { error: typeof data.error === "string" ? data.error : PORTAL_ERRORS.upload.failed };
  } catch {
    return { error: PORTAL_ERRORS.upload.failed };
  }
}
