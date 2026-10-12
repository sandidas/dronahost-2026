import { BUILDER_TEXT } from "@/content/portal-strings";
import { EMPTY_DOC } from "@/lib/editor/schema";
import { newBlockId, SITE_SECTIONS_FOR, type AnyBlock, type BlockType, type PostKind, type SiteSectionType } from "./model";

/**
 * What the builder offers: each block's name, group, icon, starting values and the fields the Block panel shows.
 * Client-safe. Site sections start empty, so they cannot be published until someone has written their content.
 */

const F = BUILDER_TEXT.fields;

/**
 * One input in the Block panel. `path` is a dotted path inside the block's props (or, for site sections, inside `section`).
 * An `optional` field left empty is removed from the data, because the section schemas reject empty optional strings.
 */
export type Field =
  | { kind: "text"; path: string; label: string; help?: string; min?: number; max: number; optional?: boolean }
  | { kind: "textarea"; path: string; label: string; help?: string; min?: number; max: number; words?: number; optional?: boolean }
  | { kind: "select"; path: string; label: string; options: readonly { value: string | number; label: string }[] }
  | { kind: "image"; path: string; label: string; help?: string }
  | { kind: "cta"; path: string; label: string; optional: boolean }
  | { kind: "strings"; path: string; label: string; max: number; itemMax: number }
  | { kind: "features"; path: string; label: string; help?: string; max: number }
  | { kind: "list"; path: string; label: string; min: number; max: number; itemTitle: string; item: readonly Field[]; empty: () => Record<string, unknown> };

export type CatalogGroup = "layout" | "content" | "site";

export type CatalogEntry = {
  type: BlockType | SiteSectionType;
  group: CatalogGroup;
  label: string;
  hint: string;
  /** lucide icon name, mapped to a component in the editor. */
  icon: string;
  create: () => AnyBlock;
  fields: readonly Field[];
};

const site = (section: { type: SiteSectionType } & Record<string, unknown>): AnyBlock => ({ id: newBlockId(), type: "site", section });

const cta = (path: string, label: string, optional: boolean): Field => ({ kind: "cta", path, label, optional });

export const CATALOG: readonly CatalogEntry[] = [
  {
    type: "section",
    group: "layout",
    icon: "rows-3",
    ...BUILDER_TEXT.blocks.section,
    create: () => ({ id: newBlockId(), type: "section", props: { width: "text" }, children: [] }),
    fields: [{ kind: "select", path: "width", label: F.width, options: [{ value: "text", label: F.widths.text }, { value: "wide", label: F.widths.wide }] }],
  },
  {
    type: "columns",
    group: "layout",
    icon: "columns-3",
    ...BUILDER_TEXT.blocks.columns,
    create: () => ({ id: newBlockId(), type: "columns", props: { layout: "1-1" }, columns: [{ id: newBlockId(), children: [] }, { id: newBlockId(), children: [] }] }),
    fields: [{ kind: "select", path: "layout", label: F.layout, options: Object.entries(F.layouts).map(([value, label]) => ({ value, label })) }],
  },
  {
    type: "heading",
    group: "content",
    icon: "heading",
    ...BUILDER_TEXT.blocks.heading,
    create: () => ({ id: newBlockId(), type: "heading", props: { text: "", level: 2 } }),
    fields: [
      { kind: "text", path: "text", label: F.headingText, max: 200 },
      { kind: "select", path: "level", label: F.level, options: Object.entries(F.levels).map(([value, label]) => ({ value: Number(value), label })) },
    ],
  },
  {
    type: "richtext",
    group: "content",
    icon: "pilcrow",
    ...BUILDER_TEXT.blocks.richtext,
    create: () => ({ id: newBlockId(), type: "richtext", props: { content: EMPTY_DOC } }),
    // Edited in place on the canvas, with its own toolbar.
    fields: [],
  },
  {
    type: "image",
    group: "content",
    icon: "image",
    ...BUILDER_TEXT.blocks.image,
    create: () => ({ id: newBlockId(), type: "image", props: { src: "", alt: "", caption: "" } }),
    fields: [
      { kind: "image", path: "src", label: F.imageSrc, help: F.imageSrcHelp },
      { kind: "text", path: "alt", label: F.alt, help: F.altHelp, max: 200 },
      { kind: "text", path: "caption", label: F.caption, max: 300 },
    ],
  },
  {
    type: "video",
    group: "content",
    icon: "video",
    ...BUILDER_TEXT.blocks.video,
    create: () => ({ id: newBlockId(), type: "video", props: { url: "", title: "" } }),
    fields: [
      { kind: "text", path: "url", label: F.videoUrl, help: F.videoUrlHelp, max: 2048 },
      { kind: "text", path: "title", label: F.videoTitle, help: F.videoTitleHelp, max: 120 },
    ],
  },
  {
    type: "ProductHero",
    group: "site",
    icon: "panel-top",
    ...BUILDER_TEXT.blocks.ProductHero,
    create: () => site({ type: "ProductHero", variant: "dashboard", content: { h1: "", lead: "", ctaPrimary: { label: "", href: "" } } }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 40, optional: true },
      { kind: "text", path: "content.h1", label: F.h1, min: 20, max: 70 },
      { kind: "text", path: "content.accent", label: F.accent, help: F.accentHelp, min: 4, max: 70, optional: true },
      { kind: "textarea", path: "content.lead", label: F.lead, max: 220 },
      cta("content.ctaPrimary", F.ctaPrimary, false),
      cta("content.ctaSecondary", F.ctaSecondary, true),
      { kind: "strings", path: "content.highlights", label: F.highlights, max: 4, itemMax: 80 },
    ],
  },
  {
    type: "BentoGrid",
    group: "site",
    icon: "layout-grid",
    ...BUILDER_TEXT.blocks.BentoGrid,
    create: () => site({ type: "BentoGrid", content: { h2: "", tiles: [] } }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 40, optional: true },
      { kind: "text", path: "content.h2", label: F.h2, min: 8, max: 70 },
      { kind: "textarea", path: "content.description", label: F.description, max: 220, optional: true },
      { kind: "features", path: "content.tiles", label: F.tiles, help: F.tilesHelp, max: 6 },
    ],
  },
  {
    type: "ProcessTimeline",
    group: "site",
    icon: "list-ordered",
    ...BUILDER_TEXT.blocks.ProcessTimeline,
    create: () => site({ type: "ProcessTimeline", content: { h2: "", steps: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }] } }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 40, optional: true },
      { kind: "text", path: "content.h2", label: F.h2, min: 8, max: 70 },
      { kind: "textarea", path: "content.description", label: F.description, max: 220, optional: true },
      {
        kind: "list",
        path: "content.steps",
        label: F.steps,
        min: 2,
        max: 6,
        itemTitle: F.stepTitle,
        item: [
          { kind: "text", path: "title", label: F.stepTitle, min: 3, max: 40 },
          { kind: "textarea", path: "text", label: F.stepText, max: 120 },
        ],
        empty: () => ({ title: "", text: "" }),
      },
    ],
  },
  {
    type: "FAQSection",
    group: "site",
    icon: "circle-help",
    ...BUILDER_TEXT.blocks.FAQSection,
    create: () => site({ type: "FAQSection", content: { h2: "", items: [{ q: "", a: "" }, { q: "", a: "" }, { q: "", a: "" }] } }),
    fields: [
      { kind: "text", path: "content.h2", label: F.h2, min: 8, max: 60 },
      {
        kind: "list",
        path: "content.items",
        label: F.items,
        min: 3,
        max: 10,
        itemTitle: F.question,
        item: [
          { kind: "text", path: "q", label: F.question, min: 10, max: 120 },
          { kind: "textarea", path: "a", label: F.answer, min: 10, max: 800, words: 80 },
        ],
        empty: () => ({ q: "", a: "" }),
      },
      cta("content.link", F.faqLink, true),
    ],
  },
  {
    type: "CTABand",
    group: "site",
    icon: "megaphone",
    ...BUILDER_TEXT.blocks.CTABand,
    create: () => site({ type: "CTABand", content: { h2: "", ctaPrimary: { label: "", href: "" } } }),
    fields: [
      { kind: "text", path: "content.h2", label: F.h2, min: 8, max: 60 },
      { kind: "textarea", path: "content.description", label: F.description, max: 220, optional: true },
      cta("content.ctaPrimary", F.ctaPrimary, false),
      cta("content.ctaSecondary", F.ctaSecondary, true),
      { kind: "text", path: "content.note", label: F.note, max: 120, optional: true },
    ],
  },
];

const BY_TYPE = new Map(CATALOG.map((e) => [e.type, e]));

/** The catalog entry for a block (site blocks by their section type). */
export function entryFor(block: AnyBlock): CatalogEntry | undefined {
  return BY_TYPE.get(block.type === "site" ? block.section.type : block.type);
}

export const entryByType = (type: string): CatalogEntry | undefined => BY_TYPE.get(type as CatalogEntry["type"]);

/** What a post or page may use: posts get every site section except the hero. */
export function catalogFor(kind: PostKind): CatalogEntry[] {
  return CATALOG.filter((e) => e.group !== "site" || (SITE_SECTIONS_FOR[kind] as readonly string[]).includes(e.type));
}

/** Reads a dotted path. */
export function getAt(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((v, key) => (v && typeof v === "object" ? (v as Record<string, unknown>)[key] : undefined), value);
}

/** Writes a dotted path immutably. `undefined` removes the key, so optional fields left empty are not stored. */
export function setAt<T>(value: T, path: string, next: unknown): T {
  const [key, ...rest] = path.split(".");
  if (!key) return value;
  const base = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const copy: Record<string, unknown> = Array.isArray(base) ? ([...base] as unknown as Record<string, unknown>) : { ...base };
  const child = rest.length ? setAt(base[key], rest.join("."), next) : next;
  if (child === undefined) delete copy[key];
  else copy[key] = child;
  return copy as T;
}
