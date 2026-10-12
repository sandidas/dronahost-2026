import type { TiptapDoc } from "@/lib/editor/schema";

import { SECTION_TYPES, type SectionType } from "./sections";

/**
 * The page builder's document: what a post or page stores in `content`. Shared by the editor (client) and the
 * server (validation and rendering), so this file imports nothing server-only.
 *
 * Shape: root blocks are Sections or sections from lib/builder/sections.ts (hero, banners, FAQ, ...). A Section holds
 * content blocks and Columns; each column holds content blocks. Every word comes from the builder.
 */

export type PostKind = "post" | "page";
export const POST_KINDS: readonly PostKind[] = ["post", "page"];

export const SITE_SECTION_TYPES = SECTION_TYPES;
export type SiteSectionType = SectionType;

/** Blog posts already have an H1 (the post title), so the hero is for pages only. */
export const SITE_SECTIONS_FOR: Record<PostKind, readonly SiteSectionType[]> = {
  post: SECTION_TYPES.filter((t) => t !== "Hero"),
  page: SECTION_TYPES,
};

export type HeadingLevel = 2 | 3 | 4;
export type HeadingBlock = { id: string; type: "heading"; props: { text: string; level: HeadingLevel } };
/** Tiptap JSON. Posts written before the builder hold an HTML string, which renders sanitised until it is edited. */
export type RichTextBlock = { id: string; type: "richtext"; props: { content: TiptapDoc | string } };
export type ImageBlock = { id: string; type: "image"; props: { src: string; alt: string; caption: string } };
export type VideoBlock = { id: string; type: "video"; props: { url: string; title: string } };
export type LeafBlock = HeadingBlock | RichTextBlock | ImageBlock | VideoBlock;
export type LeafType = LeafBlock["type"];
export const LEAF_TYPES: readonly LeafType[] = ["heading", "richtext", "image", "video"];

export type ColumnsLayout = "1-1" | "2-1" | "1-2" | "1-1-1";
export const COLUMNS_LAYOUTS: readonly ColumnsLayout[] = ["1-1", "2-1", "1-2", "1-1-1"];
export type Column = { id: string; children: LeafBlock[] };
export type ColumnsBlock = { id: string; type: "columns"; props: { layout: ColumnsLayout }; columns: Column[] };

export type SectionWidth = "text" | "wide";
export type SectionBlock = { id: string; type: "section"; props: { width: SectionWidth }; children: (LeafBlock | ColumnsBlock)[] };

/** A section and what was written in it. `content` is checked by SECTION_SCHEMAS (lib/builder/sections.ts). */
export type SiteSection = { type: SiteSectionType; content: Record<string, unknown> };
export type SiteBlock = { id: string; type: "site"; section: SiteSection };

export type RootBlock = SectionBlock | SiteBlock;
export type AnyBlock = RootBlock | ColumnsBlock | LeafBlock;
export type BlockType = AnyBlock["type"];

export type BuilderDoc = { version: 1; blocks: RootBlock[] };

export const EMPTY_BUILDER_DOC: BuilderDoc = { version: 1, blocks: [] };

export function isBuilderDoc(value: unknown): value is BuilderDoc {
  return typeof value === "object" && value !== null && (value as { version?: unknown }).version === 1 && Array.isArray((value as { blocks?: unknown }).blocks);
}

export const columnCount = (layout: ColumnsLayout): number => (layout === "1-1-1" ? 3 : 2);

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
