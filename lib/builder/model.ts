/**
 * The page builder's document: what a post or page stores in `content`. Shared by the editor (client) and the server
 * (validation and rendering), so this file imports nothing server-only.
 *
 * A page is a list of blocks. Every block is one of the components in the block registry (lib/builder/blocks), stored
 * as its type and its props; the registry says what the props may hold, how they are edited and how they render. Page
 * settings (content width, spacing) sit beside the blocks.
 */

export type PostKind = "post" | "page";
export const POST_KINDS: readonly PostKind[] = ["post", "page"];

/** One component on the page. `props` is checked against the block's fields (lib/builder/fields.ts). */
export type Block = { id: string; type: string; props: Record<string, unknown> };

/** Content width, by its Tailwind size. "default" is the site's own width (--container-max). */
export const PAGE_WIDTHS = ["default", "3xl", "4xl", "5xl", "6xl", "7xl", "full"] as const;
export type PageWidth = (typeof PAGE_WIDTHS)[number];

/** The space above and below each section. */
export const PAGE_SPACINGS = ["compact", "normal", "roomy"] as const;
export type PageSpacing = (typeof PAGE_SPACINGS)[number];

export type PageSettings = { width: PageWidth; spacing: PageSpacing };
export const DEFAULT_SETTINGS: PageSettings = { width: "default", spacing: "normal" };

export type BuilderDoc = { version: 2; settings: PageSettings; blocks: Block[] };

export const EMPTY_BUILDER_DOC: BuilderDoc = { version: 2, settings: DEFAULT_SETTINGS, blocks: [] };

/** Stored content written by the builder, in any version (lib/builder/legacy.ts reads older ones). */
export function isBuilderDoc(value: unknown): value is { version: number; blocks: unknown[] } {
  if (typeof value !== "object" || value === null) return false;
  const v = value as { version?: unknown; blocks?: unknown };
  return (v.version === 1 || v.version === 2) && Array.isArray(v.blocks);
}

/** Block ids double as section anchors, so they are lowercase letters and digits (valid page-spec slugs). */
export const BLOCK_ID = /^[a-z0-9]{6,32}$/;

export function newBlockId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return `b${Array.from(bytes, (b) => (b % 36).toString(36)).join("")}`;
}

/** The YouTube video id from a watch, short, embed or youtu.be address, or null. */
export function youtubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = parsed.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = parsed.searchParams.get("v") ?? parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ?? null;
  }
  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
}

/** Privacy-enhanced embed address (no cookies until the visitor plays the video). */
export const youtubeEmbedSrc = (id: string): string => `https://www.youtube-nocookie.com/embed/${id}`;
