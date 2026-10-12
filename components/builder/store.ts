"use client";

import { createContext, useContext } from "react";
import { temporal } from "zundo";
import { createStore, useStore, type StoreApi } from "zustand";
import { entryByType } from "@/lib/builder/catalog";
import { isRootType, accepts, duplicateBlock, findBlock, insertBlock, moveBlock, nudgeBlock, removeBlock, slotBlocks, updateBlock, ROOT, type Slot } from "@/lib/builder/tree";
import type { AnyBlock, BuilderDoc, PostKind, RootBlock } from "@/lib/builder/model";
import type { PostSeo } from "@/lib/builder/seo";
import { slugify } from "@/lib/portal/slug";

export type Meta = { title: string; slug: string; excerpt: string; coverImage: string; seo: PostSeo };
export type SaveState = "new" | "saved" | "dirty" | "saving" | "error";
export type Device = "desktop" | "tablet" | "phone";
export type Message = { kind: "ok" | "error"; text: string } | null;

export type BuilderInit = {
  postId: string | null;
  kind: PostKind;
  status: "draft" | "published";
  locked: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  uploadEnabled: boolean;
  meta: Meta;
  doc: BuilderDoc;
  publishedLine: string | null;
};

export type BuilderState = BuilderInit & {
  /** True once someone has edited the slug, so the title stops filling it in. */
  slugTouched: boolean;
  selectedId: string | null;
  leftTab: "add" | "layers";
  rightTab: "block" | "page" | "seo";
  preview: boolean;
  device: Device;
  saveState: SaveState;
  message: Message;
  /** Field errors from the last save (title, slug, ...). */
  fieldErrors: Record<string, string>;
  /** Publish problems by block id ("page" for the document as a whole). */
  problems: Record<string, string[]>;
  /** Bumped by every saved change, so the preview frame reloads. */
  savedVersion: number;
  /** The slug as last saved: the preview loads the saved version, which an unsaved slug edit does not move. */
  savedSlug: string | null;
  /** Small screens: which side panel is open over the canvas. */
  mobilePanel: "left" | "right" | null;
  /** The type being dragged, so only the drop zones that take it light up. */
  dragType: string | null;
  /** The innermost block under the pointer (only it shows its toolbar). */
  hoverId: string | null;
  /** Bumped by undo and redo: rich text editors keep their own state, so they reload from the page when it changes. */
  historyRev: number;

  setMeta: (patch: Partial<Meta>) => void;
  addBlock: (type: string, target?: { slot: Slot; index: number }) => void;
  /** Replaces an empty page with a template's blocks. */
  applyTemplate: (blocks: RootBlock[]) => void;
  move: (id: string, slot: Slot, index: number) => void;
  nudge: (id: string, delta: -1 | 1) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  update: (id: string, fn: (block: AnyBlock) => AnyBlock) => void;
  select: (id: string | null) => void;
  set: (patch: Partial<Pick<BuilderState, "leftTab" | "rightTab" | "preview" | "device" | "dragType" | "hoverId" | "message" | "problems" | "mobilePanel">>) => void;
  saving: () => void;
  saved: (result: { postId: string; slug: string }) => void;
  failed: (text: string, fieldErrors?: Record<string, string>) => void;
  statusChanged: (status: "draft" | "published", locked: boolean, publishedLine?: string | null) => void;
};

/** Groups a burst of changes (typing) into one undo step: the state before the burst is recorded once. */
function burst<A extends unknown[]>(fn: (...args: A) => void, ms: number): (...args: A) => void {
  let last = 0;
  return (...args: A) => {
    const now = Date.now();
    if (now - last > ms) fn(...args);
    last = now;
  };
}

/** Where a new block goes when it is clicked in the Add panel rather than dragged. */
function defaultTarget(doc: BuilderDoc, selectedId: string | null, type: string): { slot: Slot; index: number } | null {
  const found = selectedId ? findBlock(doc, selectedId) : null;
  if (isRootType(type as AnyBlock["type"])) {
    // After the selected root block (or the root block that contains the selection), otherwise at the end.
    let rootIndex = doc.blocks.length;
    if (found) {
      const rootId = found.slot.kind === "root" ? found.block.id : found.slot.kind === "section" ? found.slot.id : doc.blocks.find((b) => b.type === "section" && b.children.some((c) => c.id === (found.slot as { id: string }).id))?.id;
      const i = doc.blocks.findIndex((b) => b.id === rootId);
      if (i >= 0) rootIndex = i + 1;
    }
    return { slot: ROOT, index: rootIndex };
  }
  if (found?.block.type === "section") return { slot: { kind: "section", id: found.block.id }, index: found.block.children.length };
  if (found && found.slot.kind !== "root" && accepts(found.slot, type as AnyBlock["type"])) return { slot: found.slot, index: found.index + 1 };
  if (found?.slot.kind === "column") {
    // A Columns block inside a column is not allowed: put it after the Columns block instead.
    const columns = findBlock(doc, found.slot.id);
    if (columns) return { slot: columns.slot, index: columns.index + 1 };
  }
  const lastSection = [...doc.blocks].reverse().find((b) => b.type === "section");
  return lastSection ? { slot: { kind: "section", id: lastSection.id }, index: lastSection.children.length } : null;
}

export function createBuilderStore(init: BuilderInit) {
  return createStore<BuilderState>()(
    temporal(
      (set, get) => {
        /** Every change to the page goes through here: refused when the person cannot edit, and marks the page unsaved. */
        const edit = (patch: Partial<BuilderState>) => {
          if (!get().canEdit) return;
          set({ ...patch, saveState: "dirty", message: null });
        };
        return {
          ...init,
          slugTouched: init.postId !== null,
          selectedId: null,
          leftTab: "add",
          rightTab: init.postId ? "block" : "page",
          preview: false,
          device: "desktop",
          saveState: init.postId ? "saved" : "new",
          message: null,
          fieldErrors: {},
          problems: {},
          savedVersion: 0,
          savedSlug: init.postId ? init.meta.slug : null,
          mobilePanel: null,
          dragType: null,
          hoverId: null,
          historyRev: 0,

          setMeta: (patch) => {
            const { meta, slugTouched } = get();
            const next = { ...meta, ...patch };
            const touched = slugTouched || patch.slug !== undefined;
            if (!touched && patch.title !== undefined) next.slug = slugify(patch.title);
            edit({ meta: next, slugTouched: touched });
          },
          addBlock: (type, target) => {
            const entry = entryByType(type);
            if (!entry) return;
            let { doc } = get();
            let place = target ?? defaultTarget(doc, get().selectedId, entry.create().type);
            const block = entry.create();
            if (!place) {
              // Content needs a section: start one.
              const section = entryByType("section")!.create();
              doc = insertBlock(doc, ROOT, doc.blocks.length, section);
              place = { slot: { kind: "section", id: section.id }, index: 0 };
            }
            const next = insertBlock(doc, place.slot, place.index, block);
            if (next === doc) return;
            edit({ doc: next, selectedId: block.id, rightTab: "block" });
          },
          applyTemplate: (blocks) => {
            if (get().doc.blocks.length > 0) return;
            edit({ doc: { version: 1, blocks }, selectedId: blocks[0]?.id ?? null, rightTab: "block" });
          },
          move: (id, slot, index) => {
            const next = moveBlock(get().doc, id, slot, index);
            if (next !== get().doc) edit({ doc: next });
          },
          nudge: (id, delta) => {
            const next = nudgeBlock(get().doc, id, delta);
            if (next !== get().doc) edit({ doc: next });
          },
          duplicate: (id) => {
            const { doc, id: copy } = duplicateBlock(get().doc, id);
            if (copy) edit({ doc, selectedId: copy });
          },
          remove: (id) => {
            const { doc, selectedId } = get();
            const found = findBlock(doc, id);
            if (!found) return;
            const siblings = slotBlocks(doc, found.slot) ?? [];
            const neighbour = siblings[found.index + 1] ?? siblings[found.index - 1];
            edit({ doc: removeBlock(doc, id), selectedId: selectedId === id ? (neighbour?.id ?? (found.slot.kind === "root" ? null : found.slot.id)) : selectedId });
          },
          update: (id, fn) => {
            const next = updateBlock(get().doc, id, fn);
            if (next !== get().doc) edit({ doc: next });
          },
          select: (id) => set({ selectedId: id, ...(id && { rightTab: "block" as const }) }),
          set: (patch) => set(patch),
          saving: () => set({ saveState: "saving" }),
          saved: ({ postId, slug }) =>
            set((s) => ({
              postId,
              meta: s.meta.slug === slug ? s.meta : { ...s.meta, slug },
              slugTouched: true,
              // A change made while the save was in flight keeps the page marked unsaved.
              saveState: s.saveState === "saving" ? "saved" : s.saveState,
              fieldErrors: {},
              savedVersion: s.savedVersion + 1,
              savedSlug: slug,
            })),
          failed: (text, fieldErrors = {}) => set({ saveState: "error", message: { kind: "error", text }, fieldErrors }),
          statusChanged: (status, locked, publishedLine) =>
            set((s) => ({ status, locked, publishedLine: publishedLine === undefined ? s.publishedLine : publishedLine, problems: {}, savedVersion: s.savedVersion + 1 })),
        };
      },
      {
        // Only the page itself is undoable; selection, panels and save state are not.
        partialize: (s) => ({ doc: s.doc, meta: s.meta }),
        equality: (a, b) => a.doc === b.doc && a.meta === b.meta,
        limit: 100,
        handleSet: (handleSet) => burst(handleSet, 600),
      },
    ),
  );
}

export type BuilderStore = ReturnType<typeof createBuilderStore>;

export const BuilderContext = createContext<BuilderStore | null>(null);

function useStoreApi(): BuilderStore {
  const store = useContext(BuilderContext);
  if (!store) throw new Error("Builder components must sit inside <BuilderContext.Provider>.");
  return store;
}

export function useBuilder<T>(selector: (s: BuilderState) => T): T {
  return useStore(useStoreApi(), selector);
}

export function useBuilderApi(): StoreApi<BuilderState> & Pick<BuilderStore, "temporal"> {
  return useStoreApi();
}

/** Undo and redo availability, and the actions. Undo marks the page unsaved. */
export function useHistory() {
  const store = useStoreApi();
  const pastCount = useStore(store.temporal, (t) => t.pastStates.length);
  const futureCount = useStore(store.temporal, (t) => t.futureStates.length);
  const canEdit = useStore(store, (s) => s.canEdit);
  const run = (op: "undo" | "redo") => {
    if (!canEdit) return;
    store.temporal.getState()[op]();
    store.setState((s) => ({ saveState: "dirty", historyRev: s.historyRev + 1 }));
  };
  return { canUndo: canEdit && pastCount > 0, canRedo: canEdit && futureCount > 0, undo: () => run("undo"), redo: () => run("redo") };
}
