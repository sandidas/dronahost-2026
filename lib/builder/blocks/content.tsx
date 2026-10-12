import { BlockShell, Figure, Html, SectionFrame, VideoFrame } from "@/components/builder/layout";
import Gallery from "@/components/sections/Gallery";
import { BUILDER_TEXT } from "@/content/portal-strings";
import type { TiptapNode } from "@/lib/editor/schema";
import { completeItems, image, pick, richtext, text, type Field } from "../fields";
import { youtubeId } from "../model";
import { defineBlock, type Heading } from "./types";

/** Text and media: written text, a single image, a video and a photo gallery. */

const F = BUILDER_TEXT.fields;
const options = <K extends string>(labels: Record<K, string>) => (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));
const WIDTHS = ["text", "wide"] as const;
const widthField: Field = { kind: "select", key: "width", label: F.width, help: F.widthHelp, options: options(F.widths) };

function tiptapHeadings(node: TiptapNode, out: Heading[]): Heading[] {
  if (node.type === "heading") out.push({ level: Number(node.attrs?.level ?? 2), text: (node.content ?? []).map((c) => c.text ?? "").join("") });
  for (const child of node.content ?? []) tiptapHeadings(child, out);
  return out;
}

export const Text = defineBlock({
  type: "Text",
  group: "text",
  icon: "pilcrow",
  fields: [{ kind: "richtext", key: "content", label: F.text, required: true }, widthField],
  defaults: () => ({ content: { type: "doc", content: [{ type: "paragraph" }] }, width: "text" }),
  prepare: (p) => {
    const content = richtext(p.content);
    return content ? { content, width: pick(p.width, WIDTHS, "text") } : null;
  },
  render: (p, ctx) => (
    <BlockShell ctx={ctx} width={p.width} article>
      {ctx.richHtml && <Html html={ctx.richHtml(p.content)} />}
    </BlockShell>
  ),
  headings: (p) =>
    typeof p.content === "string"
      ? [...p.content.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: m[2]!.replace(/<[^>]+>/g, "") }))
      : tiptapHeadings(p.content, []),
});

export const ImageBlock = defineBlock({
  type: "Image",
  group: "media",
  icon: "image",
  fields: [{ kind: "image", key: "image", label: F.image, required: true }, { kind: "text", key: "caption", label: F.caption, max: 300 }, widthField],
  defaults: () => ({ width: "text" }),
  prepare: (p) => {
    const img = image(p.image);
    return img ? { ...img, caption: text(p.caption), width: pick(p.width, WIDTHS, "text") } : null;
  },
  render: (p, ctx) => (
    <BlockShell ctx={ctx} width={p.width}>
      <Figure src={p.src} alt={p.alt} caption={p.caption} />
    </BlockShell>
  ),
});

export const Video = defineBlock({
  type: "Video",
  group: "media",
  icon: "video",
  fields: [
    { kind: "text", key: "url", label: F.videoUrl, help: F.videoUrlHelp, max: 2048, format: "youtube", required: true },
    { kind: "text", key: "title", label: F.videoTitle, help: F.videoTitleHelp, max: 120, required: true },
    widthField,
  ],
  defaults: () => ({ width: "text" }),
  prepare: (p) => {
    const id = youtubeId(text(p.url) ?? "");
    return id ? { id, title: text(p.title) ?? "", width: pick(p.width, WIDTHS, "text") } : null;
  },
  render: (p, ctx) => (
    <BlockShell ctx={ctx} width={p.width}>
      <VideoFrame id={p.id} title={p.title} inert={ctx.editing} />
    </BlockShell>
  ),
});

const galleryImages: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "images",
  label: F.galleryImages,
  max: 40,
  itemTitle: F.galleryImage,
  required: true,
  item: [
    { kind: "image", key: "image", label: F.image, required: true },
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
    { kind: "text", key: "title", label: F.titleOptional, max: 120 },
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
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      {/* A post's text column is narrow: at most three columns there. */}
      <Gallery {...p} columns={ctx.kind === "post" ? (Math.min(p.columns, 3) as 2 | 3) : p.columns} inert={ctx.editing} className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => (p.title ? [{ level: 2, text: p.title }] : []),
});
