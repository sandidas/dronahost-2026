import { docText, type TiptapNode } from "@/lib/editor/schema";
import type { BuilderDoc } from "./model";
import { sectionText } from "./sections";
import { flatten } from "./tree";

/**
 * Light, client-safe readings of a document for the editor canvas: words for the reading time and the headings for the
 * contents list. The public page computes the same from the rendered HTML (lib/builder/render.tsx).
 */

export function docWords(doc: BuilderDoc): string {
  return flatten(doc)
    .map(({ block }) => {
      if (block.type === "heading") return block.props.text;
      if (block.type === "richtext") return typeof block.props.content === "string" ? block.props.content.replace(/<[^>]+>/g, " ") : docText(block.props.content);
      if (block.type === "image") return block.props.caption;
      if (block.type === "site") return sectionText(block.section.type, block.section.content);
      return "";
    })
    .join(" ");
}

/** Reading time at 220 words a minute, never less than one minute (the same rule as the public page). */
export const readingMinutes = (doc: BuilderDoc): number => Math.max(1, Math.round(docWords(doc).split(/\s+/).filter(Boolean).length / 220));

const slug = (s: string) => s.toLowerCase().replace(/&[a-z]+;/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

/** H2 and H3 headings in document order, with the same ids the public page gives them. */
export function docToc(doc: BuilderDoc): { id: string; text: string; level: 2 | 3 }[] {
  const used = new Map<string, number>();
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const add = (text: string, level: number) => {
    const t = text.trim();
    if (!t || (level !== 2 && level !== 3)) return;
    const base = slug(t);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    out.push({ id: n > 0 ? `${base}-${n}` : base, text: t, level: level as 2 | 3 });
  };
  const walk = (node: TiptapNode) => {
    if (node.type === "heading") add(docText(node), Number(node.attrs?.level ?? 2));
    (node.content ?? []).forEach(walk);
  };
  for (const { block } of flatten(doc)) {
    if (block.type === "heading") add(block.props.text, block.props.level);
    if (block.type === "richtext" && typeof block.props.content !== "string") walk(block.props.content);
  }
  return out;
}
