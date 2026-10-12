import {
  newBlockId,
  type AnyBlock,
  type BlockType,
  type BuilderDoc,
  type ColumnsBlock,
  type LeafBlock,
  type RootBlock,
  type SectionBlock,
} from "./model";

/**
 * Immutable tree operations for the builder. Every function returns a new document and leaves the input alone, so
 * undo/redo can keep old documents by reference.
 */

/** Where a block can sit: the page itself, inside a Section, or inside one column of a Columns block. */
export type Slot = { kind: "root" } | { kind: "section"; id: string } | { kind: "column"; id: string; index: number };

export const ROOT: Slot = { kind: "root" };

export const slotKey = (slot: Slot): string => (slot.kind === "root" ? "root" : slot.kind === "section" ? `section:${slot.id}` : `column:${slot.id}:${slot.index}`);

export function parseSlotKey(key: string): Slot | null {
  if (key === "root") return ROOT;
  const [kind, id, index] = key.split(":");
  if (kind === "section" && id) return { kind: "section", id };
  if (kind === "column" && id && index !== undefined && /^\d$/.test(index)) return { kind: "column", id, index: Number(index) };
  return null;
}

const ROOT_TYPES = new Set<BlockType>(["section", "site"]);
const SECTION_TYPES = new Set<BlockType>(["heading", "richtext", "image", "video", "columns"]);
const COLUMN_TYPES = new Set<BlockType>(["heading", "richtext", "image", "video"]);

/** Whether a block of this type may sit in the slot. */
export function accepts(slot: Slot, type: BlockType): boolean {
  if (slot.kind === "root") return ROOT_TYPES.has(type);
  if (slot.kind === "section") return SECTION_TYPES.has(type);
  return COLUMN_TYPES.has(type);
}

/** The slot a block type goes to when it is added without a target: content blocks need a section. */
export const isRootType = (type: BlockType): boolean => ROOT_TYPES.has(type);

export type Found = { block: AnyBlock; slot: Slot; index: number };

/** Locates a block and the slot it sits in. */
export function findBlock(doc: BuilderDoc, id: string): Found | null {
  for (const [i, root] of doc.blocks.entries()) {
    if (root.id === id) return { block: root, slot: ROOT, index: i };
    if (root.type !== "section") continue;
    for (const [j, child] of root.children.entries()) {
      if (child.id === id) return { block: child, slot: { kind: "section", id: root.id }, index: j };
      if (child.type !== "columns") continue;
      for (const [c, column] of child.columns.entries()) {
        for (const [k, leaf] of column.children.entries()) {
          if (leaf.id === id) return { block: leaf, slot: { kind: "column", id: child.id, index: c }, index: k };
        }
      }
    }
  }
  return null;
}

/** The blocks in a slot, or null when the slot does not exist. */
export function slotBlocks(doc: BuilderDoc, slot: Slot): readonly AnyBlock[] | null {
  if (slot.kind === "root") return doc.blocks;
  const owner = findBlock(doc, slot.id)?.block;
  if (slot.kind === "section") return owner?.type === "section" ? owner.children : null;
  return owner?.type === "columns" ? (owner.columns[slot.index]?.children ?? null) : null;
}

/** Applies `edit` to the list of blocks in one slot. */
function editSlot(doc: BuilderDoc, slot: Slot, edit: (blocks: AnyBlock[]) => AnyBlock[]): BuilderDoc {
  if (slot.kind === "root") return { ...doc, blocks: edit([...doc.blocks]) as RootBlock[] };
  const blocks = doc.blocks.map((root): RootBlock => {
    if (root.type !== "section") return root;
    if (slot.kind === "section") return root.id === slot.id ? { ...root, children: edit([...root.children]) as SectionBlock["children"] } : root;
    let changed = false;
    const children = root.children.map((child) => {
      if (child.type !== "columns" || child.id !== slot.id) return child;
      changed = true;
      return { ...child, columns: child.columns.map((col, i) => (i === slot.index ? { ...col, children: edit([...col.children]) as LeafBlock[] } : col)) };
    });
    return changed ? { ...root, children } : root;
  });
  return { ...doc, blocks };
}

export function insertBlock(doc: BuilderDoc, slot: Slot, index: number, block: AnyBlock): BuilderDoc {
  if (!accepts(slot, block.type) || slotBlocks(doc, slot) === null) return doc;
  return editSlot(doc, slot, (list) => {
    list.splice(Math.max(0, Math.min(index, list.length)), 0, block);
    return list;
  });
}

export function removeBlock(doc: BuilderDoc, id: string): BuilderDoc {
  const found = findBlock(doc, id);
  if (!found) return doc;
  return editSlot(doc, found.slot, (list) => list.filter((b) => b.id !== id));
}

/** Replaces one block with what `update` returns. The id cannot change. */
export function updateBlock(doc: BuilderDoc, id: string, update: (block: AnyBlock) => AnyBlock): BuilderDoc {
  const found = findBlock(doc, id);
  if (!found) return doc;
  const next = { ...update(found.block), id };
  if (next.type !== found.block.type) return doc;
  return editSlot(doc, found.slot, (list) => list.map((b) => (b.id === id ? next : b)));
}

/** Ids of a block and everything inside it. */
export function blockIds(block: AnyBlock): string[] {
  if (block.type === "section") return [block.id, ...block.children.flatMap(blockIds)];
  if (block.type === "columns") return [block.id, ...block.columns.flatMap((c) => c.children.flatMap(blockIds))];
  return [block.id];
}

/**
 * Moves a block to `index` in `slot` (the index is read in the slot after the block has been taken out). Refused
 * when the slot does not take that block type or sits inside the block being moved.
 */
export function moveBlock(doc: BuilderDoc, id: string, slot: Slot, index: number): BuilderDoc {
  const found = findBlock(doc, id);
  if (!found || !accepts(slot, found.block.type)) return doc;
  if (slot.kind !== "root" && blockIds(found.block).includes(slot.id)) return doc;
  const without = removeBlock(doc, id);
  if (slotBlocks(without, slot) === null) return doc;
  return insertBlock(without, slot, index, found.block);
}

/** A deep copy with fresh ids, so a duplicate never shares an id (or an anchor) with the original. */
export function cloneWithNewIds<T extends AnyBlock>(block: T): T {
  const copy = structuredClone(block) as AnyBlock;
  copy.id = newBlockId();
  if (copy.type === "section") copy.children = copy.children.map((c) => cloneWithNewIds(c));
  if (copy.type === "columns") copy.columns = copy.columns.map((col) => ({ id: newBlockId(), children: col.children.map((c) => cloneWithNewIds(c)) }));
  return copy as T;
}

export function duplicateBlock(doc: BuilderDoc, id: string): { doc: BuilderDoc; id: string | null } {
  const found = findBlock(doc, id);
  if (!found) return { doc, id: null };
  const copy = cloneWithNewIds(found.block);
  return { doc: insertBlock(doc, found.slot, found.index + 1, copy), id: copy.id };
}

/** Moves a block one place up or down within its slot. */
export function nudgeBlock(doc: BuilderDoc, id: string, delta: -1 | 1): BuilderDoc {
  const found = findBlock(doc, id);
  const list = found && slotBlocks(doc, found.slot);
  if (!found || !list) return doc;
  const target = found.index + delta;
  if (target < 0 || target >= list.length) return doc;
  return moveBlock(doc, id, found.slot, target);
}

/** Changes a Columns layout, keeping every block: when columns go from three to two, the third column's blocks move to the second. */
export function resizeColumns(block: ColumnsBlock, count: number): ColumnsBlock["columns"] {
  const columns = block.columns.map((c) => ({ ...c, children: [...c.children] }));
  while (columns.length < count) columns.push({ id: newBlockId(), children: [] });
  while (columns.length > count) {
    const removed = columns.pop();
    columns[columns.length - 1]?.children.push(...(removed?.children ?? []));
  }
  return columns;
}

/** Every block in document order, with its depth (0 for root blocks). */
export function flatten(doc: BuilderDoc): { block: AnyBlock; depth: number }[] {
  const out: { block: AnyBlock; depth: number }[] = [];
  const visit = (block: AnyBlock, depth: number) => {
    out.push({ block, depth });
    if (block.type === "section") block.children.forEach((c) => visit(c, depth + 1));
    if (block.type === "columns") block.columns.forEach((col) => col.children.forEach((c) => visit(c, depth + 1)));
  };
  doc.blocks.forEach((b) => visit(b, 0));
  return out;
}
