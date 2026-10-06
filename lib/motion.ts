import type { CSSProperties } from "react";

/** Stagger positions stop at 5, so a long list never waits more than 5 steps. */
const MAX_STAGGER = 5;

/**
 * Props for a scroll-reveal element. Spread onto a card or heading:
 * `<li {...reveal(index)}>`. Pass no index for a single block.
 */
export function reveal(index = 0): { "data-reveal": ""; style: CSSProperties } {
  return { "data-reveal": "", style: { "--i": Math.min(Math.max(index, 0), MAX_STAGGER) } as CSSProperties };
}
