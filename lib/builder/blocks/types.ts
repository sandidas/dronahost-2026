import type { ReactNode } from "react";
import type { TiptapDoc } from "@/lib/editor/schema";
import type { Field, Props } from "../fields";

/**
 * One component the builder offers. Everything about it lives in its definition: the Block panel fields (which also
 * fix what may be stored), how its props are cleaned for display and how it renders. No field is required: a block
 * shows whatever has been filled in. Nothing else in the builder looks at a block's type, so a new component is one
 * new definition. Posts and pages offer the same blocks and draw them the same way.
 */

export type BlockGroup = "text" | "media" | "sections" | "banners";

export type RenderCtx = {
  /** The alternating band class (lib/builder/doc.ts pageBands), when this block gets one. */
  band?: string;
  /** This block's heading is the page's H1 (the first hero on a page; a post's H1 is its title). Otherwise H2. */
  h1?: boolean;
  /** Drawn on the editor canvas: links and players do nothing there, and a click selects the block. */
  editing: boolean;
  /**
   * Public page only: rich text as sanitised HTML, with heading ids added to the contents list. The canvas edits rich
   * text in place (components/builder/inline.tsx), so it never calls this.
   */
  richHtml?: (content: TiptapDoc | string) => string;
};

export type Heading = { level: number; text: string };

export type BlockDef<P = unknown> = {
  type: string;
  group: BlockGroup;
  /** lucide icon name, mapped to a component in components/builder/icons.ts. */
  icon: string;
  fields: readonly Field[];
  /** Starting props when the block is added. Default: empty fields, each choice at its first option. */
  defaults?: () => Props;
  /** A hero: on a page, the first one carries the page's H1 (pages print no title of their own). */
  hero?: boolean;
  /** Sits on the page background, so it takes part in the alternating bands on pages. */
  banded?: boolean;
  /** The props cleaned for display, or null while there is nothing to show (the public page then shows nothing). */
  prepare: (props: Props) => P | null;
  render: (p: P, ctx: RenderCtx) => ReactNode;
  /** The headings the block shows, for the heading outline and the SEO checks. `h1`: as in RenderCtx. */
  headings?: (p: P, h1: boolean) => Heading[];
  /** Questions and answers, for FAQ structured data. */
  faq?: (p: P) => { question: string; answer: string }[];
};

/** Keeps each definition's prepared type checked against its own render, then stores it untyped in the registry. */
export const defineBlock = <P>(def: BlockDef<P>): BlockDef => def as unknown as BlockDef;
