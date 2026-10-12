"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { JSONContent } from "@tiptap/react";
import { ArrowDown, ArrowUp, Copy, GripVertical, ImageIcon, Plus, Trash2, Video } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { RichTextEditor } from "@/components/portal/editor/RichTextEditor";
import { entryFor } from "@/lib/builder/catalog";
import { youtubeEmbedSrc, youtubeId, type AnyBlock, type ColumnsBlock, type LeafBlock, type SectionBlock } from "@/lib/builder/model";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { templatesFor } from "@/lib/builder/templates";
import { accepts, ROOT, slotKey, type Slot } from "@/lib/builder/tree";
import { cn } from "@/utils/cn";
import { SiteBlockView } from "./SiteBlockView";
import { useBuilder } from "./store";

const T = BUILDER_TEXT.ui;

const GRID: Record<ColumnsBlock["props"]["layout"], string> = {
  "1-1": "md:grid-cols-2",
  "2-1": "md:grid-cols-[2fr_1fr]",
  "1-2": "md:grid-cols-[1fr_2fr]",
  "1-1-1": "md:grid-cols-3",
};

/** Drop target id. `onDragEnd` in BuilderApp reads the slot and index from the droppable's data. */
export const dropId = (slot: Slot, index: number) => `drop:${slotKey(slot)}:${index}`;
/** Drag source id for a block already on the page. */
export const moveId = (id: string) => `move:${id}`;

/** A thin line between blocks that becomes a drop target while a block that fits here is dragged. */
function DropZone({ slot, index, empty }: { slot: Slot; index: number; empty?: string }) {
  const dragType = useBuilder((s) => s.dragType);
  const canEdit = useBuilder((s) => s.canEdit);
  const active = dragType !== null && accepts(slot, dragType as AnyBlock["type"]);
  const { setNodeRef, isOver } = useDroppable({ id: dropId(slot, index), data: { slot, index }, disabled: !active });
  if (empty && canEdit) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-20 items-center justify-center rounded-xl border-2 border-dashed px-4 text-center text-sm text-muted-foreground transition-colors",
          isOver ? "border-accent bg-accent/12" : active ? "border-accent/60" : "border-border-strong",
        )}
      >
        {empty}
      </div>
    );
  }
  if (!active) return null;
  return (
    <div ref={setNodeRef} className="relative h-3" aria-hidden="true">
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
  const problems = useBuilder((s) => s.problems[block.id]);
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
        <div className={cn("absolute -top-3.5 start-2 z-20 flex items-center gap-0.5 rounded-md bg-accent px-1 text-xs font-semibold text-accent-foreground shadow-md", block.type === "site" && "top-2")}>
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
        <ul className="relative z-10 m-2 list-disc rounded-lg border border-danger/40 bg-danger-surface py-2 pe-3 ps-7 text-sm text-danger">
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
  return (
    <section className={cn(kind === "page" ? "py-10 sm:py-14" : "py-2")}>
      <div className={kind === "page" ? "container-site" : undefined}>
        <div className={cn("article [&>div:first-child>*]:mt-0", block.props.width === "text" ? "mx-auto" : "max-w-none")}>
          <SlotList slot={{ kind: "section", id: block.id }} blocks={block.children} empty={T.canvas.emptySection} />
        </div>
      </div>
    </section>
  );
}

function ColumnsView({ block }: { block: ColumnsBlock }) {
  return (
    <div className={cn("mt-8 grid gap-6", GRID[block.props.layout])}>
      {block.columns.map((col, i) => (
        <div key={col.id} className="min-w-0 rounded-lg p-1">
          <SlotList slot={{ kind: "column", id: block.id, index: i }} blocks={col.children} empty={T.canvas.emptyColumn} />
        </div>
      ))}
    </div>
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
    <div className="mt-4">
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
    </div>
  );
}

function Placeholder({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="mt-6 flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong p-4 text-center text-sm text-muted-foreground">
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
        <figure className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.props.src} alt={block.props.alt} className="h-auto w-full rounded-xl border border-border" />
          {block.props.caption && <figcaption className="t-small mt-2 text-muted-foreground">{block.props.caption}</figcaption>}
        </figure>
      ) : (
        <Placeholder icon={<ImageIcon className="size-6" aria-hidden="true" />} text={T.canvas.imageEmpty} />
      );
    case "video": {
      const id = youtubeId(block.props.url);
      return id ? (
        <div data-youtube-video="" className="pointer-events-none">
          <iframe src={youtubeEmbedSrc(id)} title={block.props.title || entryFor(block)?.label} loading="lazy" tabIndex={-1} />
        </div>
      ) : (
        <Placeholder icon={<Video className="size-6" aria-hidden="true" />} text={T.canvas.videoEmpty} />
      );
    }
  }
}

function BlockBody({ block, selected }: { block: AnyBlock; selected: boolean }) {
  if (block.type === "section") return <SectionView block={block} />;
  if (block.type === "columns") return <ColumnsView block={block} />;
  if (block.type === "site") return <SiteBlockView block={block} />;
  return <LeafView block={block} selected={selected} />;
}

/** The post title and summary as the article shows them; a page without a hero shows its title as the headline. */
function PageHeading() {
  const kind = useBuilder((s) => s.kind);
  const meta = useBuilder((s) => s.meta);
  const canEdit = useBuilder((s) => s.canEdit);
  const setMeta = useBuilder((s) => s.setMeta);
  const hasHero = useBuilder((s) => s.doc.blocks[0]?.type === "site" && s.doc.blocks[0].section.type === "ProductHero");
  if (kind === "page" && hasHero) return null;
  return (
    <header className={cn("px-4 pt-10 sm:px-8", kind === "page" && "border-b border-border pb-10 text-center")}>
      <div className={cn("mx-auto", kind === "post" ? "max-w-3xl" : "max-w-4xl")}>
        <h1 className="t-h1 text-foreground">
          {canEdit ? (
            <textarea
              value={meta.title}
              onChange={(e) => setMeta({ title: e.target.value.replace(/\n/g, " ") })}
              placeholder={T.newTitle[kind]}
              aria-label={T.page.title}
              rows={1}
              maxLength={200}
              className={cn("w-full resize-none bg-transparent outline-none [field-sizing:content] [font:inherit] [letter-spacing:inherit] placeholder:text-subtle-foreground", kind === "page" && "text-center")}
            />
          ) : (
            meta.title
          )}
        </h1>
        {meta.excerpt && <p className="t-lead mt-4">{meta.excerpt}</p>}
      </div>
    </header>
  );
}

/** On an empty page: pick a starting layout, or start blank. */
function TemplatePicker({ onBlank }: { onBlank: () => void }) {
  const kind = useBuilder((s) => s.kind);
  const applyTemplate = useBuilder((s) => s.applyTemplate);
  const TT = BUILDER_TEXT.templates;
  return (
    <section aria-labelledby="builder-templates" className="mx-4 my-6 rounded-xl border border-border bg-card p-5 sm:mx-8">
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
          <button type="button" onClick={(e) => {
              e.stopPropagation();
              onBlank();
            }} className="flex h-full w-full flex-col items-start gap-1 rounded-xl border border-dashed border-border-strong p-4 text-start hover:bg-muted">
            <span className="text-sm font-semibold text-foreground">{TT.blank.label}</span>
            <span className="text-xs text-muted-foreground">{TT.blank.hint}</span>
          </button>
        </li>
      </ul>
    </section>
  );
}

export function Canvas() {
  const kind = useBuilder((s) => s.kind);
  const blocks = useBuilder((s) => s.doc.blocks);
  const canEdit = useBuilder((s) => s.canEdit);
  const select = useBuilder((s) => s.select);
  const set = useBuilder((s) => s.set);
  const addBlock = useBuilder((s) => s.addBlock);
  const [blank, setBlank] = useState(false);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-muted/50 p-3 sm:p-6" onClick={() => select(null)} onMouseLeave={() => set({ hoverId: null })}>
      {/* look-luxe: the same page look as the public layout (app/[locale]/(marketing)/layout.tsx), so sections match. */}
      <div role="region" aria-label={T.canvas.label} className={cn("look-luxe mx-auto min-h-full rounded-xl border border-border bg-background pb-10 shadow-sm", kind === "post" ? "max-w-4xl" : "max-w-[90rem]")}>
        {!canEdit && <p className="rounded-t-xl border-b border-warning/40 bg-warning-surface px-4 py-2 text-sm text-foreground">{T.readOnly}</p>}
        <PageHeading />
        <div className={cn(kind === "post" ? "mx-auto max-w-3xl px-4 pt-6 sm:px-8" : "px-0 pt-2")}>
          {blocks.length === 0 && canEdit && !blank ? <TemplatePicker onBlank={() => setBlank(true)} /> : <SlotList slot={ROOT} blocks={blocks} empty={T.canvas.empty} />}
          {canEdit && (
            <div className="mt-6 flex justify-center">
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
        </div>
      </div>
    </div>
  );
}
