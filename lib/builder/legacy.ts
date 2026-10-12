import { FEATURE_LIBRARY } from "@/lib/content/features";
import type { TiptapDoc } from "@/lib/editor/schema";
import { EMPTY_BUILDER_DOC, isBuilderDoc, newBlockId, type BuilderDoc, type RichTextBlock, type RootBlock } from "./model";

/**
 * Reads any stored content as a current builder document. Server-side: every place that loads a post or page (the
 * editor, the blog, builder pages) goes through `toBuilderDoc`.
 *
 * - Posts from before the builder (Tiptap JSON or HTML) become one Section with one Rich text block.
 * - Sections from the first builder version, which used the site's page-spec registry, become the builder's own
 *   sections with the same words. The registry's Feature grid becomes Feature cards with the feature library's text.
 * The converted shape is stored on the next save.
 */

type Old = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : undefined);
const cta = (v: unknown) => (v && typeof v === "object" ? (v as { label?: string; href?: string }) : undefined);
const plain = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !x.startsWith("claim:")) : undefined);

const UPGRADE: Record<string, (c: Old) => { type: string; content: Old }> = {
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

/** Drops undefined values, so the stored content stays within the section's shape. */
const compact = (o: Old): Old => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

function upgradeBlock(block: RootBlock): RootBlock {
  if (block.type !== "site") return block;
  const section = block.section as unknown as Old;
  const type = String(section.type);
  const old = UPGRADE[type];
  if (old) {
    const next = old((section.content ?? {}) as Old);
    return { ...block, section: { type: next.type, content: compact(next.content) } as never };
  }
  // First-version builder sections kept their fields beside `type`; they now live under `content` (already true for them).
  return block;
}

export function toBuilderDoc(content: unknown): BuilderDoc {
  if (isBuilderDoc(content)) return { ...content, blocks: content.blocks.map(upgradeBlock) };
  const isTiptap = typeof content === "object" && content !== null && (content as { type?: unknown }).type === "doc";
  const isHtml = typeof content === "string" && content.trim().length > 0;
  if (!isTiptap && !isHtml) return EMPTY_BUILDER_DOC;
  const richtext: RichTextBlock = { id: newBlockId(), type: "richtext", props: { content: content as TiptapDoc | string } };
  return { version: 1, blocks: [{ id: newBlockId(), type: "section", props: { width: "text" }, children: [richtext] }] };
}
