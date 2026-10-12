import { BUILDER_TEXT } from "@/content/portal-strings";
import { EMPTY_DOC } from "@/lib/editor/schema";
import { ICON_NAMES } from "@/lib/content/schemas/common";
import { newBlockId, SITE_SECTIONS_FOR, type AnyBlock, type BlockType, type PostKind, type SiteSectionType } from "./model";

/**
 * What the builder offers: each block's name, group, icon, starting values and the fields the Block panel shows.
 * Client-safe. Sections start empty; the canvas shows them as soon as their main field is written.
 */

const F = BUILDER_TEXT.fields;

/**
 * One input in the Block panel. `path` is a dotted path inside the block's props (or, for site sections, inside `section`).
 * An `optional` field left empty is removed from the data rather than stored as an empty string.
 */
export type Field =
  | { kind: "text"; path: string; label: string; help?: string; min?: number; max: number; optional?: boolean }
  | { kind: "textarea"; path: string; label: string; help?: string; min?: number; max: number; words?: number; optional?: boolean }
  | { kind: "select"; path: string; label: string; options: readonly { value: string | number; label: string }[]; optional?: boolean }
  | { kind: "toggle"; path: string; label: string }
  | { kind: "image"; path: string; label: string; help?: string }
  | { kind: "cta"; path: string; label: string; optional: boolean }
  | { kind: "strings"; path: string; label: string; max: number; itemMax: number }
  | { kind: "list"; path: string; label: string; min: number; max: number; itemTitle: string; item: readonly Field[]; empty: () => Record<string, unknown> };

export type CatalogGroup = "layout" | "content" | "sections" | "banners";

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

const site = (type: SiteSectionType, content: Record<string, unknown>): AnyBlock => ({ id: newBlockId(), type: "site", section: { type, content } });

const cta = (path: string, label: string, optional: boolean): Field => ({ kind: "cta", path, label, optional });

/** Select options from a label map; `cast` turns the keys back into numbers where the data stores numbers. */
const options = (labels: Record<string, string>, cast: (k: string) => string | number = String) => Object.entries(labels).map(([k, label]) => ({ value: cast(k), label }));

const ICON_OPTIONS = [{ value: "", label: F.noIcon }, ...ICON_NAMES.map((name) => ({ value: name, label: name.replace(/-/g, " ") }))];
const card = () => ({ title: "", description: "" });
const step = () => ({ title: "", text: "" });
const qa = () => ({ question: "", answer: "" });
const tile = () => ({ title: "", line: "", href: "" });

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
    type: "Hero",
    group: "sections",
    icon: "panel-top",
    ...BUILDER_TEXT.blocks.Hero,
    create: () => site("Hero", { title: "", description: "" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.h1, max: 120 },
      { kind: "text", path: "content.accent", label: F.accent, help: F.accentHelp, max: 120, optional: true },
      { kind: "textarea", path: "content.description", label: F.lead, max: 400 },
      cta("content.primaryCta", F.ctaPrimary, true),
      cta("content.secondaryCta", F.ctaSecondary, true),
      { kind: "strings", path: "content.highlights", label: F.highlights, max: 4, itemMax: 120 },
      { kind: "image", path: "content.image.src", label: F.heroImage, help: F.imageSrcHelp },
      { kind: "text", path: "content.image.alt", label: F.imageAlt, max: 200 },
    ],
  },
  {
    type: "SplitSection",
    group: "sections",
    icon: "split",
    ...BUILDER_TEXT.blocks.SplitSection,
    create: () => site("SplitSection", { title: "", imagePosition: "right" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.description", label: F.description, max: 600, optional: true },
      { kind: "strings", path: "content.features", label: F.points, max: 8, itemMax: 160 },
      cta("content.ctaPrimary", F.ctaPrimary, true),
      cta("content.ctaSecondary", F.ctaSecondary, true),
      { kind: "image", path: "content.image.src", label: F.imageSrc, help: F.imageSrcHelp },
      { kind: "text", path: "content.image.alt", label: F.imageAlt, max: 200 },
      { kind: "select", path: "content.imagePosition", label: F.imagePosition, options: options(F.imagePositions) },
    ],
  },
  {
    type: "FeatureCards",
    group: "sections",
    icon: "layout-grid",
    ...BUILDER_TEXT.blocks.FeatureCards,
    create: () => site("FeatureCards", { title: "", items: [card(), card(), card()], columns: 3, variant: "cards" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120, optional: true },
      { kind: "textarea", path: "content.description", label: F.description, max: 400, optional: true },
      {
        kind: "list",
        path: "content.items",
        label: F.cards,
        min: 1,
        max: 12,
        itemTitle: F.card,
        item: [
          { kind: "select", path: "icon", label: F.icon, options: ICON_OPTIONS, optional: true },
          { kind: "text", path: "title", label: F.cardTitle, max: 80 },
          { kind: "textarea", path: "description", label: F.cardText, max: 400 },
          cta("link", F.cardLink, true),
        ],
        empty: card,
      },
      { kind: "select", path: "content.columns", label: F.columns, options: options(F.columnsOptions, Number) },
      { kind: "select", path: "content.variant", label: F.cardStyle, options: options(F.cardStyles) },
    ],
  },
  {
    type: "Steps",
    group: "sections",
    icon: "list-ordered",
    ...BUILDER_TEXT.blocks.Steps,
    create: () => site("Steps", { title: "", steps: [step(), step(), step()] }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.description", label: F.description, max: 400, optional: true },
      {
        kind: "list",
        path: "content.steps",
        label: F.steps,
        min: 1,
        max: 8,
        itemTitle: F.stepTitle,
        item: [
          { kind: "text", path: "title", label: F.stepTitle, max: 80 },
          { kind: "textarea", path: "text", label: F.stepText2, max: 300 },
        ],
        empty: step,
      },
    ],
  },
  {
    type: "Faq",
    group: "sections",
    icon: "circle-help",
    ...BUILDER_TEXT.blocks.Faq,
    create: () => site("Faq", { title: "", items: [qa(), qa(), qa()] }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.description", label: F.description, max: 400, optional: true },
      {
        kind: "list",
        path: "content.items",
        label: F.items,
        min: 1,
        max: 20,
        itemTitle: F.question,
        item: [
          { kind: "text", path: "question", label: F.question, max: 200 },
          { kind: "textarea", path: "answer", label: F.faqAnswer, max: 1500 },
        ],
        empty: qa,
      },
    ],
  },
  {
    type: "LinkTiles",
    group: "sections",
    icon: "signpost",
    ...BUILDER_TEXT.blocks.LinkTiles,
    create: () => site("LinkTiles", { title: "", items: [tile(), tile(), tile()], layout: "tiles", columns: 3 }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.intro", label: F.intro, max: 400, optional: true },
      {
        kind: "list",
        path: "content.items",
        label: F.linkTiles,
        min: 1,
        max: 8,
        itemTitle: F.tile,
        item: [
          { kind: "select", path: "icon", label: F.icon, options: ICON_OPTIONS, optional: true },
          { kind: "text", path: "title", label: F.tileTitle, max: 60 },
          { kind: "text", path: "line", label: F.tileLine, max: 160 },
          { kind: "text", path: "href", label: F.tileHref, help: F.ctaHrefHelp, max: 2048 },
        ],
        empty: tile,
      },
      { kind: "select", path: "content.layout", label: F.bannerLayout, options: options(F.tileLayouts) },
      { kind: "select", path: "content.columns", label: F.columns, options: options(F.columnsOptions, Number) },
    ],
  },
  {
    type: "CtaBand",
    group: "sections",
    icon: "megaphone",
    ...BUILDER_TEXT.blocks.CtaBand,
    create: () => site("CtaBand", { title: "", primaryCta: { label: "", href: "" } }),
    fields: [
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.description", label: F.description, max: 400, optional: true },
      cta("content.primaryCta", F.ctaPrimary, false),
      cta("content.secondaryCta", F.ctaSecondary, true),
      { kind: "text", path: "content.note", label: F.note, max: 200, optional: true },
    ],
  },
  {
    type: "OfferBanner",
    group: "banners",
    icon: "badge-percent",
    ...BUILDER_TEXT.blocks.OfferBanner,
    create: () => site("OfferBanner", { title: "", description: "", primaryCta: { label: "", href: "" }, ticketLabel: "", layout: "split", scope: "ink" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.description", label: F.pitch, max: 400 },
      cta("content.primaryCta", F.ctaPrimary, false),
      { kind: "text", path: "content.ticketLabel", label: F.ticketLabel, help: F.ticketLabelHelp, max: 60 },
      { kind: "text", path: "content.nextStep", label: F.nextStep, max: 200, optional: true },
      { kind: "select", path: "content.layout", label: F.bannerLayout, options: options(F.offerLayouts) },
      { kind: "select", path: "content.scope", label: F.background, options: options(F.backgrounds) },
    ],
  },
  {
    type: "GuideBanner",
    group: "banners",
    icon: "map",
    ...BUILDER_TEXT.blocks.GuideBanner,
    create: () => site("GuideBanner", { title: "", summary: "", learn: ["", "", ""], layout: "line", numbered: true, scope: "ink" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.title", label: F.title, max: 120 },
      { kind: "textarea", path: "content.summary", label: F.summary, max: 500 },
      { kind: "strings", path: "content.learn", label: F.learn, max: 6, itemMax: 160 },
      cta("content.cta", F.nextLink, true),
      { kind: "select", path: "content.layout", label: F.bannerLayout, options: options(F.guideLayouts) },
      { kind: "toggle", path: "content.numbered", label: F.numbered },
      { kind: "select", path: "content.scope", label: F.background, options: options(F.backgrounds) },
    ],
  },
  {
    type: "ActionBand",
    group: "banners",
    icon: "mouse-pointer-click",
    ...BUILDER_TEXT.blocks.ActionBand,
    create: () => site("ActionBand", { label: "", line: "", cta: { label: "", href: "" }, variant: "split" }),
    fields: [
      { kind: "text", path: "content.label", label: F.bandLabel, max: 80 },
      { kind: "text", path: "content.line", label: F.bandLine, max: 200 },
      cta("content.cta", F.ctaPrimary, false),
      { kind: "text", path: "content.note", label: F.note, max: 200, optional: true },
      { kind: "select", path: "content.variant", label: F.bannerLayout, options: options(F.bandVariants) },
    ],
  },
  {
    type: "AnswerBanner",
    group: "banners",
    icon: "message-circle-question",
    ...BUILDER_TEXT.blocks.AnswerBanner,
    create: () => site("AnswerBanner", { question: "", answer: "", layout: "entry" }),
    fields: [
      { kind: "text", path: "content.eyebrow", label: F.eyebrow, max: 60, optional: true },
      { kind: "text", path: "content.question", label: F.question, max: 200 },
      { kind: "textarea", path: "content.answer", label: F.faqAnswer, max: 1200 },
      cta("content.next", F.nextLink, true),
      { kind: "select", path: "content.layout", label: F.bannerLayout, options: options(F.answerLayouts) },
    ],
  },
];

const BY_TYPE = new Map(CATALOG.map((e) => [e.type, e]));

/** The catalog entry for a block (site blocks by their section type). */
export function entryFor(block: AnyBlock): CatalogEntry | undefined {
  return BY_TYPE.get(block.type === "site" ? block.section.type : block.type);
}

export const entryByType = (type: string): CatalogEntry | undefined => BY_TYPE.get(type as CatalogEntry["type"]);

/** What a post or page may use: posts get every section except the hero. */
export function catalogFor(kind: PostKind): CatalogEntry[] {
  return CATALOG.filter((e) => e.group === "layout" || e.group === "content" || (SITE_SECTIONS_FOR[kind] as readonly string[]).includes(e.type));
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
