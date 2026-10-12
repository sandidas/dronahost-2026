import { blockDef, prepareBlock } from "./blocks";
import { docText, readingMinutesOf } from "./doc";
import type { BuilderDoc } from "./model";

/**
 * Light, client-safe readings of a document for the editor canvas: the reading time and the contents list. The public
 * page computes the same from the rendered HTML (lib/builder/render.tsx).
 */

export const readingMinutes = (doc: BuilderDoc): number => readingMinutesOf(docText(doc));

const slug = (s: string) => s.toLowerCase().replace(/&[a-z]+;/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

/** H2 and H3 headings inside text blocks, in document order, with the same ids the public page gives them. */
export function docToc(doc: BuilderDoc): { id: string; text: string; level: 2 | 3 }[] {
  const used = new Map<string, number>();
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const block of doc.blocks) {
    const def = blockDef(block.type);
    const p = prepareBlock(block);
    // Only rich text headings get anchors (sections draw their own headings without ids).
    if (!def || p === null || !def.fields.some((f) => f.kind === "richtext")) continue;
    for (const h of def.headings?.(p) ?? []) {
      const t = h.text.trim();
      if (!t || (h.level !== 2 && h.level !== 3)) continue;
      const base = slug(t);
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      out.push({ id: n > 0 ? `${base}-${n}` : base, text: t, level: h.level });
    }
  }
  return out;
}
