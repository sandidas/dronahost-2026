import { Fragment, type ReactNode } from "react";
import { prepareArticle, withHeadingIds } from "@/lib/blog/sanitize";
import type { TocItem } from "@/lib/blog/types";
import { renderTiptapHtml } from "@/lib/editor/render";
import type { TiptapDoc } from "@/lib/editor/schema";
import { blockDef } from "./blocks";
import type { RenderCtx } from "./blocks/types";
import { docText, leadBlock, pageBands, pageFrame } from "./doc";
import type { BuilderDoc, PostKind } from "./model";

/**
 * Server rendering of a builder document for the public site. Each block renders through its own definition, the
 * same code the editor canvas runs, so the page looks the way it did while it was being edited. Rich text is
 * sanitised here; everything else is escaped by React.
 */

export type RenderedDoc = { body: ReactNode; toc: TocItem[]; text: string; hasHero: boolean };

/** Posts render inside the article layout (the post title is the H1); pages render full width with alternating bands. */
export function renderBuilderDoc(doc: BuilderDoc, kind: PostKind): RenderedDoc {
  const used = new Map<string, number>();
  const toc: TocItem[] = [];
  const richHtml = (content: TiptapDoc | string) => {
    const res = typeof content === "string" ? prepareArticle(content, used) : withHeadingIds(renderTiptapHtml(content), used);
    toc.push(...res.toc);
    return res.html;
  };
  const bands = pageBands(doc, kind);
  const nodes = doc.blocks.map((block) => {
    const def = blockDef(block.type);
    const prepared = def?.prepare(block.props ?? {});
    if (!def || prepared === null || prepared === undefined) return null;
    const ctx: RenderCtx = { kind, band: bands.get(block.id), editing: false, richHtml };
    return <Fragment key={block.id}>{def.render(prepared, ctx)}</Fragment>;
  });
  // The page keeps one H1: the hero's when it shows, otherwise the page title (rendered by the route).
  const hasHero = leadBlock(doc, kind) !== null;
  // One wrapper carries the page settings (width, spacing) and keeps the site's position-based bands
  // (`.look-luxe > section:nth-of-type(even)`) off, so the builder's own bands (pageBands) are in charge, as on the canvas.
  return { body: kind === "page" ? <div {...pageFrame(doc.settings)}>{nodes}</div> : <>{nodes}</>, toc, text: docText(doc), hasHero };
}

export { readingMinutesOf } from "./doc";
