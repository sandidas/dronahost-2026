import { FEATURE_LIBRARY } from "@/lib/content/features";
import type { TiptapDoc, TiptapNode } from "@/lib/editor/schema";
import { blockDef } from "./blocks";
import { DEFAULT_SETTINGS, EMPTY_BUILDER_DOC, isBuilderDoc, newBlockId, PAGE_SPACINGS, PAGE_WIDTHS, type Block, type BuilderDoc } from "./model";

/**
 * Reads any stored content as a current builder document. Every place that loads a post or page (the editor, the
 * blog, builder pages) goes through `toBuilderDoc`, and every save through `upgradeDoc`, so older content opens and
 * saves without anyone converting it by hand. The converted shape is stored on the next save.
 *
 * - Posts from before the builder (Tiptap JSON or HTML) become one Text block.
 * - Version 1 documents (sections holding headings, text, images, videos and columns) become a flat list: each run of
 *   headings and text becomes one Text block, with images and videos as their own blocks in the same order.
 * - Sections from the very first builder version, which used the site's page-spec registry, become the builder's own
 *   sections with the same words.
 */

type Old = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : undefined);
const cta = (v: unknown) => (v && typeof v === "object" ? (v as { label?: string; href?: string }) : undefined);
const plain = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !x.startsWith("claim:")) : undefined);
const obj = (v: unknown): Old => (v && typeof v === "object" && !Array.isArray(v) ? (v as Old) : {});

const REGISTRY_SECTIONS: Record<string, (c: Old) => { type: string; content: Old }> = {
  ProductHero: (c) => ({ type: "Hero", content: { eyebrow: s(c.eyebrow), title: s(c.h1), accent: s(c.accent), description: s(c.lead), primaryCta: cta(c.ctaPrimary), secondaryCta: cta(c.ctaSecondary), highlights: plain(c.highlights) } }),
  ProcessTimeline: (c) => ({ type: "Steps", content: { eyebrow: s(c.eyebrow), title: s(c.h2), description: s(c.description), steps: c.steps } }),
  FAQSection: (c) => ({
    type: "Faq",
    content: { title: s(c.h2), items: Array.isArray(c.items) ? (c.items as Old[]).map((i) => ({ question: s(i.q) ?? "", answer: s(i.a) ?? "" })) : [] },
  }),
  CTABand: (c) => ({ type: "CtaBand", content: { title: s(c.h2), description: s(c.description), primaryCta: cta(c.ctaPrimary), secondaryCta: cta(c.ctaSecondary), note: s(c.note) } }),
  BentoGrid: (c) => ({
    type: "FeatureCards",
    content: {
      eyebrow: s(c.eyebrow),
      title: s(c.h2),
      description: s(c.description),
      items: (Array.isArray(c.tiles) ? c.tiles : []).flatMap((ref) => {
        const f = FEATURE_LIBRARY.find((x) => `feature:${x.id}` === ref);
        return f ? [{ title: f.tile.title, description: f.tile.description }] : [];
      }),
      columns: 3,
      variant: "cards",
    },
  }),
};

/** Drops undefined values, so the stored props stay within the block's shape. */
const compact = (o: Old): Old => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

const id = (v: unknown) => (typeof v === "string" && /^[a-z0-9]{6,32}$/.test(v) ? v : newBlockId());

/** A version 1 section: its headings and text merged into Text blocks, images and videos kept as blocks, in order. */
function fromSection(section: Old): Block[] {
  const width = obj(section.props).width === "wide" ? "wide" : "text";
  const out: Block[] = [];
  let run: TiptapNode[] = [];
  let runId: string | null = null;
  const flush = () => {
    if (run.length) out.push({ id: runId ?? newBlockId(), type: "Text", props: { content: { type: "doc", content: run } satisfies TiptapDoc, width } });
    run = [];
    runId = null;
  };
  const visit = (child: Old) => {
    const props = obj(child.props);
    runId ??= typeof child.id === "string" ? id(child.id) : null;
    switch (child.type) {
      case "heading": {
        const text = s(props.text)?.trim();
        if (text) run.push({ type: "heading", attrs: { level: Number(props.level) || 2 }, content: [{ type: "text", text }] });
        return;
      }
      case "richtext": {
        if (typeof props.content === "string") {
          flush();
          out.push({ id: id(child.id), type: "Text", props: { content: props.content, width } });
        } else run.push(...((obj(props.content).content as TiptapNode[] | undefined) ?? []));
        return;
      }
      case "image":
        flush();
        out.push({ id: id(child.id), type: "Image", props: compact({ image: s(props.src) ? { src: s(props.src), alt: s(props.alt) ?? "" } : undefined, caption: s(props.caption) || undefined, width }) });
        return;
      case "video":
        flush();
        out.push({ id: id(child.id), type: "Video", props: compact({ url: s(props.url) || undefined, title: s(props.title) || undefined, width }) });
        return;
      case "columns":
        // Columns side by side become the same content one after another.
        for (const col of Array.isArray(child.columns) ? (child.columns as Old[]) : []) for (const c of Array.isArray(col.children) ? (col.children as Old[]) : []) visit(c);
        return;
    }
  };
  for (const child of Array.isArray(section.children) ? (section.children as Old[]) : []) visit(child);
  flush();
  return out;
}

function fromV1Root(root: Old): Block[] {
  if (root.type === "section") return fromSection(root);
  if (root.type !== "site") return [];
  const section = obj(root.section);
  const type = String(section.type);
  const old = REGISTRY_SECTIONS[type];
  const next = old ? old(obj(section.content)) : { type, content: obj(section.content) };
  return [{ id: id(root.id), type: next.type, props: compact(next.content) }];
}

/** Any stored or submitted document in the current shape (not yet checked: parseBuilderDoc does that). */
export function upgradeDoc(raw: unknown): unknown {
  if (!isBuilderDoc(raw)) return raw;
  if (raw.version === 2) return raw;
  return { version: 2, settings: DEFAULT_SETTINGS, blocks: (raw.blocks as Old[]).flatMap((b) => fromV1Root(obj(b))) };
}

/** Stored content, whatever its age, as a document the editor and the renderer can use. Unknown blocks are left out. */
export function toBuilderDoc(content: unknown): BuilderDoc {
  if (isBuilderDoc(content)) {
    const doc = obj(upgradeDoc(content));
    const settings = obj(doc.settings);
    return {
      version: 2,
      settings: {
        width: (PAGE_WIDTHS as readonly unknown[]).includes(settings.width) ? (settings.width as BuilderDoc["settings"]["width"]) : DEFAULT_SETTINGS.width,
        spacing: (PAGE_SPACINGS as readonly unknown[]).includes(settings.spacing) ? (settings.spacing as BuilderDoc["settings"]["spacing"]) : DEFAULT_SETTINGS.spacing,
      },
      blocks: (Array.isArray(doc.blocks) ? (doc.blocks as Old[]) : []).flatMap((b) => (typeof b.type === "string" && blockDef(b.type) ? [{ id: id(b.id), type: b.type, props: obj(b.props) }] : [])),
    };
  }
  const isTiptap = typeof content === "object" && content !== null && (content as { type?: unknown }).type === "doc";
  const isHtml = typeof content === "string" && content.trim().length > 0;
  if (!isTiptap && !isHtml) return EMPTY_BUILDER_DOC;
  return { ...EMPTY_BUILDER_DOC, blocks: [{ id: newBlockId(), type: "Text", props: { content: content as TiptapDoc | string, width: "text" } }] };
}
