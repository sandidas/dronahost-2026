import { z, type ZodType } from "zod";
import { BUILDER_PROBLEMS } from "@/content/portal-strings";
import * as S from "@/lib/content/schemas/sections";
import { docText, parseTiptapDoc } from "@/lib/editor/schema";
import { isSafeImageSrc, isYoutubeUrl } from "@/lib/editor/urls";
import { entryFor, type Field } from "./catalog";
import { BLOCK_ID, COLUMNS_LAYOUTS, SITE_SECTIONS_FOR, SITE_SECTION_TYPES, columnCount, youtubeId, type AnyBlock, type BuilderDoc, type PostKind, type SiteSectionType } from "./model";
import { flatten } from "./tree";

/**
 * Two levels of checking. Every save (drafts included, so autosave never loses work) runs `parseBuilderDoc`: the tree
 * shape, ids, sizes and safe URLs. Publishing also runs `publishProblems`: every site section against its page-spec
 * schema (the same rules as content/pages/*.json), plus the content a visitor needs (alt text, a video title, ...).
 */

const MAX_BYTES = 1024 * 1024;
const MAX_ROOT_BLOCKS = 60;
const MAX_SECTION_CHILDREN = 80;
const MAX_COLUMN_CHILDREN = 40;
const MAX_SITE_DEPTH = 8;

const Id = z.string().regex(BLOCK_ID);
const emptyOr = (test: (v: string) => boolean) => (v: string) => v === "" || test(v);

const Heading = z.strictObject({
  id: Id,
  type: z.literal("heading"),
  props: z.strictObject({ text: z.string().max(200), level: z.union([z.literal(2), z.literal(3), z.literal(4)]) }),
});
const RichText = z.strictObject({
  id: Id,
  type: z.literal("richtext"),
  props: z.strictObject({
    content: z.union([
      z.string().max(512 * 1024),
      z.record(z.string(), z.unknown()).superRefine((doc, ctx) => {
        const res = parseTiptapDoc(doc);
        if (!res.ok) ctx.addIssue({ code: "custom", message: res.error });
      }),
    ]),
  }),
});
const Image = z.strictObject({
  id: Id,
  type: z.literal("image"),
  props: z.strictObject({
    src: z.string().max(2048).refine(emptyOr(isSafeImageSrc), BUILDER_PROBLEMS.imageSrc),
    alt: z.string().max(200),
    caption: z.string().max(300),
  }),
});
const Video = z.strictObject({
  id: Id,
  type: z.literal("video"),
  props: z.strictObject({ url: z.string().max(2048).refine(emptyOr(isYoutubeUrl), BUILDER_PROBLEMS.videoUrl), title: z.string().max(120) }),
});
const Leaf = z.discriminatedUnion("type", [Heading, RichText, Image, Video]);
const Columns = z
  .strictObject({
    id: Id,
    type: z.literal("columns"),
    props: z.strictObject({ layout: z.enum(COLUMNS_LAYOUTS as [string, ...string[]]) }),
    columns: z.array(z.strictObject({ id: Id, children: z.array(Leaf).max(MAX_COLUMN_CHILDREN) })).min(2).max(3),
  })
  .refine((b) => b.columns.length === columnCount(b.props.layout as never), BUILDER_PROBLEMS.structure);
const Section = z.strictObject({
  id: Id,
  type: z.literal("section"),
  props: z.strictObject({ width: z.enum(["text", "wide"]) }),
  children: z.array(z.discriminatedUnion("type", [Heading, RichText, Image, Video, Columns])).max(MAX_SECTION_CHILDREN),
});

function depth(value: unknown): number {
  if (!value || typeof value !== "object") return 0;
  return 1 + Math.max(0, ...Object.values(value).map(depth));
}

/** A draft site section only needs the right type and a bounded shape; its content is checked when publishing. */
const Site = z.strictObject({
  id: Id,
  type: z.literal("site"),
  section: z.looseObject({ type: z.enum(SITE_SECTION_TYPES) }).refine((s) => depth(s) <= MAX_SITE_DEPTH, BUILDER_PROBLEMS.structure),
});

const Doc = z.strictObject({
  version: z.literal(1),
  blocks: z.array(z.discriminatedUnion("type", [Section, Site])).max(MAX_ROOT_BLOCKS),
});

export type ParseResult = { ok: true; doc: BuilderDoc } | { ok: false; error: string };

/** Accepts the document as an object or a JSON string (forms send it as a string, see components/builder). */
export function parseBuilderDoc(input: unknown, kind: PostKind): ParseResult {
  let raw = input;
  if (typeof raw === "string") {
    if (raw.length > MAX_BYTES) return { ok: false, error: BUILDER_PROBLEMS.tooLarge };
    try {
      raw = JSON.parse(raw);
    } catch {
      return { ok: false, error: BUILDER_PROBLEMS.unreadable };
    }
  }
  const parsed = Doc.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.find((i) => i.code === "custom")?.message ?? BUILDER_PROBLEMS.structure };
  if (JSON.stringify(parsed.data).length > MAX_BYTES) return { ok: false, error: BUILDER_PROBLEMS.tooLarge };
  const doc = parsed.data as BuilderDoc;
  const ids = flatten(doc).map(({ block }) => block.id);
  if (new Set(ids).size !== ids.length) return { ok: false, error: BUILDER_PROBLEMS.structure };
  const allowed = SITE_SECTIONS_FOR[kind] as readonly string[];
  const notAllowed = doc.blocks.find((b) => b.type === "site" && !allowed.includes(b.section.type));
  if (notAllowed) return { ok: false, error: BUILDER_PROBLEMS.notForKind };
  return { ok: true, doc };
}

export const SITE_SCHEMAS: Record<SiteSectionType, ZodType> = {
  ProductHero: S.ProductHero,
  BentoGrid: S.BentoGrid,
  ProcessTimeline: S.ProcessTimeline,
  FAQSection: S.FAQSection,
  CTABand: S.CTABand,
};

export type Problem = { blockId: string; message: string };

/** The Block panel label for a data path, e.g. "Question 2: Answer". */
function labelFor(path: readonly string[], fields: readonly Field[]): string {
  const key = path.join(".");
  const field = fields.find((f) => key === f.path || key.startsWith(`${f.path}.`));
  if (!field) return "";
  if (field.kind !== "list") return field.label;
  const [index, ...rest] = key.slice(field.path.length + 1).split(".");
  if (index === undefined || !/^\d+$/.test(index)) return field.label;
  const item = `${field.itemTitle} ${Number(index) + 1}`;
  const inner = labelFor(rest, field.item);
  return inner ? `${item}: ${inner}` : item;
}

/** Turns a schema issue into a sentence that names the field, using the labels from the Block panel. */
function describe(issue: z.core.$ZodIssue, fields: readonly Field[]): string {
  const label = labelFor(issue.path.map(String), fields);
  const what = label || BUILDER_PROBLEMS.aField;
  const i = issue as z.core.$ZodIssue & { minimum?: number | bigint; maximum?: number | bigint; origin?: string };
  if (i.code === "too_small" && i.origin === "string") return Number(i.minimum) <= 1 ? `${what}: ${BUILDER_PROBLEMS.required}` : `${what}: ${BUILDER_PROBLEMS.minChars(Number(i.minimum))}`;
  if (i.code === "too_big" && i.origin === "string") return `${what}: ${BUILDER_PROBLEMS.maxChars(Number(i.maximum))}`;
  if (i.code === "too_small" && i.origin === "array") return `${what}: ${BUILDER_PROBLEMS.minItems(Number(i.minimum))}`;
  if (i.code === "too_big" && i.origin === "array") return `${what}: ${BUILDER_PROBLEMS.maxItems(Number(i.maximum))}`;
  if (i.code === "invalid_type") return `${what}: ${BUILDER_PROBLEMS.required}`;
  return `${what}: ${issue.message}`;
}

/** Problems with one site section, in the words of the Block panel. Empty when it is ready to publish. */
export function siteSectionProblems(block: Extract<AnyBlock, { type: "site" }>): string[] {
  const schema = SITE_SCHEMAS[block.section.type];
  const res = schema.safeParse({ ...block.section, id: block.id });
  if (res.success) return [];
  const fields = entryFor(block)?.fields ?? [];
  return [...new Set(res.error.issues.map((issue) => describe(issue, fields)))];
}

/** Everything that stops a document from being published. Empty means it can go live. */
export function publishProblems(doc: BuilderDoc, kind: PostKind): Problem[] {
  const problems: Problem[] = [];
  const add = (blockId: string, message: string) => problems.push({ blockId, message });
  if (doc.blocks.length === 0) add("", BUILDER_PROBLEMS.emptyDoc);
  doc.blocks.forEach((b, i) => {
    if (b.type === "site" && b.section.type === "ProductHero" && (kind !== "page" || i !== 0)) add(b.id, BUILDER_PROBLEMS.heroFirst);
  });
  for (const { block } of flatten(doc)) {
    switch (block.type) {
      case "section":
        if (block.children.length === 0) add(block.id, BUILDER_PROBLEMS.emptySection);
        break;
      case "heading":
        if (!block.props.text.trim()) add(block.id, BUILDER_PROBLEMS.emptyHeading);
        break;
      case "richtext":
        if (typeof block.props.content !== "string" && !docText(block.props.content).trim()) add(block.id, BUILDER_PROBLEMS.emptyText);
        break;
      case "image":
        if (!block.props.src) add(block.id, BUILDER_PROBLEMS.imageMissing);
        if (!block.props.alt.trim()) add(block.id, BUILDER_PROBLEMS.altMissing);
        break;
      case "video":
        if (!block.props.url || !youtubeId(block.props.url)) add(block.id, BUILDER_PROBLEMS.videoUrl);
        if (!block.props.title.trim()) add(block.id, BUILDER_PROBLEMS.videoTitle);
        break;
      case "site":
        for (const message of siteSectionProblems(block)) add(block.id, message);
        break;
      case "columns":
        break;
    }
  }
  return problems;
}
