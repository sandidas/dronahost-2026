import { blockDef, prepareBlock } from "./blocks";
import type { Heading } from "./blocks/types";
import { fieldImages, fieldText, type Img } from "./fields";
import { BAND_CLASS, newBlockId, type Block, type BuilderDoc, type PageSettings, type PostKind } from "./model";

/**
 * Whole-document operations and readings. Every edit returns a new document and leaves the input alone, so undo and
 * redo can keep old documents by reference. Readings go through each block's definition, never its type.
 */

const clamp = (i: number, n: number) => Math.max(0, Math.min(i, n));

export const indexOf = (doc: BuilderDoc, id: string): number => doc.blocks.findIndex((b) => b.id === id);
export const findBlock = (doc: BuilderDoc, id: string): Block | undefined => doc.blocks.find((b) => b.id === id);

export function insertBlock(doc: BuilderDoc, index: number, block: Block): BuilderDoc {
  const blocks = [...doc.blocks];
  blocks.splice(clamp(index, blocks.length), 0, block);
  return { ...doc, blocks };
}

export const removeBlock = (doc: BuilderDoc, id: string): BuilderDoc => (indexOf(doc, id) < 0 ? doc : { ...doc, blocks: doc.blocks.filter((b) => b.id !== id) });

/** Replaces a block's props with what `update` returns. */
export function updateProps(doc: BuilderDoc, id: string, update: (props: Block["props"]) => Block["props"]): BuilderDoc {
  const i = indexOf(doc, id);
  if (i < 0) return doc;
  const blocks = [...doc.blocks];
  blocks[i] = { ...blocks[i]!, props: update(blocks[i]!.props) };
  return { ...doc, blocks };
}

/** Moves a block to `index`, read in the list after the block has been taken out. */
export function moveBlock(doc: BuilderDoc, id: string, index: number): BuilderDoc {
  const from = indexOf(doc, id);
  if (from < 0) return doc;
  const blocks = doc.blocks.filter((b) => b.id !== id);
  const to = clamp(index, blocks.length);
  if (to === from) return doc;
  blocks.splice(to, 0, doc.blocks[from]!);
  return { ...doc, blocks };
}

export const nudgeBlock = (doc: BuilderDoc, id: string, delta: -1 | 1): BuilderDoc => {
  const i = indexOf(doc, id);
  return i < 0 || i + delta < 0 || i + delta >= doc.blocks.length ? doc : moveBlock(doc, id, i + delta);
};

/** A copy with a fresh id (ids double as anchors), placed after the original. */
export function duplicateBlock(doc: BuilderDoc, id: string): { doc: BuilderDoc; id: string | null } {
  const i = indexOf(doc, id);
  if (i < 0) return { doc, id: null };
  const copy = { ...structuredClone(doc.blocks[i]!), id: newBlockId() };
  return { doc: insertBlock(doc, i + 1, copy), id: copy.id };
}

export const setSettings = (doc: BuilderDoc, patch: Partial<PageSettings>): BuilderDoc => ({ ...doc, settings: { ...doc.settings, ...patch } });

// ─── Readings ─────────────────────────────────────────────────────────────────

/** The light band for every second section on the page background, counting only blocks that show something. */
export function pageBands(doc: BuilderDoc): Map<string, string> {
  const bands = new Map<string, string>();
  let n = 0;
  for (const block of doc.blocks) {
    if (!blockDef(block.type)?.banded || prepareBlock(block) === null) continue;
    if (n % 2 === 1) bands.set(block.id, BAND_CLASS);
    n += 1;
  }
  return bands;
}

export { BAND_CLASS };

/**
 * The block whose heading is the page's H1: on a page, the first hero that shows (a page prints no title of its own).
 * A post's H1 is its title, printed by the blog, so no block holds it there.
 */
export function h1Block(doc: BuilderDoc, kind: PostKind): Block | null {
  if (kind !== "page") return null;
  return doc.blocks.find((b) => blockDef(b.type)?.hero && prepareBlock(b) !== null) ?? null;
}

/** Every heading the page shows, in order: the outline screen readers and search engines read. A post starts with its title. */
export function docHeadings(doc: BuilderDoc, title: string, kind: PostKind): Heading[] {
  const lead = h1Block(doc, kind);
  const out: Heading[] = kind === "post" ? [{ level: 1, text: title }] : [];
  for (const block of doc.blocks) {
    const def = blockDef(block.type);
    const p = prepareBlock(block);
    if (def?.headings && p !== null) out.push(...def.headings(p, block === lead));
  }
  return out;
}

/** The words a reader sees, block by block (reading time, opening text, search checks). */
export const blockText = (block: Block): string => {
  const def = blockDef(block.type);
  return def && prepareBlock(block) !== null ? fieldText(def.fields, block.props) : "";
};

export const docText = (doc: BuilderDoc): string => doc.blocks.map(blockText).filter(Boolean).join(" ");

/** Reading time at 220 words a minute, never less than one minute (the same rule as the public page). */
export const readingMinutesOf = (text: string): number => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));

/** Every image the page shows, with its alt text. */
export const docImages = (doc: BuilderDoc): Img[] => doc.blocks.flatMap((b) => fieldImages(blockDef(b.type)?.fields ?? [], b.props));

/** Questions and answers from the page's FAQ blocks, for FAQPage structured data. */
export function faqEntries(doc: BuilderDoc): { question: string; answer: string }[] {
  return doc.blocks.flatMap((b) => {
    const def = blockDef(b.type);
    const p = prepareBlock(b);
    return def?.faq && p !== null ? def.faq(p) : [];
  });
}

/**
 * The wrapper for the blocks, on the canvas and on the public page alike: the space between sections through a data
 * attribute, and it keeps the site's position-based bands (`.look-luxe > section:nth-of-type(even)`) off, so the
 * builder's own bands (pageBands) are in charge.
 */
export const pageFrame = (settings: PageSettings): { className: string; "data-spacing": string } => ({ className: "builder-page", "data-spacing": settings.spacing });
