import { Fragment, type ReactNode } from "react";
import { ColumnsGrid, COLUMN_CELL, Figure, pageBands, POST_SECTION_GAP, SectionShell, VideoFrame } from "@/components/builder/layout";
import { renderSection } from "@/components/builder/SectionView";
import { plainText, prepareArticle, uniqueHeadingId, withHeadingIds } from "@/lib/blog/sanitize";
import type { TocItem } from "@/lib/blog/types";
import { docText } from "@/lib/editor/schema";
import { renderTiptapHtml } from "@/lib/editor/render";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { youtubeId, type BuilderDoc, type ColumnsBlock, type LeafBlock, type PostKind } from "./model";
import { prepareSection, sectionText } from "./sections";

/**
 * Server rendering of a builder document for the public site. It uses the same section renderer and page structure as
 * the editor canvas (components/builder/SectionView.tsx and layout.tsx), so the page looks the way it did while it was
 * being edited. Rich text is sanitised; everything else is escaped by React.
 */

type Ctx = { used: Map<string, number>; toc: TocItem[]; words: string[] };

function Html({ html }: { html: string }) {
  // `contents` keeps the article's spacing rules (`.article p`, `.article h2`) working on the inner elements.
  return <div className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderLeaf(block: LeafBlock, ctx: Ctx): ReactNode {
  switch (block.type) {
    case "heading": {
      const text = block.props.text.trim();
      if (!text) return null;
      const id = uniqueHeadingId(text, ctx.used);
      if (block.props.level !== 4) ctx.toc.push({ id, text, level: block.props.level });
      ctx.words.push(text);
      const Tag = `h${block.props.level}` as "h2" | "h3" | "h4";
      return (
        <Tag key={block.id} id={id}>
          {text}
        </Tag>
      );
    }
    case "richtext": {
      const { content } = block.props;
      const { html, toc } = typeof content === "string" ? prepareArticle(content, ctx.used) : withHeadingIds(renderTiptapHtml(content), ctx.used);
      ctx.toc.push(...toc);
      ctx.words.push(typeof content === "string" ? plainText(content) : docText(content));
      return <Html key={block.id} html={html} />;
    }
    case "image": {
      const { src, alt, caption } = block.props;
      if (!isSafeImageSrc(src)) return null;
      if (caption) ctx.words.push(caption);
      return <Figure key={block.id} src={src} alt={alt} caption={caption} />;
    }
    case "video": {
      const id = youtubeId(block.props.url);
      return id ? <VideoFrame key={block.id} id={id} title={block.props.title} /> : null;
    }
  }
}

function renderColumns(block: ColumnsBlock, ctx: Ctx): ReactNode {
  return (
    <ColumnsGrid key={block.id} layout={block.props.layout}>
      {block.columns.map((col) => (
        <div key={col.id} className={COLUMN_CELL}>
          {col.children.map((leaf) => renderLeaf(leaf, ctx))}
        </div>
      ))}
    </ColumnsGrid>
  );
}

export type RenderedDoc = { body: ReactNode; toc: TocItem[]; text: string; hasHero: boolean };

/**
 * Posts render inside the article layout (the post title is the H1); pages render full width, a section at a time,
 * with alternating bands.
 */
export function renderBuilderDoc(doc: BuilderDoc, kind: PostKind): RenderedDoc {
  const ctx: Ctx = { used: new Map(), toc: [], words: [] };
  const bands = pageBands(doc, kind);
  const nodes = doc.blocks.map((block, i) => {
    if (block.type === "site") {
      const node = renderSection(block.section.type, block.section.content, bands.get(block.id), kind === "post");
      if (!node) return null;
      ctx.words.push(sectionText(block.section.type, block.section.content));
      return kind === "post" ? (
        <div key={block.id} className={POST_SECTION_GAP}>
          {node}
        </div>
      ) : (
        <Fragment key={block.id}>{node}</Fragment>
      );
    }
    return (
      <SectionShell key={block.id} kind={kind} width={block.props.width} band={bands.get(block.id)} first={i === 0}>
        {block.children.map((child) => (child.type === "columns" ? renderColumns(child, ctx) : renderLeaf(child, ctx)))}
      </SectionShell>
    );
  });
  const first = doc.blocks[0];
  // The page keeps one H1: the hero's when it shows, otherwise the page title (rendered by the route).
  const hasHero = first?.type === "site" && first.section.type === "Hero" && prepareSection("Hero", first.section.content) !== null;
  // One wrapper, so the site's position-based bands (`.look-luxe > section:nth-of-type(even)`) leave the builder's own
  // bands (pageBands) in charge, exactly as on the editor canvas.
  return { body: kind === "page" ? <div className="builder-page">{nodes}</div> : <>{nodes}</>, toc: ctx.toc, text: ctx.words.join(" "), hasHero };
}

/** Reading time at 220 words a minute, never less than one minute. */
export const readingMinutesOf = (text: string): number => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
