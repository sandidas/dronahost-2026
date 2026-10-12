"use client";

import type { JSONContent } from "@tiptap/react";
import { useId, useState, type ComponentType } from "react";
import { RichTextEditor } from "@/components/portal/editor/RichTextEditor";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { blockName } from "@/lib/builder/blocks";
import { Columns, SPLITS } from "@/lib/builder/blocks/content";
import { frameOf } from "@/lib/builder/blocks/frame";
import { pick } from "@/lib/builder/fields";
import type { Block } from "@/lib/builder/model";
import { BlockShell } from "./layout";
import { useBuilder } from "./store";

/**
 * Blocks that are edited in place on the canvas instead of through the Block panel, by type. They sit in the same
 * frame the public page draws around them. Every other block is drawn by its own definition (lib/builder/blocks),
 * exactly as on the public page.
 */
export type InlineProps = { block: Block; selected: boolean };

/** One rich text field of a block, written on the canvas. The toolbar shows while `toolbar` is set. */
function RichField({ block, field, label, toolbar }: { block: Block; field: string; label: string; toolbar: boolean }) {
  const canEdit = useBuilder((s) => s.canEdit);
  const uploadEnabled = useBuilder((s) => s.uploadEnabled);
  const update = useBuilder((s) => s.update);
  const rev = useBuilder((s) => s.historyRev);
  const labelId = useId();
  return (
    <>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <RichTextEditor
        key={rev}
        variant="inline"
        toolbar={toolbar}
        reportInitial={false}
        initialContent={block.props[field] as JSONContent | string}
        editable={canEdit}
        uploadEnabled={uploadEnabled}
        labelledBy={labelId}
        onChange={(json) => update(block.id, (props) => ({ ...props, [field]: json }))}
      />
    </>
  );
}

function TextEditor({ block, selected }: InlineProps) {
  return (
    <BlockShell frame={frameOf(block.props)} article>
      <RichField block={block} field="content" label={blockName(block.type).label} toolbar={selected} />
    </BlockShell>
  );
}

/** Two columns: each written in place; the toolbar follows the column being written in. */
function TwoColumnEditor({ block, selected }: InlineProps) {
  const [active, setActive] = useState<"left" | "right">("left");
  const F = BUILDER_TEXT.fields;
  const column = (side: "left" | "right") => (
    <div onFocusCapture={() => setActive(side)} className="h-full">
      <RichField block={block} field={side} label={side === "left" ? F.leftColumn : F.rightColumn} toolbar={selected && active === side} />
    </div>
  );
  return (
    <BlockShell frame={frameOf(block.props)}>
      <Columns split={pick(block.props.split, SPLITS, "equal")} left={column("left")} right={column("right")} />
    </BlockShell>
  );
}

export const INLINE: Record<string, ComponentType<InlineProps> | undefined> = { Text: TextEditor, TwoColumn: TwoColumnEditor };
