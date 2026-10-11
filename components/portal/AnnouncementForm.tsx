"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { ANNOUNCEMENTS_TEXT } from "@/content/portal-strings";
import { saveAnnouncementAction } from "@/lib/portal/actions/announcements";
import type { AnnouncementView } from "@/lib/portal/announcements";
import { errorClass, helpClass, inputClass, labelClass, panelClass } from "./field-styles";

const T = ANNOUNCEMENTS_TEXT;

/** ISO time to a datetime-local value in the browser's time zone, and back. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};
const toIso = (local: string) => (local ? new Date(local).toISOString() : "");

/** Create or edit one announcement. Times are entered in local time and stored in UTC. */
export function AnnouncementForm({ editing, onDone }: { editing: AnnouncementView | null; onDone: () => void }) {
  const id = useId();
  const router = useRouter();
  const [message, setMessage] = useState(editing?.message ?? "");
  const [linkUrl, setLinkUrl] = useState(editing?.linkUrl ?? "");
  const [startsAt, setStartsAt] = useState(() => toLocalInput(editing?.startsAt ?? null));
  const [endsAt, setEndsAt] = useState(() => toLocalInput(editing?.endsAt ?? null));
  const [active, setActive] = useState(editing?.active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const err = (name: string) => (
    <p id={`${id}-${name}-err`} className={errors[name] ? errorClass : "sr-only"}>
      {errors[name] ?? ""}
    </p>
  );

  return (
    <form
      aria-labelledby={`${id}-heading`}
      className={`${panelClass} self-start`}
      onSubmit={(e) => {
        e.preventDefault();
        setStatus(null);
        startTransition(async () => {
          const res = await saveAnnouncementAction(editing?.id ?? null, { message, linkUrl, startsAt: toIso(startsAt), endsAt: toIso(endsAt), active });
          if (!res.ok) {
            setErrors(res.fieldErrors ?? { form: res.error });
            return;
          }
          setErrors({});
          setStatus(T.saved);
          if (!editing) {
            setMessage("");
            setLinkUrl("");
            setStartsAt("");
            setEndsAt("");
          }
          onDone();
          router.refresh();
        });
      }}
    >
      <h2 id={`${id}-heading`} className="t-h4 text-foreground">
        {editing ? T.editHeading : T.formHeading}
      </h2>
      <div className="mt-4 grid gap-4">
        <div>
          <label htmlFor={`${id}-message`} className={labelClass}>
            {T.fields.message}
          </label>
          <textarea
            id={`${id}-message`}
            required
            rows={3}
            maxLength={280}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={`${id}-message-help ${id}-message-err`}
            className={`${inputClass} py-3`}
          />
          <p id={`${id}-message-help`} className={helpClass}>
            {T.fields.messageHelp} {message.length}/280
          </p>
          {err("message")}
        </div>
        <div>
          <label htmlFor={`${id}-link`} className={labelClass}>
            {T.fields.link}
          </label>
          <input
            id={`${id}-link`}
            type="text"
            inputMode="url"
            maxLength={2048}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            aria-invalid={errors.linkUrl ? true : undefined}
            aria-describedby={`${id}-link-help ${id}-linkUrl-err`}
            className={`${inputClass} h-11`}
          />
          <p id={`${id}-link-help`} className={helpClass}>
            {T.fields.linkHelp}
          </p>
          {err("linkUrl")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <label htmlFor={`${id}-start`} className={labelClass}>
              {T.fields.startsAt}
            </label>
            <input id={`${id}-start`} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} aria-describedby={`${id}-time-help`} className={`${inputClass} h-11`} />
            {err("startsAt")}
          </div>
          <div>
            <label htmlFor={`${id}-end`} className={labelClass}>
              {T.fields.endsAt}
            </label>
            <input
              id={`${id}-end`}
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              aria-invalid={errors.endsAt ? true : undefined}
              aria-describedby={`${id}-time-help ${id}-endsAt-err`}
              className={`${inputClass} h-11`}
            />
            {err("endsAt")}
          </div>
        </div>
        <p id={`${id}-time-help`} className={helpClass}>
          {T.fields.timeHelp}
        </p>
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-foreground">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-5 accent-[var(--accent)]" />
          {T.fields.active}
        </label>
      </div>
      {err("form")}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={pending} aria-busy={pending}>
          {T.save}
        </button>
        {editing && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>
            {T.cancelEdit}
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className={status ? "mt-3 text-sm font-medium text-success" : "sr-only"}>
        {status ?? ""}
      </p>
    </form>
  );
}
