import type { TiptapDoc } from "@/lib/editor/schema";

/**
 * The page builder's document: what a post or page stores in `content`. Shared by the editor (client) and the
 * server (validation and rendering), so this file imports nothing server-only.
 *
 * Shape: root blocks are Sections or site sections. A Section holds content blocks and Columns; each column holds
 * content blocks. Site sections (ProductHero, FAQSection, ...) are the site's own registered sections, stored in
 * the same JSON shape as content/pages/*.json and rendered by lib/content/registry.tsx.
 */

export type PostKind = "post" | "page";
export const POST_KINDS: readonly PostKind[] = ["post", "page"];

/** Sections from the page-spec registry (lib/content/registry.tsx): the same JSON shape as content/pages/*.json. */
export const REGISTRY_SECTION_TYPES = ["ProductHero", "BentoGrid", "ProcessTimeline", "FAQSection", "CTABand"] as const;
/** Sections whose content is written entirely in the builder (lib/builder/free-sections.ts). */
export const FREE_SECTION_TYPES = ["OfferBanner", "GuideBanner", "ActionBand", "AnswerBanner", "SplitSection", "FeatureCards", "LinkTiles"] as const;
export const SITE_SECTION_TYPES = [...REGISTRY_SECTION_TYPES, ...FREE_SECTION_TYPES] as const;
export type SiteSectionType = (typeof SITE_SECTION_TYPES)[number];
export type RegistrySectionType = (typeof REGISTRY_SECTION_TYPES)[number];

export const isRegistrySection = (type: SiteSectionType): type is RegistrySectionType => (REGISTRY_SECTION_TYPES as readonly string[]).includes(type);

/** Blog posts already have an H1 (the post title), so the hero is for pages only. */
export const SITE_SECTIONS_FOR: Record<PostKind, readonly SiteSectionType[]> = {
  post: SITE_SECTION_TYPES.filter((t) => t !== "ProductHero"),
  page: SITE_SECTION_TYPES,
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

/** A registered site section in page-spec JSON shape. `id` is filled from the block id when it renders. */
export type SiteSection = { type: SiteSectionType } & Record<string, unknown>;
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

/**
 * Opens any stored content in the builder. Posts from before the builder (Tiptap JSON or HTML) become one Section with
 * one Rich text block; they are stored in the builder shape on their next save.
 */
export function toBuilderDoc(content: unknown): BuilderDoc {
  if (isBuilderDoc(content)) return content;
  const isTiptap = typeof content === "object" && content !== null && (content as { type?: unknown }).type === "doc";
  const isHtml = typeof content === "string" && content.trim().length > 0;
  if (!isTiptap && !isHtml) return EMPTY_BUILDER_DOC;
  const richtext: RichTextBlock = { id: newBlockId(), type: "richtext", props: { content: content as TiptapDoc | string } };
  return { version: 1, blocks: [{ id: newBlockId(), type: "section", props: { width: "text" }, children: [richtext] }] };
}
