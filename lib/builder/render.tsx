import { Fragment, type ReactNode } from "react";
import { plainText, prepareArticle, uniqueHeadingId, withHeadingIds } from "@/lib/blog/sanitize";
import type { TocItem } from "@/lib/blog/types";
import { defaultContext } from "@/lib/content/refs";
import { SECTION_REGISTRY } from "@/lib/content/registry";
import type { SectionSpec } from "@/lib/content/schemas/sections";
import { docText } from "@/lib/editor/schema";
import { renderTiptapHtml } from "@/lib/editor/render";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { cn } from "@/utils/cn";
import { isRegistrySection, youtubeEmbedSrc, youtubeId, type BuilderDoc, type ColumnsBlock, type LeafBlock, type PostKind, type SectionBlock, type SiteBlock } from "./model";
import { siteSectionProblems } from "./validate";
import type { FreeSectionData } from "./free-sections";
import ActionBand from "@/components/sections/banners/ActionBand";
import AnswerBanner from "@/components/sections/banners/AnswerBanner";
import DestinationBanner from "@/components/sections/banners/DestinationBanner";
import GuideBanner from "@/components/sections/banners/GuideBanner";
import OfferBanner from "@/components/sections/banners/OfferBanner";
import FeatureGrid from "@/components/sections/FeatureGrid";
import TwoColumn from "@/components/sections/TwoColumn";

/**
 * Server rendering of a builder document for the public site (and for site sections on the editor canvas). Content
 * blocks use the article typography; site sections go through the same registry as content/pages/*.json, so they look
 * exactly like the hand-built pages. Everything a visitor sees is sanitised or escaped by React.
 */

type Ctx = { used: Map<string, number>; toc: TocItem[]; words: string[] };

const GRID: Record<ColumnsBlock["props"]["layout"], string> = {
  "1-1": "md:grid-cols-2",
  "2-1": "md:grid-cols-[2fr_1fr]",
  "1-2": "md:grid-cols-[1fr_2fr]",
  "1-1-1": "md:grid-cols-3",
};

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
      return (
        <figure key={block.id} className="mt-8">
          {/* Staff images come from any https address or the site, so next/image (which needs known hosts) is not used. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-border" />
          {caption && <figcaption className="t-small mt-2 text-muted-foreground">{caption}</figcaption>}
        </figure>
      );
    }
    case "video": {
      const id = youtubeId(block.props.url);
      if (!id) return null;
      return (
        <div key={block.id} data-youtube-video="">
          <iframe
            src={youtubeEmbedSrc(id)}
            title={block.props.title || EDITOR_TEXT.videoTitle}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }
}

function renderColumns(block: ColumnsBlock, ctx: Ctx): ReactNode {
  return (
    <div key={block.id} className={cn("mt-8 grid gap-8", GRID[block.props.layout])}>
      {block.columns.map((col) => (
        <div key={col.id} className="min-w-0 [&>:first-child]:mt-0">
          {col.children.map((leaf) => renderLeaf(leaf, ctx))}
        </div>
      ))}
    </div>
  );
}

function sectionChildren(block: SectionBlock, ctx: Ctx): ReactNode[] {
  return block.children.map((child) => (child.type === "columns" ? renderColumns(child, ctx) : renderLeaf(child, ctx)));
}

type Free = FreeSectionData;
const ctaList = (...ctas: ({ label: string; href: string } | undefined)[]) =>
  ctas.flatMap((c, i) => (c ? [{ ...c, variant: i === 0 ? ("primary" as const) : ("secondary" as const) }] : []));

/** Builder-only sections: the content maps straight onto an existing site component. Headings are H2 (the page has its H1). */
const FREE_RENDER: { [K in keyof Free]: (s: Free[K]) => ReactNode } = {
  OfferBanner: ({ content: c }) => (
    <OfferBanner eyebrow={c.eyebrow} title={c.title} description={c.description} planName={c.ticketLabel} primaryCta={c.primaryCta} nextStep={c.nextStep} layout={c.layout} scope={c.scope} headingLevel="h2" />
  ),
  GuideBanner: ({ content: c }) => <GuideBanner eyebrow={c.eyebrow} title={c.title} summary={c.summary} learn={c.learn} cta={c.cta} layout={c.layout} numbered={c.numbered} scope={c.scope} headingLevel="h2" />,
  ActionBand: ({ content: c }) => <ActionBand label={c.label} line={c.line} cta={c.cta} note={c.note} variant={c.variant} headingLevel="h2" />,
  AnswerBanner: ({ content: c }) => <AnswerBanner eyebrow={c.eyebrow} question={c.question} answer={c.answer} next={c.next} layout={c.layout} headingLevel="h2" />,
  SplitSection: ({ content: c }) => (
    <TwoColumn
      eyebrow={c.eyebrow}
      title={c.title}
      description={c.description}
      features={c.features}
      cta={ctaList(c.ctaPrimary, c.ctaSecondary)}
      visualPosition={c.imagePosition}
      // eslint-disable-next-line @next/next/no-img-element
      visual={<img src={c.image.src} alt={c.image.alt} loading="lazy" decoding="async" className="h-auto w-full rounded-2xl border border-border object-cover" />}
    />
  ),
  FeatureCards: ({ content: c }) => (
    <FeatureGrid eyebrow={c.eyebrow} title={c.title} description={c.description} columns={c.columns} variant={c.variant} items={c.items.map((i) => ({ icon: i.icon, title: i.title, description: i.description, cta: i.link }))} />
  ),
  LinkTiles: ({ content: c }) => <DestinationBanner eyebrow={c.eyebrow} title={c.title} intro={c.intro} items={c.items} layout={c.layout} columns={c.columns} headingLevel="h2" />,
};

/** A site section rendered exactly as on the hand-built pages, or null with the reasons when it is not complete yet. */
export function renderSiteSection(block: SiteBlock): { node: ReactNode; problems: string[] } {
  const problems = siteSectionProblems(block);
  if (problems.length) return { node: null, problems };
  const spec = { ...block.section, id: block.id };
  if (!isRegistrySection(block.section.type)) {
    const render = FREE_RENDER[block.section.type as keyof Free] as (s: unknown) => ReactNode;
    // No wrapper element: `.page-tones > section` alternates the bands, so the component's section stays a direct child.
    return { node: render(spec), problems: [] };
  }
  const entry = SECTION_REGISTRY[block.section.type] as { render: (s: SectionSpec, c: typeof defaultContext, look: "standard") => ReactNode };
  return { node: entry.render(spec as SectionSpec, defaultContext, "standard"), problems: [] };
}

export type RenderedDoc = { body: ReactNode; toc: TocItem[]; text: string; hasHero: boolean };

/**
 * Posts render inside the article layout (the post title is the H1); pages render full width, a section at a time,
 * with alternating bands like the hand-built pages.
 */
export function renderBuilderDoc(doc: BuilderDoc, kind: PostKind): RenderedDoc {
  const ctx: Ctx = { used: new Map(), toc: [], words: [] };
  const nodes = doc.blocks.map((block) => {
    if (block.type === "site") {
      const { node } = renderSiteSection(block);
      if (!node) return null;
      return kind === "post" ? (
        <div key={block.id} className="my-12">
          {node}
        </div>
      ) : (
        // No wrapper: `.page-tones > section` alternates the bands, so the section must stay a direct child.
        <Fragment key={block.id}>{node}</Fragment>
      );
    }
    const children = sectionChildren(block, ctx);
    if (kind === "post") {
      return (
        <div key={block.id} className="article max-w-none [&>:first-child]:mt-0 [&+&]:mt-4">
          {children}
        </div>
      );
    }
    return (
      <section key={block.id} id={block.id} className="section-y">
        <div className="container-site">
          <div className={cn("article [&>:first-child]:mt-0", block.props.width === "text" ? "mx-auto" : "max-w-none")}>{children}</div>
        </div>
      </section>
    );
  });
  const first = doc.blocks[0];
  return {
    body: kind === "page" ? <div className="page-tones">{nodes}</div> : <>{nodes}</>,
    toc: ctx.toc,
    text: ctx.words.join(" "),
    hasHero: first?.type === "site" && first.section.type === "ProductHero",
  };
}

/** Reading time at 220 words a minute, never less than one minute. */
export const readingMinutesOf = (text: string): number => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
