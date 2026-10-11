"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Badge from "@/components/ui/Badge";
import Dialog from "@/components/ui/Dialog";
import { ANNOUNCEMENTS_TEXT } from "@/content/portal-strings";
import { deleteAnnouncementAction, setAnnouncementActiveAction } from "@/lib/portal/actions/announcements";
import type { AnnouncementView } from "@/lib/portal/announcements";
import { formatDateTime } from "@/lib/portal/format";
import type { Result } from "@/lib/portal/result";
import { AnnouncementForm } from "./AnnouncementForm";
import { errorClass } from "./field-styles";

const T = ANNOUNCEMENTS_TEXT;

function phase(a: AnnouncementView, now: number): { label: string; variant: "success" | "neutral" | "warning" } {
  if (!a.active) return { label: T.activeOff, variant: "neutral" };
  if (a.startsAt && Date.parse(a.startsAt) > now) return { label: T.scheduled, variant: "warning" };
  if (a.endsAt && Date.parse(a.endsAt) <= now) return { label: T.ended, variant: "neutral" };
  return { label: T.activeOn, variant: "success" };
}

/** Announcement list with an active switch, edit and delete, plus the create/edit form. */
export function AnnouncementsManager({ items, now }: { items: AnnouncementView[]; now: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AnnouncementView | null>(null);
  const [deleting, setDeleting] = useState<AnnouncementView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nowMs = Date.parse(now);

  function run(op: () => Promise<Result<unknown>>) {
    setError(null);
    startTransition(async () => {
      const res = await op();
      if (!res.ok) setError(res.error);
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <section aria-label={T.title}>
        <p role="alert" className={error ? errorClass : "sr-only"}>
          {error ?? ""}
        </p>
        {items.length === 0 ? (
          <p className="surface p-6 text-muted-foreground">{T.empty}</p>
        ) : (
          <ul className="grid gap-3">
            {items.map((a) => {
              const p = phase(a, nowMs);
              return (
                <li key={a.id} className="surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 break-words font-semibold text-foreground">{a.message}</p>
                    <Badge variant={p.variant}>{p.label}</Badge>
                  </div>
                  {a.linkUrl && <p className="mt-1 break-all text-sm text-link">{a.linkUrl}</p>}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {a.startsAt ? `${T.from} ${formatDateTime(a.startsAt)}` : ""} {a.endsAt ? `${T.until} ${formatDateTime(a.endsAt)}` : T.always}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={a.active}
                      disabled={pending}
                      onClick={() => run(() => setAnnouncementActiveAction(a.id, !a.active))}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-foreground"
                    >
                      <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition-colors ${a.active ? "bg-success" : "bg-border-strong"}`}>
                        <span className={`absolute top-0.5 size-5 rounded-full bg-card transition-all ${a.active ? "start-[1.375rem]" : "start-0.5"}`} />
                      </span>
                      {T.fields.active}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(a)}>
                      {T.edit}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm text-danger" disabled={pending} onClick={() => setDeleting(a)}>
                      {T.delete}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <AnnouncementForm key={editing?.id ?? "new"} editing={editing} onDone={() => setEditing(null)} />

      <Dialog open={deleting !== null} onClose={() => setDeleting(null)} title={T.deleteConfirm} description={deleting?.message}>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDeleting(null)}>
            {T.cancelEdit}
          </button>
          <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => deleting && run(() => deleteAnnouncementAction(deleting.id))}>
            {T.delete}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
