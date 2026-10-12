"use client";

import { closestCenter, DndContext, DragOverlay, PointerSensor, pointerWithin, useSensor, useSensors, type CollisionDetection, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { PanelLeft, PanelRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { findBlock, slotKey, type Slot } from "@/lib/builder/tree";
import { cn } from "@/utils/cn";
import { Canvas } from "./Canvas";
import type { FeatureOption } from "./FieldControl";
import { Inspector } from "./Inspector";
import { LeftPanel } from "./LeftPanel";
import { PreviewFrame } from "./PreviewFrame";
import { BuilderContext, createBuilderStore, useBuilder, useBuilderApi, useHistory, type BuilderInit } from "./store";
import { iconButton, TopBar } from "./TopBar";
import { usePublishing } from "./use-publishing";

const T = BUILDER_TEXT.ui;
const AUTOSAVE_MS = 3000;

type DragData = { source: "palette"; type: string; blockType: string; label?: string } | { source: "canvas"; id: string; blockType: string; label?: string };

/** The drop zone under the pointer; when the pointer is between zones, the nearest one. */
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : closestCenter(args);
};

/** True while the person is typing in a field or the rich text editor, so shortcuts leave the keys alone. */
const typing = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

function Shell({ features, actorName, embedded }: { features: readonly FeatureOption[]; actorName: string; embedded: boolean }) {
  const api = useBuilderApi();
  const publishing = usePublishing(actorName);
  const { undo, redo } = useHistory();
  const preview = useBuilder((s) => s.preview);
  const message = useBuilder((s) => s.message);
  const mobilePanel = useBuilder((s) => s.mobilePanel);
  const problemCount = useBuilder((s) => Object.keys(s.problems).length);
  const set = useBuilder((s) => s.set);
  const [dragLabel, setDragLabel] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Autosave: drafts save a few seconds after the last change. A published page changes only when someone presses Update.
  const saveState = useBuilder((s) => s.saveState);
  const doc = useBuilder((s) => s.doc);
  const meta = useBuilder((s) => s.meta);
  const postId = useBuilder((s) => s.postId);
  const status = useBuilder((s) => s.status);
  useEffect(() => {
    if (saveState !== "dirty" || !postId || status !== "draft") return;
    const timer = setTimeout(() => void publishing.save(), AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [saveState, doc, meta, postId, status, publishing]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const s = api.getState().saveState;
      if (s === "dirty" || s === "error" || s === "saving") e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [api]);

  // Keyboard: Ctrl/Cmd+S save, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo, Ctrl/Cmd+D duplicate, Delete removes, Escape deselects.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const s = api.getState();
      if (mod && key === "s") {
        e.preventDefault();
        void publishing.save();
        return;
      }
      if (typing(e.target)) return;
      if (mod && key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && key === "y") {
        e.preventDefault();
        redo();
      } else if (mod && key === "d" && s.selectedId) {
        e.preventDefault();
        s.duplicate(s.selectedId);
      } else if ((key === "delete" || key === "backspace") && s.selectedId && s.canEdit) {
        e.preventDefault();
        s.remove(s.selectedId);
      } else if (key === "escape") {
        s.select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, publishing, undo, redo]);

  const onDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current as DragData | undefined;
    set({ dragType: data?.blockType ?? null, hoverId: null });
    setDragLabel(data?.label ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    set({ dragType: null });
    setDragLabel(null);
    const data = e.active.data.current as DragData | undefined;
    const target = e.over?.data.current as { slot: Slot; index: number } | undefined;
    if (!data || !target) return;
    const s = api.getState();
    if (data.source === "palette") {
      s.addBlock(data.type, target);
      return;
    }
    // The index is read after the block leaves its slot, so a move down the same slot lands one place earlier.
    const from = findBlock(s.doc, data.id);
    const sameSlot = from && slotKey(from.slot) === slotKey(target.slot);
    s.move(data.id, target.slot, sameSlot && from.index < target.index ? target.index - 1 : target.index);
    s.select(data.id);
  };

  return (
    <div className={cn("flex flex-col bg-background", embedded ? "relative h-[46rem] overflow-hidden rounded-xl border border-border" : "fixed inset-0 z-50")}>
      <TopBar onSave={() => void publishing.save()} onPublish={() => void publishing.setPublished(true)} problemCount={problemCount} />
      {message && (
        <div role={message.kind === "error" ? "alert" : "status"} className={cn("flex items-center gap-3 border-b px-4 py-2 text-sm", message.kind === "error" ? "border-danger/40 bg-danger-surface text-danger" : "border-success/40 bg-success-surface text-success")}>
          <span className="flex-1">{message.text}</span>
          <button type="button" className={cn(iconButton, "size-8")} onClick={() => set({ message: null })}>
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">{T.close}</span>
          </button>
        </div>
      )}
      <DndContext id="page-builder" sensors={sensors} collisionDetection={collision} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => set({ dragType: null })}>
        <div className="relative flex min-h-0 flex-1">
          {!preview && (
            <div className={cn("absolute inset-y-0 start-0 z-30 shadow-xl lg:static lg:z-auto lg:flex lg:shadow-none", mobilePanel === "left" ? "flex" : "hidden")}>
              <LeftPanel />
            </div>
          )}
          {preview ? <PreviewFrame /> : <Canvas />}
          {!preview && (
            <div className={cn("absolute inset-y-0 end-0 z-30 shadow-xl lg:static lg:z-auto lg:flex lg:shadow-none", mobilePanel === "right" ? "flex" : "hidden")}>
              <Inspector features={features} publishing={publishing} />
            </div>
          )}
          {!preview && (
            <div className="absolute bottom-3 start-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full border border-border bg-card p-1 shadow-lg lg:hidden">
              <button type="button" aria-pressed={mobilePanel === "left"} className={iconButton} onClick={() => set({ mobilePanel: mobilePanel === "left" ? null : "left" })} title={T.left.label}>
                <PanelLeft className="size-4" aria-hidden="true" />
                <span className="sr-only">{T.left.label}</span>
              </button>
              <button type="button" aria-pressed={mobilePanel === "right"} className={iconButton} onClick={() => set({ mobilePanel: mobilePanel === "right" ? null : "right" })} title={T.right.label}>
                <PanelRight className="size-4" aria-hidden="true" />
                <span className="sr-only">{T.right.label}</span>
              </button>
            </div>
          )}
        </div>
        <DragOverlay dropAnimation={null}>{dragLabel ? <div className="inline-flex rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-lg">{dragLabel}</div> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

/**
 * The page builder for posts and pages: Add and Layers on the left, the page in the middle, block, page and SEO
 * settings on the right. The store lives as long as the editor stays open, so undo history survives saves. `embedded`
 * draws it inside a box instead of over the whole window (the /v2 showcase).
 */
export function BuilderApp({ init, features, actorName, embedded = false }: { init: BuilderInit; features: readonly FeatureOption[]; actorName: string; embedded?: boolean }) {
  const [store] = useState(() => createBuilderStore(init));
  return (
    <BuilderContext.Provider value={store}>
      <Shell features={features} actorName={actorName} embedded={embedded} />
    </BuilderContext.Provider>
  );
}
