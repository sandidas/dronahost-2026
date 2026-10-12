"use client";

import { createContext, useContext } from "react";
import { temporal } from "zundo";
import { createStore, useStore, type StoreApi } from "zustand";
import { createBlock } from "@/lib/builder/blocks";
import { duplicateBlock, indexOf, insertBlock, moveBlock, nudgeBlock, removeBlock, setSettings, updateProps } from "@/lib/builder/doc";
import type { Block, BuilderDoc, PageSettings, PostKind } from "@/lib/builder/model";
import type { PostSeo } from "@/lib/builder/seo";
import { publishProblems } from "@/lib/builder/validate";
import { slugify } from "@/lib/portal/slug";

export type Meta = { title: string; slug: string; excerpt: string; coverImage: string; coverImageAlt: string; seo: PostSeo };
export type SaveState = "new" | "saved" | "dirty" | "saving" | "error";
export type Device = "desktop" | "tablet" | "phone";
export type Message = { kind: "ok" | "error"; text: string } | null;
/** The last check of the slug against the database (SEO tab and Page tab). */
export type SlugCheck = { slug: string; state: "checking" | "free" | "taken" | "reserved"; suggestion?: string } | null;

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
  /** Dates shown in the post's meta line on the canvas (ISO), fixed by the server so both renders agree. */
  dates: { published: string; modified: string };
};

export type BuilderState = BuilderInit & {
  /** Shown as the author on the post canvas, as on the published post. */
  actorName: string;
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
  /**
   * Set when a publish (or a save of a live page) was refused: from then on the editor checks the page as it changes
   * and marks what is still unfinished (useProblems), so each mark goes away as soon as it is fixed.
   */
  showProblems: boolean;
  /** Bumped by every saved change, so the preview frame reloads. */
  savedVersion: number;
  /** The slug as last saved: the preview loads the saved version, which an unsaved slug edit does not move. */
  savedSlug: string | null;
  /** Small screens: which side panel is open over the canvas. */
  mobilePanel: "left" | "right" | null;
  /** The type being dragged, so only the drop zones that take it light up. */
  dragType: string | null;
  /** The name shown on the chip that follows the pointer while a block is moved. */
  dragLabel: string | null;
  /** The innermost block under the pointer (only it shows its toolbar). */
  hoverId: string | null;
  /** Bumped by undo and redo: rich text editors keep their own state, so they reload from the page when it changes. */
  historyRev: number;
  slugCheck: SlugCheck;

  setMeta: (patch: Partial<Meta>) => void;
  /** Adds a block at `index`, or after the selected block, or at the end. */
  addBlock: (type: string, index?: number) => void;
  /** Replaces an empty page with a template's blocks. */
  applyTemplate: (blocks: Block[]) => void;
  move: (id: string, index: number) => void;
  nudge: (id: string, delta: -1 | 1) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  update: (id: string, fn: (props: Block["props"]) => Block["props"]) => void;
  setSettings: (patch: Partial<PageSettings>) => void;
  select: (id: string | null) => void;
  set: (patch: Partial<Pick<BuilderState, "leftTab" | "rightTab" | "preview" | "device" | "dragType" | "dragLabel" | "hoverId" | "message" | "showProblems" | "mobilePanel" | "slugCheck">>) => void;
  saving: () => void;
  saved: (result: { postId: string; slug: string }) => void;
  failed: (text: string, fieldErrors?: Record<string, string>) => void;
  statusChanged: (status: "draft" | "published", locked: boolean, publishedLine?: string | null) => void;
};

/**
 * Undo steps. Typing in one place (the same block, or the page settings) within a second is one step; every other change
 * (add, move, duplicate, delete, template) is always a step of its own. `group.key` is set by the change being made.
 */
function grouped<A extends unknown[]>(fn: (...args: A) => void, group: { key: string }, ms: number): (...args: A) => void {
  let lastKey = "";
  let lastAt = 0;
  return (...args: A) => {
    const now = Date.now();
    const sameTyping = group.key !== "" && group.key === lastKey && now - lastAt < ms;
    if (!sameTyping) fn(...args);
    lastKey = group.key;
    lastAt = now;
  };
}

export function createBuilderStore(init: BuilderInit & { actorName: string }) {
  const group = { key: "" };
  return createStore<BuilderState>()(
    temporal(
      (set, get) => {
        /** Every change to the page goes through here: refused when the person cannot edit, and marks the page unsaved. */
        const edit = (patch: Partial<BuilderState>, typingKey = "") => {
          if (!get().canEdit) return;
          group.key = typingKey;
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
          showProblems: false,
          savedVersion: 0,
          savedSlug: init.postId ? init.meta.slug : null,
          mobilePanel: null,
          dragType: null,
          dragLabel: null,
          hoverId: null,
          historyRev: 0,
          slugCheck: null,

          setMeta: (patch) => {
            const { meta, slugTouched } = get();
            const next = { ...meta, ...patch };
            const touched = slugTouched || patch.slug !== undefined;
            if (!touched && patch.title !== undefined) next.slug = slugify(patch.title);
            edit({ meta: next, slugTouched: touched, ...(next.slug !== meta.slug && { slugCheck: null }) }, "meta");
          },
          addBlock: (type, index) => {
            const { doc, selectedId } = get();
            const block = createBlock(type);
            if (!block) return;
            // Clicked in the Add panel: after the selected block, otherwise at the end.
            const after = selectedId ? indexOf(doc, selectedId) : -1;
            const at = index ?? (after >= 0 ? after + 1 : doc.blocks.length);
            edit({ doc: insertBlock(doc, at, block), selectedId: block.id, rightTab: "block" });
          },
          applyTemplate: (blocks) => {
            if (get().doc.blocks.length > 0) return;
            edit({ doc: { ...get().doc, blocks }, selectedId: blocks[0]?.id ?? null, rightTab: "block" });
          },
          move: (id, index) => {
            const next = moveBlock(get().doc, id, index);
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
            const i = indexOf(doc, id);
            if (i < 0) return;
            const neighbour = doc.blocks[i + 1] ?? doc.blocks[i - 1];
            edit({ doc: removeBlock(doc, id), selectedId: selectedId === id ? (neighbour?.id ?? null) : selectedId });
          },
          update: (id, fn) => {
            const next = updateProps(get().doc, id, fn);
            if (next !== get().doc) edit({ doc: next }, `block:${id}`);
          },
          setSettings: (patch) => edit({ doc: setSettings(get().doc, patch) }),
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
            set((s) => ({ status, locked, publishedLine: publishedLine === undefined ? s.publishedLine : publishedLine, showProblems: false, savedVersion: s.savedVersion + 1 })),
        };
      },
      {
        // Only the page itself is undoable; selection, panels and save state are not.
        partialize: (s) => ({ doc: s.doc, meta: s.meta }),
        equality: (a, b) => a.doc === b.doc && a.meta === b.meta,
        limit: 100,
        handleSet: (handleSet) => grouped(handleSet, group, 1000),
      },
    ),
  );
}

export type BuilderStore = ReturnType<typeof createBuilderStore>;

export const BuilderContext = createContext<BuilderStore | null>(null);

/** Broken links and addresses by block id ("page" for the page as a whole), computed by the editor shell. Empty until a publish is refused. */
export const ProblemsContext = createContext<Record<string, string[]>>({});
export const useProblems = (): Record<string, string[]> => useContext(ProblemsContext);

/** The publishing checks run in the browser, grouped by block. */
export function groupProblems(doc: BuilderDoc): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const p of publishProblems(doc)) (out[p.blockId || "page"] ??= []).push(p.message);
  return out;
}

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
