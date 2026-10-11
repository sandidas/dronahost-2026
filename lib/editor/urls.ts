/**
 * URL rules for staff-written content, shared by the editor, the save validator and the HTML sanitiser.
 * Links: http, https, mailto or a site path ("/pricing"). Images: http, https or a site path. Embeds: YouTube only.
 */
const SITE_PATH = /^\/(?!\/)[^\s\\]*$/;

function parse(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isSafeLinkHref(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return false;
  if (SITE_PATH.test(value)) return true;
  const url = parse(value);
  return url !== null && ["http:", "https:", "mailto:"].includes(url.protocol);
}

export function isSafeImageSrc(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return false;
  if (SITE_PATH.test(value)) return true;
  const url = parse(value);
  return url !== null && (url.protocol === "https:" || url.protocol === "http:");
}

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]);

export function isYoutubeUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  const url = parse(value);
  return url !== null && url.protocol === "https:" && YOUTUBE_HOSTS.has(url.hostname);
}

/** Embed hosts the sanitiser lets an iframe point at. */
export const EMBED_HOSTS = ["www.youtube-nocookie.com", "www.youtube.com"] as const;

export function isAllowedEmbedSrc(value: string): boolean {
  const url = parse(value);
  return url !== null && url.protocol === "https:" && (EMBED_HOSTS as readonly string[]).includes(url.hostname) && url.pathname.startsWith("/embed/");
}
