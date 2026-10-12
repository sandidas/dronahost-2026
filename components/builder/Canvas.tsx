"use client";

import { DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import type { JSONContent } from "@tiptap/react";
import { ArrowDown, ArrowUp, Copy, GripVertical, ImageIcon, Plus, Trash2, Video } from "lucide-react";
import { createContext, useContext, useId, useMemo, useState, type ReactNode } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { RichTextEditor } from "@/components/portal/editor/RichTextEditor";
import { entryFor } from "@/lib/builder/catalog";
import ArticleLayout from "@/components/blog/ArticleLayout";
import CenteredHero from "@/components/sections/CenteredHero";
import { youtubeId, type AnyBlock, type ColumnsBlock, type LeafBlock, type SectionBlock } from "@/lib/builder/model";
import { prepareSection } from "@/lib/builder/sections";
import { docToc, readingMinutes } from "@/lib/builder/text";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { templatesFor } from "@/lib/builder/templates";
import { accepts, ROOT, slotKey, type Slot } from "@/lib/builder/tree";
import { cn } from "@/utils/cn";
import { ColumnsGrid, COLUMN_CELL, Figure, pageBands, POST_SECTION_GAP, SectionShell, VideoFrame } from "./layout";
import { CanvasFrame } from "./CanvasFrame";
import { SiteBlockView } from "./SiteBlockView";
import { useBuilder, useProblems, type Device } from "./store";

const T = BUILDER_TEXT.ui;

/** Page-wide facts every block needs: post or page, and which root blocks get the muted band. */
const CanvasContext = createContext<{ bands: Map<string, string>; firstId: string | undefined }>({ bands: new Map(), firstId: undefined });

/** Drop target id. `onDragEnd` in BuilderApp reads the slot and index from the droppable's data. */
export const dropId = (slot: Slot, index: number) => `drop:${slotKey(slot)}:${index}`;
/** Drag source id for a block already on the page. */
export const moveId = (id: string) => `move:${id}`;

/** The MIME type of a block dragged from the Add panel (native drag and drop, which crosses into the canvas frame). */
export const PALETTE_MIME = "application/x-dronahost-block";

/**
 * A thin line between blocks that becomes a drop target while a block that fits here is dragged: blocks moved on the
 * canvas (dnd-kit) and new blocks dragged from the Add panel (native drag and drop).
 */
function DropZone({ slot, index, empty }: { slot: Slot; index: number; empty?: string }) {
  const dragType = useBuilder((s) => s.dragType);
  const canEdit = useBuilder((s) => s.canEdit);
  const addBlock = useBuilder((s) => s.addBlock);
  const set = useBuilder((s) => s.set);
  const [nativeOver, setNativeOver] = useState(false);
  const active = dragType !== null && accepts(slot, dragType as AnyBlock["type"]);
  const { setNodeRef, isOver: dndOver } = useDroppable({ id: dropId(slot, index), data: { slot, index }, disabled: !active });
  const isOver = dndOver || nativeOver;
  const native = {
    onDragOver: (e: React.DragEvent) => {
      if (!active || !e.dataTransfer.types.includes(PALETTE_MIME)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      if (!nativeOver) setNativeOver(true);
    },
    onDragLeave: () => setNativeOver(false),
    onDrop: (e: React.DragEvent) => {
      const type = e.dataTransfer.getData(PALETTE_MIME);
      setNativeOver(false);
      if (!active || !type) return;
      e.preventDefault();
      set({ dragType: null });
      addBlock(type, { slot, index });
    },
  };
  if (empty && canEdit) {
    return (
      <div
        ref={setNodeRef}
        {...native}
        className={cn(
          "builder-ui flex min-h-20 items-center justify-center rounded-xl border-2 border-dashed px-4 text-center text-sm text-muted-foreground transition-colors",
          isOver ? "border-accent bg-accent/12" : active ? "border-accent/60" : "border-border-strong",
        )}
      >
        {empty}
      </div>
    );
  }
  if (!active) return null;
  return (
    <div ref={setNodeRef} {...native} className="relative h-6" aria-hidden="true">
      <div className={cn("absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full transition-colors", isOver ? "bg-accent" : "bg-accent/25")} />
    </div>
  );
}

function SlotList({ slot, blocks, empty }: { slot: Slot; blocks: readonly AnyBlock[]; empty: string }) {
  if (blocks.length === 0) return <DropZone slot={slot} index={0} empty={empty} />;
  return (
    <>
      <DropZone slot={slot} index={0} />
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockFrame block={block} />
          <DropZone slot={slot} index={i + 1} />
        </div>
      ))}
    </>
  );
}

function ToolButton({ label, onClick, children, danger }: { label: string; onClick: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn("inline-flex size-7 items-center justify-center rounded-md hover:bg-accent-hover", danger && "hover:bg-danger hover:text-accent-foreground")}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

/** Selection outline, the label chip with the block toolbar, and publish problems under the block. */
function BlockFrame({ block }: { block: AnyBlock }) {
  const selected = useBuilder((s) => s.selectedId === block.id);
  const hovered = useBuilder((s) => s.hoverId === block.id);
  const problems = useProblems()[block.id];
  const canEdit = useBuilder((s) => s.canEdit);
  const preview = useBuilder((s) => s.preview);
  const select = useBuilder((s) => s.select);
  const set = useBuilder((s) => s.set);
  const nudge = useBuilder((s) => s.nudge);
  const duplicate = useBuilder((s) => s.duplicate);
  const remove = useBuilder((s) => s.remove);
  const entry = entryFor(block);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: moveId(block.id), data: { source: "canvas", id: block.id, blockType: block.type, label: entry?.label }, disabled: !canEdit });
  const showChip = selected || hovered;

  return (
    <div
      data-block-id={block.id}
      onClick={(e) => {
        e.stopPropagation();
        select(block.id);
      }}
      onMouseOver={(e) => {
        e.stopPropagation();
        if (!hovered) set({ hoverId: block.id });
      }}
      className={cn(
        "relative rounded-sm outline-offset-2 transition-[outline-color]",
        selected ? "outline-2 outline-accent outline" : hovered ? "outline outline-1 outline-accent/50" : "outline outline-1 outline-transparent",
        problems && !selected && "outline-2 outline-danger",
        isDragging && "opacity-40",
        preview && "outline-none",
      )}
    >
      {showChip && (
        <div className={cn("builder-ui absolute -top-3.5 start-2 z-20 flex items-center gap-0.5 rounded-md bg-accent px-1 text-xs font-semibold text-accent-foreground shadow-md", block.type === "site" && "top-2")}>
          {canEdit && (
            <button type="button" ref={setNodeRef} {...attributes} {...listeners} className="inline-flex size-7 cursor-grab items-center justify-center rounded-md hover:bg-accent-hover active:cursor-grabbing" title={T.toolbar.drag}>
              <GripVertical className="size-4" aria-hidden="true" />
              <span className="sr-only">{`${T.toolbar.drag}: ${entry?.label}`}</span>
            </button>
          )}
          <span className="px-1.5 py-1">{entry?.label}</span>
          {canEdit && selected && (
            <>
              <ToolButton label={T.toolbar.up} onClick={() => nudge(block.id, -1)}>
                <ArrowUp className="size-3.5" aria-hidden="true" />
              </ToolButton>
              <ToolButton label={T.toolbar.down} onClick={() => nudge(block.id, 1)}>
                <ArrowDown className="size-3.5" aria-hidden="true" />
              </ToolButton>
              <ToolButton label={T.toolbar.duplicate} onClick={() => duplicate(block.id)}>
                <Copy className="size-3.5" aria-hidden="true" />
              </ToolButton>
              <ToolButton label={T.toolbar.remove} onClick={() => remove(block.id)} danger>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </ToolButton>
            </>
          )}
        </div>
      )}
      <BlockBody block={block} selected={selected} />
      {problems && (
        <ul className="builder-ui relative z-10 m-2 list-disc rounded-lg border border-danger/40 bg-danger-surface py-2 pe-3 ps-7 text-sm text-danger">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SectionView({ block }: { block: SectionBlock }) {
  const kind = useBuilder((s) => s.kind);
  const { bands, firstId } = useContext(CanvasContext);
  return (
    <SectionShell kind={kind} width={block.props.width} band={bands.get(block.id)} first={firstId === block.id}>
      <SlotList slot={{ kind: "section", id: block.id }} blocks={block.children} empty={T.canvas.emptySection} />
    </SectionShell>
  );
}

function ColumnsView({ block }: { block: ColumnsBlock }) {
  return (
    <ColumnsGrid layout={block.props.layout}>
      {block.columns.map((col, i) => (
        <div key={col.id} className={COLUMN_CELL}>
          <SlotList slot={{ kind: "column", id: block.id, index: i }} blocks={col.children} empty={T.canvas.emptyColumn} />
        </div>
      ))}
    </ColumnsGrid>
  );
}

function HeadingView({ block }: { block: Extract<LeafBlock, { type: "heading" }> }) {
  const canEdit = useBuilder((s) => s.canEdit);
  const update = useBuilder((s) => s.update);
  const Tag = `h${block.props.level}` as "h2" | "h3" | "h4";
  return (
    <Tag>
      {canEdit ? (
        <input
          value={block.props.text}
          onChange={(e) => update(block.id, (b) => ({ ...b, props: { ...(b as typeof block).props, text: e.target.value } }) as AnyBlock)}
          placeholder={T.canvas.headingPlaceholder}
          aria-label={`${entryFor(block)?.label} ${block.props.level}`}
          maxLength={200}
          className="w-full bg-transparent text-inherit outline-none [font:inherit] [letter-spacing:inherit] placeholder:text-subtle-foreground"
        />
      ) : (
        block.props.text
      )}
    </Tag>
  );
}

function RichTextView({ block, selected }: { block: Extract<LeafBlock, { type: "richtext" }>; selected: boolean }) {
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const update = useBuilder((s) => s.update);
  const rev = useBuilder((s) => s.historyRev);
  const labelId = useId();
  return (
    <>
      <span id={labelId} className="sr-only">
        {entryFor(block)?.label}
      </span>
      <RichTextEditor
        key={rev}
        variant="inline"
        toolbar={selected}
        reportInitial={false}
        initialContent={block.props.content as JSONContent | string}
        editable={canEdit}
        uploadEnabled={uploadEnabled}
        labelledBy={labelId}
        onChange={(json) => update(block.id, (b) => ({ ...b, props: { content: json } }) as AnyBlock)}
      />
    </>
  );
}

/** Only on the canvas: where an image or video will go once its address is set. The public page shows nothing here. */
function Placeholder({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="builder-ui mt-6 flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong p-4 text-center text-sm text-muted-foreground">
      {icon}
      {text}
    </div>
  );
}

function LeafView({ block, selected }: { block: LeafBlock; selected: boolean }) {
  switch (block.type) {
    case "heading":
      return <HeadingView block={block} />;
    case "richtext":
      return <RichTextView block={block} selected={selected} />;
    case "image":
      return isSafeImageSrc(block.props.src) ? (
        <Figure src={block.props.src} alt={block.props.alt} caption={block.props.caption} />
      ) : (
        <Placeholder icon={<ImageIcon className="size-6" aria-hidden="true" />} text={T.canvas.imageEmpty} />
      );
    case "video": {
      const id = youtubeId(block.props.url);
      return id ? <VideoFrame id={id} title={block.props.title} inert /> : <Placeholder icon={<Video className="size-6" aria-hidden="true" />} text={T.canvas.videoEmpty} />;
    }
  }
}

function BlockBody({ block, selected }: { block: AnyBlock; selected: boolean }) {
  const kind = useBuilder((s) => s.kind);
  const { bands } = useContext(CanvasContext);
  if (block.type === "section") return <SectionView block={block} />;
  if (block.type === "columns") return <ColumnsView block={block} />;
  if (block.type === "site") {
    const view = <SiteBlockView block={block} className={bands.get(block.id)} inPost={kind === "post"} />;
    return kind === "post" ? <div className={POST_SECTION_GAP}>{view}</div> : view;
  }
  return <LeafView block={block} selected={selected} />;
}

/** On an empty page: pick a starting layout, or start blank. */
function TemplatePicker({ onBlank }: { onBlank: () => void }) {
  const kind = useBuilder((s) => s.kind);
  const applyTemplate = useBuilder((s) => s.applyTemplate);
  const TT = BUILDER_TEXT.templates;
  return (
    <section aria-labelledby="builder-templates" className="builder-ui mx-4 my-6 rounded-xl border border-border bg-card p-5 sm:mx-8">
      <h2 id="builder-templates" className="text-base font-semibold text-foreground">
        {TT.title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{TT.intro}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {templatesFor(kind).map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                applyTemplate(t.blocks());
              }}
              className="flex h-full w-full flex-col items-start gap-1 rounded-xl border border-border bg-background p-4 text-start hover:border-accent hover:bg-muted"
            >
              <span className="text-sm font-semibold text-foreground">{t.label}</span>
              <span className="text-xs text-muted-foreground">{t.hint}</span>
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBlank();
            }}
            className="flex h-full w-full flex-col items-start gap-1 rounded-xl border border-dashed border-border-strong p-4 text-start hover:bg-muted"
          >
            <span className="text-sm font-semibold text-foreground">{TT.blank.label}</span>
            <span className="text-xs text-muted-foreground">{TT.blank.hint}</span>
          </button>
        </li>
      </ul>
    </section>
  );
}

/** The post title, edited in place of the article's H1. */
function TitleInput() {
  const kind = useBuilder((s) => s.kind);
  const title = useBuilder((s) => s.meta.title);
  const canEdit = useBuilder((s) => s.canEdit);
  const setMeta = useBuilder((s) => s.setMeta);
  if (!canEdit) return <>{title}</>;
  return (
    <textarea
      value={title}
      onChange={(e) => setMeta({ title: e.target.value.replace(/\n/g, " ") })}
      onClick={(e) => e.stopPropagation()}
      placeholder={T.newTitle[kind]}
      aria-label={T.page.title}
      rows={1}
      maxLength={200}
      className="w-full resize-none bg-transparent outline-none [field-sizing:content] [font:inherit] [letter-spacing:inherit] placeholder:text-subtle-foreground"
    />
  );
}

function RootBlocks() {
  const blocks = useBuilder((s) => s.doc.blocks);
  const canEdit = useBuilder((s) => s.canEdit);
  const select = useBuilder((s) => s.select);
  const addBlock = useBuilder((s) => s.addBlock);
  const [blank, setBlank] = useState(false);
  if (blocks.length === 0 && canEdit && !blank) return <TemplatePicker onBlank={() => setBlank(true)} />;
  return (
    <>
      <SlotList slot={ROOT} blocks={blocks} empty={T.canvas.empty} />
      {canEdit && (
        <div className="builder-ui my-6 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              select(null);
              addBlock("section", { slot: ROOT, index: blocks.length });
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            {T.canvas.addSection}
          </button>
        </div>
      )}
    </>
  );
}

/**
 * The page as visitors will see it, with editing on top: posts inside the real article layout (title, meta line,
 * featured image, contents, author), pages with the same title hero and bands as the public page.
 */
/** Page widths the canvas lays out at; the frame is scaled to fit between the panels. */
export const DEVICE_WIDTH: Record<Device, number> = { desktop: 1280, tablet: 820, phone: 390 };

export function Canvas({ onKeyDown }: { onKeyDown?: (e: KeyboardEvent) => void }) {
  const kind = useBuilder((s) => s.kind);
  const doc = useBuilder((s) => s.doc);
  const meta = useBuilder((s) => s.meta);
  const canEdit = useBuilder((s) => s.canEdit);
  const select = useBuilder((s) => s.select);
  const set = useBuilder((s) => s.set);
  const actorName = useBuilder((s) => s.actorName);
  const bands = useMemo(() => pageBands(doc, kind), [doc, kind]);
  const first = doc.blocks[0];
  const heroShows = kind === "page" && first?.type === "site" && first.section.type === "Hero" && prepareSection("Hero", first.section.content) !== null;
  const dates = useBuilder((s) => s.dates);
  const device = useBuilder((s) => s.device);
  const dragLabel = useBuilder((s) => s.dragLabel);
  return (
    <CanvasFrame width={DEVICE_WIDTH[device]} onKeyDown={onKeyDown}>
      {/* look-luxe: the same page look as the public layout (app/[locale]/(marketing)/layout.tsx), so sections match. */}
      <div role="region" aria-label={T.canvas.label} className="look-luxe min-h-screen bg-background text-foreground" onClick={() => select(null)} onMouseLeave={() => set({ hoverId: null })}>
        {!canEdit && <p className="border-b border-warning/40 bg-warning-surface px-4 py-2 text-sm text-foreground">{T.readOnly}</p>}
        <CanvasContext.Provider value={{ bands, firstId: first?.id }}>
          {kind === "post" ? (
            <ArticleLayout
              inertChrome
              titleSlot={<TitleInput />}
              post={{
                slug: meta.slug || "post",
                title: meta.title || T.newTitle.post,
                excerpt: meta.excerpt,
                html: "",
                body: <RootBlocks />,
                toc: docToc(doc),
                published: dates.published,
                modified: dates.modified,
                category: null,
                author: { name: actorName, bio: null, avatar: null },
                image: isSafeImageSrc(meta.coverImage) ? { url: meta.coverImage, alt: meta.coverImageAlt, width: 1200, height: 630 } : null,
                readingMinutes: readingMinutes(doc),
              }}
            />
          ) : (
            <>
              {!heroShows && <CenteredHero title={meta.title || T.newTitle.page} description={meta.excerpt} />}
              <RootBlocks />
            </>
          )}
        </CanvasContext.Provider>
        {/* Inside the frame, so the dragged chip follows the pointer in the frame's own coordinates. */}
        <DragOverlay dropAnimation={null}>{dragLabel ? <div className="inline-flex rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-lg">{dragLabel}</div> : null}</DragOverlay>
      </div>
    </CanvasFrame>
  );
}
