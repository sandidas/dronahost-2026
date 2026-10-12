"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useId, useState } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { BLOCKS, blockDef, blockName, GROUPS, prepareBlock } from "@/lib/builder/blocks";
import type { BlockDef } from "@/lib/builder/blocks/types";
import type { Block } from "@/lib/builder/model";
import { cn } from "@/utils/cn";
import { BLOCK_ICONS } from "./icons";
import { useBuilder, useProblems } from "./store";
import { PALETTE_MIME } from "./Canvas";
import { iconButton } from "./TopBar";

const T = BUILDER_TEXT.ui;

function PaletteTile({ def }: { def: BlockDef }) {
  const addBlock = useBuilder((s) => s.addBlock);
  const set = useBuilder((s) => s.set);
  const [dragging, setDragging] = useState(false);
  const Icon = BLOCK_ICONS[def.icon];
  const entry = blockName(def.type);
  return (
    <button
      type="button"
      draggable
      // Native drag and drop: it carries the block into the canvas frame, where dnd-kit's pointer events cannot follow.
      onDragStart={(e) => {
        e.dataTransfer.setData(PALETTE_MIME, def.type);
        e.dataTransfer.effectAllowed = "copy";
        setDragging(true);
        set({ dragType: def.type, hoverId: null });
      }}
      onDragEnd={() => {
        setDragging(false);
        set({ dragType: null });
      }}
      onClick={() => addBlock(def.type)}
      title={entry.hint}
      className={cn(
        "flex min-h-20 cursor-grab flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background p-2 text-center text-xs font-semibold text-foreground transition-colors hover:border-accent hover:bg-muted active:cursor-grabbing",
        dragging && "opacity-50",
      )}
    >
      {Icon && <Icon className="size-5 text-link" aria-hidden="true" />}
      {entry.label}
    </button>
  );
}

function AddTab() {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const q = query.trim().toLowerCase();
  const entries = BLOCKS.filter((d) => !q || `${blockName(d.type).label} ${blockName(d.type).hint}`.toLowerCase().includes(q));
  return (
    <div className="p-3">
      <label htmlFor={searchId} className="sr-only">
        {T.left.search}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" aria-hidden="true" />
        <input id={searchId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={T.left.search} className="min-h-10 w-full rounded-lg border border-border-strong bg-card ps-9 pe-3 text-sm text-foreground placeholder:text-subtle-foreground" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{T.left.dragHint}</p>
      {entries.length === 0 && <p className="mt-6 text-sm text-muted-foreground">{T.left.noMatch}</p>}
      {GROUPS.map((group) => {
        const items = entries.filter((e) => e.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="mt-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {BUILDER_TEXT.groups[group]} ({items.length})
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {items.map((def) => (
                <PaletteTile key={def.type} def={def} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** A short description of a block for the Layers list: its first heading, where it shows one. */
export function blockSummary(block: Block): string {
  const p = prepareBlock(block);
  return (p !== null && blockDef(block.type)?.headings?.(p, false)[0]?.text) || "";
}

function LayersTab() {
  const doc = useBuilder((s) => s.doc);
  const selectedId = useBuilder((s) => s.selectedId);
  const problems = useProblems();
  const select = useBuilder((s) => s.select);
  const nudge = useBuilder((s) => s.nudge);
  const canEdit = useBuilder((s) => s.canEdit);
  const rows = doc.blocks;
  if (rows.length === 0) return <p className="p-4 text-sm text-muted-foreground">{T.layersEmpty}</p>;
  return (
    <ul className="p-2">
      {rows.map((block) => {
        const def = blockDef(block.type);
        const entry = blockName(block.type);
        const Icon = def ? BLOCK_ICONS[def.icon] : undefined;
        const summary = blockSummary(block).trim();
        const selected = block.id === selectedId;
        return (
          <li key={block.id} className={cn("group flex items-center gap-1 rounded-lg", selected && "bg-accent/12")}>
            <button type="button" onClick={() => select(block.id)} aria-current={selected ? "true" : undefined} className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-start text-sm text-foreground hover:bg-muted">
              {Icon && <Icon className="size-4 shrink-0 text-link" aria-hidden="true" />}
              <span className="shrink-0 font-semibold">{entry.label}</span>
              {summary && <span className="truncate text-muted-foreground">{summary}</span>}
              {problems[block.id] && <span className="ms-auto size-2 shrink-0 rounded-full bg-danger" aria-label={T.problems.title} />}
            </button>
            {canEdit && (
              <span className="flex opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <button type="button" className={cn(iconButton, "size-8")} onClick={() => nudge(block.id, -1)} title={T.toolbar.up}>
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">{`${T.toolbar.up}: ${entry.label}`}</span>
                </button>
                <button type="button" className={cn(iconButton, "size-8")} onClick={() => nudge(block.id, 1)} title={T.toolbar.down}>
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">{`${T.toolbar.down}: ${entry.label}`}</span>
                </button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function LeftPanel() {
  const tab = useBuilder((s) => s.leftTab);
  const canEdit = useBuilder((s) => s.canEdit);
  const set = useBuilder((s) => s.set);
  const active = canEdit ? tab : "layers";
  return (
    <aside aria-label={T.left.label} className="flex w-72 shrink-0 flex-col border-e border-border bg-card">
      <div role="tablist" aria-label={T.left.label} className="grid grid-cols-2 gap-1 border-b border-border p-2">
        {(["add", "layers"] as const).map((id) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={active === id}
            disabled={id === "add" && !canEdit}
            onClick={() => set({ leftTab: id })}
            className="min-h-9 rounded-lg text-sm font-semibold text-muted-foreground aria-selected:bg-muted aria-selected:text-foreground disabled:opacity-40"
          >
            {T.left[id]}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{active === "add" ? <AddTab /> : <LayersTab />}</div>
    </aside>
  );
}
