"use client";

import type { JSONContent } from "@tiptap/react";
import { useId, type ComponentType } from "react";
import { RichTextEditor } from "@/components/portal/editor/RichTextEditor";
import { blockName } from "@/lib/builder/blocks";
import { pick } from "@/lib/builder/fields";
import type { Block } from "@/lib/builder/model";
import { BlockShell } from "./layout";
import { useBuilder } from "./store";

/**
 * Blocks that are edited in place on the canvas instead of through the Block panel, by type. Every other block is
 * drawn by its own definition (lib/builder/blocks), exactly as on the public page.
 */
export type InlineProps = { block: Block; selected: boolean; band?: string };

/** The Text block: the rich text editor inside the same frame the public page draws around the text. */
function TextEditor({ block, selected, band }: InlineProps) {
  const kind = useBuilder((s) => s.kind);
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const update = useBuilder((s) => s.update);
  const rev = useBuilder((s) => s.historyRev);
  const labelId = useId();
  return (
    <BlockShell ctx={{ kind, band, editing: true }} width={pick(block.props.width, ["text", "wide"] as const, "text")} article>
      <span id={labelId} className="sr-only">
        {blockName(block.type).label}
      </span>
      <RichTextEditor
        key={rev}
        variant="inline"
        toolbar={selected}
        reportInitial={false}
        initialContent={block.props.content as JSONContent | string}
        editable={canEdit}
        uploadEnabled={uploadEnabled}
        labelledBy={labelId}
        onChange={(json) => update(block.id, (props) => ({ ...props, content: json }))}
      />
    </BlockShell>
  );
}

export const INLINE: Record<string, ComponentType<InlineProps> | undefined> = { Text: TextEditor };
