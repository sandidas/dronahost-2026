"use client";

import { BUILDER_TEXT } from "@/content/portal-strings";
import { entryFor } from "@/lib/builder/catalog";
import type { SiteBlock } from "@/lib/builder/model";
import { siteSectionProblems } from "@/lib/builder/validate";
import { BLOCK_ICONS } from "./icons";
import { renderSection } from "./SectionView";

const T = BUILDER_TEXT.ui.block;

/**
 * A section on the canvas, drawn in the browser by the same renderer the public page uses, so it updates as you type
 * and looks exactly as it will live. Its links and buttons do nothing while editing (`inert`); a click selects the
 * block. While it has nothing to show, the canvas says what to fill in (the public page shows nothing there).
 */
export function SiteBlockView({ block, className, inPost = false }: { block: SiteBlock; className?: string; inPost?: boolean }) {
  const node = renderSection(block.section.type, block.section.content, className, inPost);
  if (node) {
    return (
      <div inert className="select-none">
        {node}
      </div>
    );
  }
  const entry = entryFor(block);
  const Icon = entry ? BLOCK_ICONS[entry.icon] : undefined;
  const missing = siteSectionProblems(block);
  return (
    <div className="builder-ui m-4 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-strong p-8 text-center text-sm text-muted-foreground">
      {Icon && <Icon className="size-6 text-link" aria-hidden="true" />}
      <p className="font-semibold text-foreground">{entry?.label}</p>
      <p>{T.fillIn}</p>
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
