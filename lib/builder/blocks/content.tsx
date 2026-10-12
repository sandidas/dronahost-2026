import type { ReactNode } from "react";
import { BlockShell, Figure, Html, VideoFrame } from "@/components/builder/layout";
import Gallery from "@/components/sections/Gallery";
import CodeBlock from "@/components/ui/CodeBlock";
import { BUILDER_TEXT } from "@/content/portal-strings";
import type { TiptapDoc, TiptapNode } from "@/lib/editor/schema";
import { cn } from "@/utils/cn";
import { completeItems, image, pick, richtext, text, type Field } from "../fields";
import { youtubeId } from "../model";
import { frameFields, frameOf } from "./frame";
import { defineBlock, type Heading, type RenderCtx } from "./types";

/** Text and media: written text, two columns of text, a single image, a video, a code sample and a photo gallery. */

const F = BUILDER_TEXT.fields;
const options = <K extends string>(labels: Record<K, string>) => (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));
const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

function tiptapHeadings(node: TiptapNode, out: Heading[]): Heading[] {
  if (node.type === "heading") out.push({ level: Number(node.attrs?.level ?? 2), text: (node.content ?? []).map((c) => c.text ?? "").join("") });
  for (const child of node.content ?? []) tiptapHeadings(child, out);
  return out;
}

/** The headings in rich text: Tiptap JSON, or an older post's HTML. */
const richHeadings = (content: TiptapDoc | string | undefined): Heading[] =>
  content === undefined
    ? []
    : typeof content === "string"
      ? [...content.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: m[2]!.replace(/<[^>]+>/g, "") }))
      : tiptapHeadings(content, []);

/** Rich text on the public page (the canvas edits it in place, components/builder/inline.tsx). */
const rich = (content: TiptapDoc | string | undefined, ctx: RenderCtx) => (content !== undefined && ctx.richHtml ? <Html html={ctx.richHtml(content)} /> : null);

export const Text = defineBlock({
  type: "Text",
  group: "text",
  icon: "pilcrow",
  fields: [{ kind: "richtext", key: "content", label: F.text }, ...frameFields()],
  defaults: () => ({ content: EMPTY_DOC }),
  prepare: (p) => {
    const content = richtext(p.content);
    return content ? { content, frame: frameOf(p) } : null;
  },
  render: (p, ctx) => (
    <BlockShell frame={p.frame} article>
      {rich(p.content, ctx)}
    </BlockShell>
  ),
  headings: (p) => richHeadings(p.content),
});

export const SPLITS = ["equal", "wideLeft", "wideRight"] as const;
/** Column sizes from the large breakpoint; phones and tablets stack the columns. */
export const SPLIT_CLASS: Record<(typeof SPLITS)[number], string> = { equal: "lg:grid-cols-2", wideLeft: "lg:grid-cols-[2fr_1fr]", wideRight: "lg:grid-cols-[1fr_2fr]" };

/** Two columns of text, side by side from the large breakpoint, stacked below it. Each column fills its width. */
export function Columns({ split, left, right }: { split: (typeof SPLITS)[number]; left: ReactNode; right: ReactNode }) {
  return (
    <div className={cn("grid gap-10 lg:gap-14", SPLIT_CLASS[split])}>
      <div className="article min-w-0 max-w-none [&>:first-child]:mt-0">{left}</div>
      <div className="article min-w-0 max-w-none [&>:first-child]:mt-0">{right}</div>
    </div>
  );
}

export const TwoColumn = defineBlock({
  type: "TwoColumn",
  group: "text",
  icon: "columns-2",
  fields: [
    { kind: "richtext", key: "left", label: F.leftColumn },
    { kind: "richtext", key: "right", label: F.rightColumn },
    { kind: "select", key: "split", label: F.split, options: options(F.splits) },
    // Full width by default: the two columns run edge to edge, inside the page gutter.
    ...frameFields("full"),
  ],
  defaults: () => ({ left: EMPTY_DOC, right: EMPTY_DOC }),
  prepare: (p) => {
    const left = richtext(p.left);
    const right = richtext(p.right);
    return left || right ? { left, right, split: pick(p.split, SPLITS, "equal"), frame: frameOf(p, "full") } : null;
  },
  render: (p, ctx) => (
    <BlockShell frame={p.frame}>
      <Columns split={p.split} left={rich(p.left, ctx)} right={rich(p.right, ctx)} />
    </BlockShell>
  ),
  headings: (p) => [...richHeadings(p.left), ...richHeadings(p.right)],
});

export const ImageBlock = defineBlock({
  type: "Image",
  group: "media",
  icon: "image",
  fields: [{ kind: "image", key: "image", label: F.image }, { kind: "text", key: "caption", label: F.caption, max: 300 }, ...frameFields("narrow")],
  prepare: (p) => {
    const img = image(p.image);
    return img ? { ...img, caption: text(p.caption), frame: frameOf(p, "narrow") } : null;
  },
  render: (p) => (
    <BlockShell frame={p.frame}>
      <Figure src={p.src} alt={p.alt} caption={p.caption} />
    </BlockShell>
  ),
});

export const Video = defineBlock({
  type: "Video",
  group: "media",
  icon: "video",
  fields: [
    { kind: "text", key: "url", label: F.videoUrl, help: F.videoUrlHelp, max: 2048, format: "youtube" },
    { kind: "text", key: "title", label: F.videoTitle, help: F.videoTitleHelp, max: 120 },
    ...frameFields("narrow"),
  ],
  prepare: (p) => {
    const id = youtubeId(text(p.url) ?? "");
    return id ? { id, title: text(p.title) ?? "", frame: frameOf(p, "narrow") } : null;
  },
  render: (p, ctx) => (
    <BlockShell frame={p.frame}>
      <VideoFrame id={p.id} title={p.title} inert={ctx.editing} />
    </BlockShell>
  ),
});

export const Code = defineBlock({
  type: "CodeBlock",
  group: "text",
  icon: "code",
  fields: [
    { kind: "textarea", key: "code", label: F.code, max: 20000, rows: 10, code: true },
    { kind: "text", key: "title", label: F.codeTitle, help: F.codeTitleHelp, max: 80 },
    { kind: "text", key: "language", label: F.codeLanguage, help: F.codeLanguageHelp, max: 30 },
    ...frameFields("narrow"),
  ],
  prepare: (p) => {
    // Code keeps its own spacing: only empty lines at the start and end are dropped.
    const code = typeof p.code === "string" ? p.code.replace(/^\s*\n|\s+$/g, "") : "";
    return code ? { code, title: text(p.title), language: text(p.language), frame: frameOf(p, "narrow") } : null;
  },
  render: (p) => (
    <BlockShell frame={p.frame}>
      <CodeBlock code={p.code} title={p.title} language={p.language} />
    </BlockShell>
  ),
});

const galleryImages: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "images",
  label: F.galleryImages,
  max: 40,
  itemTitle: F.galleryImage,
  item: [
    { kind: "image", key: "image", label: F.image },
    { kind: "text", key: "caption", label: F.caption, max: 200 },
  ],
  empty: () => ({}),
};
const COLUMNS = [3, 2, 4, 5] as const;

export const GalleryBlock = defineBlock({
  type: "Gallery",
  group: "media",
  icon: "images",
  banded: true,
  fields: [
    { kind: "text", key: "eyebrow", label: F.eyebrow, max: 60 },
    { kind: "text", key: "title", label: F.title, max: 120 },
    { kind: "textarea", key: "description", label: F.description, max: 400 },
    galleryImages,
    { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.galleryLayouts) },
    { kind: "select", key: "columns", label: F.columns, options: COLUMNS.map((n) => ({ value: n, label: F.columnCount(n) })) },
    { kind: "select", key: "aspect", label: F.galleryAspect, help: F.galleryAspectHelp, options: options(F.galleryAspects) },
    { kind: "select", key: "gap", label: F.galleryGap, options: options(F.galleryGaps) },
    { kind: "toggle", key: "lightbox", label: F.galleryLightbox },
  ],
  defaults: () => ({ images: [{}, {}, {}], layout: "grid", columns: 3, aspect: "square", gap: "medium", lightbox: true }),
  prepare: (p) => {
    const images = completeItems(galleryImages, p.images).flatMap((i) => {
      const img = image(i.image);
      return img ? [{ ...img, caption: text(i.caption) }] : [];
    });
    if (images.length === 0) return null;
    return {
      eyebrow: text(p.eyebrow),
      title: text(p.title),
      description: text(p.description),
      images,
      layout: pick(p.layout, ["grid", "masonry"] as const, "grid"),
      columns: pick(p.columns, COLUMNS, 3),
      aspect: pick(p.aspect, ["square", "landscape", "portrait"] as const, "square"),
      gap: pick(p.gap, ["medium", "small", "large"] as const, "medium"),
      lightbox: p.lightbox !== false,
    };
  },
  render: (p, ctx) => <Gallery {...p} inert={ctx.editing} className={ctx.band} />,
  headings: (p) => (p.title ? [{ level: 2, text: p.title }] : []),
});
