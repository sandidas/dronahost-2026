import { BUILDER_TEXT } from "@/content/portal-strings";
import { emptyProps } from "../fields";
import { newBlockId, type Block, type PostKind } from "../model";
import { GalleryBlock, ImageBlock, Text, Video } from "./content";
import { Action, Answer, CtaBand, Faq, FeatureCards, Guide, Hero, LinkTiles, Offer, SplitSection, Steps } from "./sections";
import type { BlockDef, BlockGroup } from "./types";

/**
 * The block registry: every component the builder offers, in the order the Add panel lists them. To add a component,
 * write its definition (lib/builder/blocks/types.ts) and list it here, then give it a name and hint in
 * BUILDER_TEXT.blocks (content/portal-strings.ts). The editor, the checks and the public page need nothing else.
 */
export const BLOCKS: readonly BlockDef[] = [Text, ImageBlock, GalleryBlock, Video, Hero, SplitSection, FeatureCards, Steps, Faq, LinkTiles, CtaBand, Offer, Guide, Action, Answer];

export const GROUPS: readonly BlockGroup[] = ["text", "media", "sections", "banners"];

const BY_TYPE = new Map(BLOCKS.map((b) => [b.type, b]));

export const blockDef = (type: string): BlockDef | undefined => BY_TYPE.get(type);

type Names = Record<string, { label: string; hint: string } | undefined>;
/** The block's name and one-line hint, as the Add panel shows them. */
export const blockName = (type: string): { label: string; hint: string } => (BUILDER_TEXT.blocks as Names)[type] ?? { label: type, hint: "" };

/** Whether a post or page may use the block (the hero is for pages only: a post's title is its H1). */
export const allowedIn = (def: BlockDef, kind: PostKind): boolean => !def.kinds || def.kinds.includes(kind);

export const blocksFor = (kind: PostKind): BlockDef[] => BLOCKS.filter((b) => allowedIn(b, kind));

/** A new block of this type with its starting props. */
export function createBlock(type: string): Block | null {
  const def = blockDef(type);
  return def ? { id: newBlockId(), type, props: { ...emptyProps(def.fields), ...def.defaults?.() } } : null;
}

/** The block cleaned for display, or null when it shows nothing (or its type is unknown, for example from a newer editor). */
export function prepareBlock(block: Block): unknown {
  return blockDef(block.type)?.prepare(block.props ?? {}) ?? null;
}
