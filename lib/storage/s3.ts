import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

/**
 * S3-compatible image storage for builder uploads (AWS S3, Cloudflare R2, MinIO, ...). On when a bucket and credentials
 * are set: S3_BUCKET plus S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_REGION, or the standard AWS_ACCESS_KEY_ID /
 * AWS_SECRET_ACCESS_KEY / AWS_REGION. S3_PUBLIC_URL is the address files are served from; on AWS it defaults to the
 * bucket's own address (https://<bucket>.s3.<region>.amazonaws.com), which needs public read on the uploads.
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
  const env = process.env;
  const bucket = env.S3_BUCKET?.trim();
  const region = (env.S3_REGION || env.AWS_REGION)?.trim();
  const accessKeyId = (env.S3_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID)?.trim();
  const secretAccessKey = (env.S3_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY)?.trim();
  const endpoint = env.S3_ENDPOINT?.trim() || undefined;
  if (!bucket || !region || !accessKeyId || !secretAccessKey) return null;
  // Another S3-compatible service needs its own public address; AWS has a standard one.
  const publicUrl = env.S3_PUBLIC_URL?.trim() || (endpoint ? "" : `https://${bucket}.s3.${region}.amazonaws.com`);
  if (!publicUrl) return null;
  return { bucket, region, endpoint, accessKeyId, secretAccessKey, publicUrl: publicUrl.replace(/\/+$/, "") };
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

export async function uploadImage(type: UploadType, body: Uint8Array): Promise<{ url: string; key: string }> {
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
  return { url: `${cfg.publicUrl}/${key}`, key };
}
