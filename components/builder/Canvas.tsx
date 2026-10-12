"use client";

import { DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import BuilderPost from "@/components/blog/BuilderPost";
import { blockDef, blockName } from "@/lib/builder/blocks";
import { h1Block, pageBands, pageFrame } from "@/lib/builder/doc";
import { fieldProblems } from "@/lib/builder/fields";
import type { Block } from "@/lib/builder/model";
import { templatesFor } from "@/lib/builder/templates";
import { cn } from "@/utils/cn";
import { CanvasFrame } from "./CanvasFrame";
import { BLOCK_ICONS } from "./icons";
import { INLINE } from "./inline";
import { useBuilder, useProblems, type Device } from "./store";

const T = BUILDER_TEXT.ui;

/** Worked out once for the whole page: which blocks get the light band, and which block holds the page's H1. */
type PageLook = { bands: Map<string, string>; h1Id: string | null };
const LookContext = createContext<PageLook>({ bands: new Map(), h1Id: null });

/** Drop target id. `onDragEnd` in BuilderApp reads the index from the droppable's data. */
export const dropId = (index: number) => `drop:${index}`;
/** Drag source id for a block already on the page. */
export const moveId = (id: string) => `move:${id}`;

/** The MIME type of a block dragged from the Add panel (native drag and drop, which crosses into the canvas frame). */
export const PALETTE_MIME = "application/x-dronahost-block";

/**
 * A thin line between blocks that becomes a drop target while a block that fits here is dragged: blocks moved on the
 * canvas (dnd-kit) and new blocks dragged from the Add panel (native drag and drop).
 */
function DropZone({ index, empty }: { index: number; empty?: string }) {
  const dragType = useBuilder((s) => s.dragType);
  const canEdit = useBuilder((s) => s.canEdit);
  const addBlock = useBuilder((s) => s.addBlock);
  const set = useBuilder((s) => s.set);
  const [nativeOver, setNativeOver] = useState(false);
  const active = dragType !== null;
  const { setNodeRef, isOver: dndOver } = useDroppable({ id: dropId(index), data: { index }, disabled: !active });
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
      addBlock(type, index);
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

function BlockList({ blocks, empty }: { blocks: readonly Block[]; empty: string }) {
  if (blocks.length === 0) return <DropZone index={0} empty={empty} />;
  return (
    <>
      <DropZone index={0} />
      {blocks.map((block, i) => (
        <div key={block.id}>
          <BlockFrame block={block} />
          <DropZone index={i + 1} />
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
function BlockFrame({ block }: { block: Block }) {
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
  const entry = blockName(block.type);
  const inline = Boolean(INLINE[block.type]);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: moveId(block.id), data: { source: "canvas", id: block.id, blockType: block.type, label: entry.label }, disabled: !canEdit });
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
        <div className={cn("builder-ui absolute start-2 z-20 flex items-center gap-0.5 rounded-md bg-accent px-1 text-xs font-semibold text-accent-foreground shadow-md", inline ? "-top-3.5" : "top-2")}>
          {canEdit && (
            <button type="button" ref={setNodeRef} {...attributes} {...listeners} className="inline-flex size-7 cursor-grab items-center justify-center rounded-md hover:bg-accent-hover active:cursor-grabbing" title={T.toolbar.drag}>
              <GripVertical className="size-4" aria-hidden="true" />
              <span className="sr-only">{`${T.toolbar.drag}: ${entry.label}`}</span>
            </button>
          )}
          <span className="px-1.5 py-1">{entry.label}</span>
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

/**
 * A block drawn by its own definition, exactly as on the public page. Its links and buttons do nothing while editing
 * (`inert`); a click selects the block. While it has nothing to show, the canvas says what to fill in (the public
 * page shows nothing there).
 */
function BlockView({ block }: { block: Block }) {
  const look = useContext(LookContext);
  const def = blockDef(block.type);
  const prepared = def?.prepare(block.props);
  if (def && prepared !== null && prepared !== undefined) {
    return (
      <div inert className="select-none">
        {def.render(prepared, { band: look.bands.get(block.id), h1: look.h1Id === block.id, editing: true })}
      </div>
    );
  }
  const Icon = def ? BLOCK_ICONS[def.icon] : undefined;
  const missing = def ? fieldProblems(def.fields, block.props) : [];
  return (
    <div className="builder-ui m-4 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-strong p-8 text-center text-sm text-muted-foreground">
      {Icon && <Icon className="size-6 text-link" aria-hidden="true" />}
      <p className="font-semibold text-foreground">{blockName(block.type).label}</p>
      <p>{T.block.fillIn}</p>
      {missing.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BlockBody({ block, selected }: { block: Block; selected: boolean }) {
  const Inline = INLINE[block.type];
  return Inline ? <Inline block={block} selected={selected} /> : <BlockView block={block} />;
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

/** The post title, edited in place of the post's H1. */
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
      className="w-full resize-none overflow-hidden bg-transparent outline-none [field-sizing:content] [font:inherit] [letter-spacing:inherit] placeholder:text-subtle-foreground"
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
      <BlockList blocks={blocks} empty={T.canvas.empty} />
      {canEdit && (
        <div className="builder-ui my-6 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              select(null);
              addBlock("Text", blocks.length);
            }}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            {T.canvas.addBlock}
          </button>
        </div>
      )}
    </>
  );
}

/** Page widths the canvas lays out at; the frame is scaled to fit between the panels. */
export const DEVICE_WIDTH: Record<Device, number> = { desktop: 1280, tablet: 820, phone: 390 };

/**
 * The page as visitors will see it, with editing on top. Posts and pages draw their blocks the same way: a post under
 * its title (edited in place), as the blog prints it, and a page with nothing of its own above the blocks.
 */
export function Canvas({ onKeyDown }: { onKeyDown?: (e: KeyboardEvent) => void }) {
  const kind = useBuilder((s) => s.kind);
  const doc = useBuilder((s) => s.doc);
  const canEdit = useBuilder((s) => s.canEdit);
  const select = useBuilder((s) => s.select);
  const set = useBuilder((s) => s.set);
  const look = useMemo<PageLook>(() => ({ bands: pageBands(doc), h1Id: h1Block(doc, kind)?.id ?? null }), [doc, kind]);
  const device = useBuilder((s) => s.device);
  const dragLabel = useBuilder((s) => s.dragLabel);
  // The same wrapper as the public page (space between sections from the Page tab).
  const blocks = (
    <div {...pageFrame(doc.settings)}>
      <RootBlocks />
    </div>
  );
  return (
    <CanvasFrame width={DEVICE_WIDTH[device]} onKeyDown={onKeyDown}>
      {/* look-luxe: the same page look as the public layout (app/[locale]/(marketing)/layout.tsx), so sections match. */}
      <div role="region" aria-label={T.canvas.label} className="look-luxe min-h-screen bg-background text-foreground" onClick={() => select(null)} onMouseLeave={() => set({ hoverId: null })}>
        {!canEdit && <p className="border-b border-warning/40 bg-warning-surface px-4 py-2 text-sm text-foreground">{T.readOnly}</p>}
        <LookContext.Provider value={look}>
          {kind === "post" ? (
            <BuilderPost title="" titleSlot={<TitleInput />}>
              {blocks}
            </BuilderPost>
          ) : (
            blocks
          )}
        </LookContext.Provider>
        {/* Inside the frame, so the dragged chip follows the pointer in the frame's own coordinates. */}
        <DragOverlay dropAnimation={null}>{dragLabel ? <div className="inline-flex rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-lg">{dragLabel}</div> : null}</DragOverlay>
      </div>
    </CanvasFrame>
  );
}
