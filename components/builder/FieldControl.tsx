"use client";

import { ArrowDown, ArrowUp, ChevronDown, Images, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useId, useState } from "react";
import { errorClass, helpClass, inputClass, labelClass } from "@/components/portal/field-styles";
import { uploadImage } from "@/components/portal/editor/upload-image";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { getAt, setAt, type Field } from "@/lib/builder/catalog";
import { cn } from "@/utils/cn";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { MediaLibrary } from "./MediaLibrary";
import { iconButton } from "./TopBar";

const F = BUILDER_TEXT.fields;

type Props = {
  field: Field;
  /** The object the field's path is read from (block props, or a site section). */
  data: unknown;
  onChange: (next: unknown) => void;
  readOnly: boolean;
  uploadEnabled: boolean;
};

const fieldInput = cn(inputClass, "min-h-10 px-3 text-sm");
const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

function Counter({ value, max, min, words }: { value: string; max: number; min?: number; words?: number }) {
  const tooLong = words ? wordCount(value) > words : value.length > max;
  const tooShort = min !== undefined && value.length > 0 && value.length < min;
  return (
    <span className={cn("text-xs tabular-nums", tooLong || tooShort ? "text-danger" : "text-subtle-foreground")}>
      {words ? `${wordCount(value)}/${words} ${F.words}` : `${value.length}/${max}`}
    </span>
  );
}

function TextField({ field, value, set, readOnly }: { field: Extract<Field, { kind: "text" | "textarea" }>; value: string; set: (v: string) => void; readOnly: boolean }) {
  const id = useId();
  const helpId = `${id}-help`;
  const common = {
    id,
    value,
    readOnly,
    maxLength: field.kind === "textarea" && field.words ? undefined : field.max,
    "aria-describedby": field.help ? helpId : undefined,
    onChange: (e: { target: { value: string } }) => set(e.target.value),
  };
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelClass}>
          {field.label}
        </label>
        <Counter value={value} max={field.max} min={field.min} words={field.kind === "textarea" ? field.words : undefined} />
      </div>
      {field.kind === "textarea" ? <textarea {...common} rows={field.words ? 5 : 3} className={cn(inputClass, "min-h-20 px-3 py-2 text-sm")} /> : <input {...common} type="text" className={fieldInput} />}
      {field.help && (
        <p id={helpId} className={helpClass}>
          {field.help}
        </p>
      )}
    </div>
  );
}

type ImagePickerProps = { label: string; help?: string; value: string; onChange: (url: string) => void; readOnly: boolean; uploadEnabled: boolean; preview?: boolean };

/**
 * An image: upload from the computer (to S3), choose one uploaded before, or paste an address. Upload and the library
 * need storage settings; without them the buttons stay visible but say why they are off.
 */
export function ImagePicker({ label, help, value, onChange, readOnly, uploadEnabled, preview = true }: ImagePickerProps) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [library, setLibrary] = useState(false);
  const M = BUILDER_TEXT.media;
  const button = "inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {preview && isSafeImageSrc(value) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 aspect-[16/9] w-full rounded-lg border border-border bg-muted object-cover" />
      )}
      {!readOnly && (
        <div className="mt-2 flex flex-wrap gap-2">
          <label className={cn(button, "cursor-pointer", (!uploadEnabled || busy) && "pointer-events-none opacity-50")} aria-disabled={!uploadEnabled || busy}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
            {busy ? M.uploading : M.upload}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={!uploadEnabled || busy}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setBusy(true);
                setError(null);
                const res = await uploadImage(file);
                setBusy(false);
                if ("url" in res) onChange(res.url);
                else setError(res.error);
              }}
            />
          </label>
          <button type="button" className={button} disabled={!uploadEnabled} onClick={() => setLibrary(true)}>
            <Images className="size-4" aria-hidden="true" />
            {M.library}
          </button>
          {value && (
            <button type="button" className={cn(button, "text-danger")} onClick={() => onChange("")}>
              <Trash2 className="size-4" aria-hidden="true" />
              {M.remove}
            </button>
          )}
        </div>
      )}
      {!uploadEnabled && !readOnly && <p className={helpClass}>{M.notConfigured}</p>}
      <label htmlFor={id} className="mt-3 block text-xs font-semibold text-muted-foreground">
        {M.address}
      </label>
      <input id={id} type="url" value={value} readOnly={readOnly} placeholder="https://" onChange={(e) => onChange(e.target.value.trim())} className={cn(fieldInput, "mt-1")} />
      {help && <p className={helpClass}>{help}</p>}
      {error && (
        <p className={errorClass} role="alert">
          {error}
        </p>
      )}
      {uploadEnabled && <MediaLibrary open={library} onClose={() => setLibrary(false)} onChoose={onChange} />}
    </div>
  );
}

function CtaField({ field, value, set, readOnly }: { field: Extract<Field, { kind: "cta" }>; value: { label?: string; href?: string } | undefined; set: (v: unknown) => void; readOnly: boolean }) {
  const id = useId();
  const current = { label: value?.label ?? "", href: value?.href ?? "" };
  const change = (patch: Partial<typeof current>) => {
    const next = { ...current, ...patch };
    // An optional action left empty is removed, so it does not fail the section's checks.
    set(field.optional && !next.label && !next.href ? undefined : next);
  };
  return (
    <fieldset className="rounded-xl border border-border p-3">
      <legend className="px-1 text-sm font-semibold text-foreground">{field.label}</legend>
      <label htmlFor={`${id}-label`} className="text-xs font-semibold text-muted-foreground">
        {F.ctaLabel}
      </label>
      <input id={`${id}-label`} value={current.label} readOnly={readOnly} maxLength={40} onChange={(e) => change({ label: e.target.value })} className={cn(fieldInput, "mt-1")} />
      <label htmlFor={`${id}-href`} className="mt-3 block text-xs font-semibold text-muted-foreground">
        {F.ctaHref}
      </label>
      <input id={`${id}-href`} value={current.href} readOnly={readOnly} placeholder="/pricing" onChange={(e) => change({ href: e.target.value.trim() })} className={cn(fieldInput, "mt-1")} />
      <p className={helpClass}>{F.ctaHrefHelp}</p>
    </fieldset>
  );
}

function StringsField({ field, value, set, readOnly }: { field: Extract<Field, { kind: "strings" }>; value: string[]; set: (v: unknown) => void; readOnly: boolean }) {
  const id = useId();
  const write = (next: string[]) => set(next.length ? next : undefined);
  return (
    <fieldset>
      <legend className={labelClass}>{field.label}</legend>
      <ul className="mt-2 space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <label htmlFor={`${id}-${i}`} className="sr-only">{`${field.label} ${i + 1}`}</label>
            <input id={`${id}-${i}`} value={item} readOnly={readOnly} maxLength={field.itemMax} onChange={(e) => write(value.map((v, j) => (j === i ? e.target.value : v)))} className={cn(fieldInput, "mt-0")} />
            {!readOnly && (
              <button type="button" className={iconButton} onClick={() => write(value.filter((_, j) => j !== i))} title={F.removeItem}>
                <Trash2 className="size-4" aria-hidden="true" />
                <span className="sr-only">{`${F.removeItem} ${i + 1}`}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {!readOnly && value.length < field.max && (
        <button type="button" onClick={() => write([...value, ""])} className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-link hover:bg-muted">
          <Plus className="size-4" aria-hidden="true" />
          {F.addItem}
        </button>
      )}
    </fieldset>
  );
}

function ListField({ field, value, set, readOnly, uploadEnabled }: { field: Extract<Field, { kind: "list" }>; value: Record<string, unknown>[]; set: (v: unknown) => void; readOnly: boolean; uploadEnabled: boolean }) {
  const id = useId();
  // Which items are open is the person's choice: typing never collapses an item. The first item starts open.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) => setOpen((prev) => (prev.has(i) ? new Set([...prev].filter((x) => x !== i)) : new Set([...prev, i])));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    set(next);
    // The open state follows the item that moved.
    setOpen((prev) => new Set([...prev].map((x) => (x === i ? j : x === j ? i : x))));
  };
  const remove = (i: number) => {
    set(value.filter((_, j) => j !== i));
    setOpen((prev) => new Set([...prev].filter((x) => x !== i).map((x) => (x > i ? x - 1 : x))));
  };
  const firstPath = field.item.find((f) => f.kind === "text" || f.kind === "textarea")?.path ?? "";
  return (
    <fieldset>
      <legend className={labelClass}>
        {field.label} ({value.length})
      </legend>
      <ol className="mt-2 space-y-2">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const summary = typeof item[firstPath] === "string" ? (item[firstPath] as string) : "";
          return (
            <li key={i} className="rounded-xl border border-border">
              <div className="flex min-h-10 items-center gap-1 ps-1 pe-1">
                <button type="button" onClick={() => toggle(i)} aria-expanded={isOpen} aria-controls={`${id}-${i}`} className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-start text-sm font-semibold text-foreground hover:bg-muted">
                  <ChevronDown className={cn("size-4 shrink-0 transition-transform", !isOpen && "-rotate-90")} aria-hidden="true" />
                  <span className="truncate">
                    {`${field.itemTitle} ${i + 1}`}
                    {summary && <span className="font-normal text-muted-foreground">{`: ${summary}`}</span>}
                  </span>
                </button>
                {!readOnly && (
                  <>
                    <button type="button" className={cn(iconButton, "size-8")} onClick={() => move(i, -1)} title={F.moveUp}>
                      <ArrowUp className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">{`${F.moveUp}: ${field.itemTitle} ${i + 1}`}</span>
                    </button>
                    <button type="button" className={cn(iconButton, "size-8")} onClick={() => move(i, 1)} title={F.moveDown}>
                      <ArrowDown className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">{`${F.moveDown}: ${field.itemTitle} ${i + 1}`}</span>
                    </button>
                    <button type="button" className={cn(iconButton, "size-8")} disabled={value.length <= field.min} onClick={() => remove(i)} title={F.removeItem}>
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">{`${F.removeItem}: ${field.itemTitle} ${i + 1}`}</span>
                    </button>
                  </>
                )}
              </div>
              {isOpen && (
                <div id={`${id}-${i}`} className="space-y-4 border-t border-border p-3">
                  {field.item.map((sub) => (
                    <FieldControl key={sub.path} field={sub} data={item} onChange={(nextItem) => set(value.map((v, j) => (j === i ? (nextItem as Record<string, unknown>) : v)))} readOnly={readOnly} uploadEnabled={uploadEnabled} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!readOnly && value.length < field.max && (
        <button
          type="button"
          onClick={() => {
            set([...value, field.empty()]);
            setOpen((prev) => new Set([...prev, value.length]));
          }}
          className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-link hover:bg-muted"
        >
          <Plus className="size-4" aria-hidden="true" />
          {`${F.addItem}: ${field.itemTitle}`}
        </button>
      )}
    </fieldset>
  );
}

function SelectField({ field, value, set, readOnly }: { field: Extract<Field, { kind: "select" }>; value: unknown; set: (v: unknown) => void; readOnly: boolean }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
      </label>
      <select
        id={id}
        value={String(value ?? "")}
        disabled={readOnly}
        onChange={(e) => {
          const option = field.options.find((o) => String(o.value) === e.target.value);
          // An optional choice left empty (for example "No icon") is removed from the data.
          if (option) set(field.optional && option.value === "" ? undefined : option.value);
        }}
        className={fieldInput}
      >
        {field.options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** One field of the Block panel. Reads `field.path` from `data` and reports the whole updated object. */
export function FieldControl({ field, data, onChange, readOnly, uploadEnabled }: Props) {
  const raw = getAt(data, field.path);
  const write = (v: unknown) => onChange(setAt(data, field.path, v));
  switch (field.kind) {
    case "text":
    case "textarea":
      return <TextField field={field} value={typeof raw === "string" ? raw : ""} readOnly={readOnly} set={(v) => write(field.optional && v === "" ? undefined : v)} />;
    case "select":
      return <SelectField field={field} value={raw} set={write} readOnly={readOnly} />;
    case "toggle":
      return (
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm font-semibold text-foreground">
          <input type="checkbox" checked={raw === true} disabled={readOnly} onChange={(e) => write(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          {field.label}
        </label>
      );
    case "image":
      return <ImagePicker label={field.label} help={field.help} value={typeof raw === "string" ? raw : ""} onChange={write} readOnly={readOnly} uploadEnabled={uploadEnabled} />;
    case "cta":
      return <CtaField field={field} value={raw as { label?: string; href?: string } | undefined} set={write} readOnly={readOnly} />;
    case "strings":
      return <StringsField field={field} value={Array.isArray(raw) ? (raw as string[]) : []} set={write} readOnly={readOnly} />;
    case "list":
      return <ListField field={field} value={Array.isArray(raw) ? (raw as Record<string, unknown>[]) : []} set={write} readOnly={readOnly} uploadEnabled={uploadEnabled} />;
  }
}
