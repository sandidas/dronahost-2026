import { isVerified } from "@/content/claims";

/** An item that depends on a capability or policy claim. No `claim` means it always shows. */
export type Gated = { claim?: string };

/**
 * Items whose claim may render. An item with no claim always stays. `showAll` is for the /v2 showcase only, where samples
 * are forced on. `check` defaults to the claim gate (verified AND terms page published).
 */
export function visibleItems<T extends Gated>(items: readonly T[], options: { showAll?: boolean; check?: (id: string) => boolean } = {}): T[] {
  const { showAll = false, check = isVerified } = options;
  return items.filter((item) => showAll || !item.claim || check(item.claim));
}
