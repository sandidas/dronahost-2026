import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

/**
 * S3-compatible image storage for blog uploads (AWS S3, Cloudflare R2, MinIO, ...). Off unless S3_BUCKET,
 * S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY and S3_PUBLIC_URL are set; the editor then hides upload.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const TYPES = {
  "image/jpeg": { ext: "jpg", magic: [[0xff, 0xd8, 0xff]] },
  "image/png": { ext: "png", magic: [[0x89, 0x50, 0x4e, 0x47]] },
  "image/gif": { ext: "gif", magic: [[0x47, 0x49, 0x46, 0x38]] },
  // RIFF....WEBP: checked as RIFF here and WEBP at offset 8 below.
  "image/webp": { ext: "webp", magic: [[0x52, 0x49, 0x46, 0x46]] },
} as const;

export type UploadType = keyof typeof TYPES;

export const isUploadType = (t: string): t is UploadType => t in TYPES;

type StorageConfig = { bucket: string; region: string; endpoint?: string; accessKeyId: string; secretAccessKey: string; publicUrl: string };

function config(): StorageConfig | null {
  const { S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL } = process.env;
  if (!S3_BUCKET || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_PUBLIC_URL) return null;
  return { bucket: S3_BUCKET, region: S3_REGION, endpoint: S3_ENDPOINT || undefined, accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY, publicUrl: S3_PUBLIC_URL.replace(/\/+$/, "") };
}

export const storageConfigured = (): boolean => config() !== null;

/** The file's first bytes must match its declared type, so a renamed HTML or SVG file is refused. */
export function matchesSignature(type: UploadType, bytes: Uint8Array): boolean {
  const ok = TYPES[type].magic.some((sig) => sig.every((b, i) => bytes[i] === b));
  if (!ok) return false;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return true;
}

let client: S3Client | null = null;

export async function uploadImage(type: UploadType, body: Uint8Array): Promise<string> {
  const cfg = config();
  if (!cfg) throw new Error("Storage not configured");
  client ??= new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    forcePathStyle: Boolean(cfg.endpoint),
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  });
  const now = new Date();
  const key = `blog/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${TYPES[type].ext}`;
  await client.send(
    new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: body, ContentType: type, CacheControl: "public, max-age=31536000, immutable" }),
  );
  return `${cfg.publicUrl}/${key}`;
}
