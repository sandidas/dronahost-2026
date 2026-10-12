"use client";

import { ArrowLeft, Check, Cloud, ExternalLink, Eye, Loader2, Monitor, PencilLine, Redo2, Smartphone, Tablet, TriangleAlert, Undo2, type LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";
import { useBuilder, useHistory, type Device, type SaveState } from "./store";

const T = BUILDER_TEXT.ui;

const SAVE_ICON: Record<SaveState, LucideIcon> = { new: Cloud, saved: Check, dirty: Cloud, saving: Loader2, error: TriangleAlert };
const DEVICES: { id: Device; icon: LucideIcon }[] = [
  { id: "desktop", icon: Monitor },
  { id: "tablet", icon: Tablet },
  { id: "phone", icon: Smartphone },
];

export const iconButton =
  "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-muted aria-pressed:text-foreground";

type Props = { onSave: () => void; onPublish: () => void; problemCount: number };

/** Back link, title and status, save state, undo and redo, preview widths, and the save and publish buttons. */
export function TopBar({ onSave, onPublish, problemCount }: Props) {
  const { canUndo, canRedo, undo, redo } = useHistory();
  const title = useBuilder((s) => s.meta.title);
  const kind = useBuilder((s) => s.kind);
  const slug = useBuilder((s) => s.meta.slug);
  const postId = useBuilder((s) => s.postId);
  const status = useBuilder((s) => s.status);
  const locked = useBuilder((s) => s.locked);
  const saveState = useBuilder((s) => s.saveState);
  const canEdit = useBuilder((s) => s.canEdit);
  const isAdmin = useBuilder((s) => s.isAdmin);
  const preview = useBuilder((s) => s.preview);
  const device = useBuilder((s) => s.device);
  const set = useBuilder((s) => s.set);
  const SaveIcon = SAVE_ICON[saveState];
  const published = status === "published";
  const livePath = kind === "page" ? `/${slug}` : `/blog/${slug}`;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-2 sm:px-3">
      <Link href="/dashboard/posts" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span className="hidden lg:inline">{T.back}</span>
      </Link>
      <div className="min-w-0 flex-1 border-s border-border ps-3">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-semibold text-foreground">{title.trim() || T.newTitle[kind]}</h1>
          <Badge variant={published ? "success" : "neutral"}>{published ? T.status.published : T.status.draft}</Badge>
          {locked && <Badge variant="warning">{T.status.locked}</Badge>}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground" role="status" aria-live="polite">
          <SaveIcon className={cn("size-3.5", saveState === "saving" && "animate-spin", saveState === "error" && "text-danger")} aria-hidden="true" />
          {T.save[saveState]}
        </p>
      </div>

      <div className="hidden items-center gap-1 md:flex" role="group" aria-label={T.devices.label}>
        {preview &&
          DEVICES.map(({ id, icon: Icon }) => (
            <button key={id} type="button" className={iconButton} aria-pressed={device === id} onClick={() => set({ device: id })} title={T.devices[id]}>
              <Icon className="size-4" aria-hidden="true" />
              <span className="sr-only">{T.devices[id]}</span>
            </button>
          ))}
      </div>

      {canEdit && !preview && (
        <div className="flex items-center">
          <button type="button" className={iconButton} onClick={undo} disabled={!canUndo} title={`${T.actions.undo} (Ctrl+Z)`}>
            <Undo2 className="size-4" aria-hidden="true" />
            <span className="sr-only">{T.actions.undo}</span>
          </button>
          <button type="button" className={iconButton} onClick={redo} disabled={!canRedo} title={`${T.actions.redo} (Ctrl+Shift+Z)`}>
            <Redo2 className="size-4" aria-hidden="true" />
            <span className="sr-only">{T.actions.redo}</span>
          </button>
        </div>
      )}

      <button
        type="button"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
        onClick={() => set({ preview: !preview })}
        disabled={!postId}
        title={postId ? undefined : T.previewSaveFirst}
        aria-pressed={preview}
      >
        {preview ? <PencilLine className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        <span className="hidden sm:inline">{preview ? T.actions.edit : T.actions.preview}</span>
      </button>

      {published && (
        <a href={livePath} target="_blank" rel="noreferrer" className={iconButton} title={T.actions.viewLive}>
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">{T.actions.viewLive}</span>
        </a>
      )}

      {canEdit && (
        <button
          type="button"
          onClick={onSave}
          disabled={saveState === "saving" || saveState === "saved"}
          className={cn(
            "inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-semibold disabled:opacity-50",
            isAdmin && !published ? "border border-border text-foreground hover:bg-muted" : "bg-action text-action-foreground hover:bg-action-hover",
          )}
        >
          {published ? T.actions.update : postId ? T.actions.save : T.actions.saveDraft}
        </button>
      )}
      {isAdmin && !published && (
        <button type="button" onClick={onPublish} disabled={saveState === "saving" || !title.trim()} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-action px-3 text-sm font-semibold text-action-foreground hover:bg-action-hover disabled:opacity-50">
          {T.actions.publish}
          {problemCount > 0 && <span className="rounded-full bg-danger-surface px-1.5 text-xs text-danger">{problemCount}</span>}
        </button>
      )}
    </header>
  );
}
