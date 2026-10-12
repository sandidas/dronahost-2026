import { Fragment, type ReactNode } from "react";
import { prepareArticle, withHeadingIds } from "@/lib/blog/sanitize";
import type { TocItem } from "@/lib/blog/types";
import { renderTiptapHtml } from "@/lib/editor/render";
import type { TiptapDoc } from "@/lib/editor/schema";
import { blockDef } from "./blocks";
import type { RenderCtx } from "./blocks/types";
import { docText, h1Block, pageBands, pageFrame } from "./doc";
import type { BuilderDoc, PostKind } from "./model";

/**
 * Server rendering of a builder document for the public site. Each block renders through its own definition, the
 * same code the editor canvas runs, so the page looks the way it did while it was being edited. Rich text is
 * sanitised here; everything else is escaped by React.
 */

export type RenderedDoc = { body: ReactNode; toc: TocItem[]; text: string };

/**
 * The blocks of a post or a page, drawn the same way. Only the H1 differs, because the routes differ: the blog prints
 * the post title as the H1 above the blocks, while a page prints nothing of its own, so its first hero is the H1.
 */
export function renderBuilderDoc(doc: BuilderDoc, kind: PostKind): RenderedDoc {
  const used = new Map<string, number>();
  const toc: TocItem[] = [];
  const richHtml = (content: TiptapDoc | string) => {
    const res = typeof content === "string" ? prepareArticle(content, used) : withHeadingIds(renderTiptapHtml(content), used);
    toc.push(...res.toc);
    return res.html;
  };
  const bands = pageBands(doc);
  const lead = h1Block(doc, kind);
  const nodes = doc.blocks.map((block) => {
    const def = blockDef(block.type);
    const prepared = def?.prepare(block.props ?? {});
    if (!def || prepared === null || prepared === undefined) return null;
    const ctx: RenderCtx = { band: bands.get(block.id), h1: block === lead, editing: false, richHtml };
    return <Fragment key={block.id}>{def.render(prepared, ctx)}</Fragment>;
  });
  return { body: <div {...pageFrame(doc.settings)}>{nodes}</div>, toc, text: docText(doc) };
}

export { readingMinutesOf } from "./doc";
