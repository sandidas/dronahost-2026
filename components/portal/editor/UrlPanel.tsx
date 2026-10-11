"use client";

import type { Editor } from "@tiptap/react";
import { useId, useRef, useState } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { isSafeImageSrc, isSafeLinkHref, isYoutubeUrl } from "@/lib/editor/urls";
import { errorClass, helpClass, inputClass, labelClass } from "../field-styles";
import { uploadImage } from "./upload-image";

export type UrlMode = "link" | "image" | "youtube";

type Props = { editor: Editor; mode: UrlMode; uploadEnabled: boolean; onDone: () => void };

const LABEL: Record<UrlMode, string> = { link: EDITOR_TEXT.prompt.link, image: EDITOR_TEXT.prompt.image, youtube: EDITOR_TEXT.prompt.youtube };

/** Inline form under the toolbar for a link, an image or a YouTube address. Addresses are checked before insert. */
export function UrlPanel({ editor, mode, uploadEnabled, onDone }: Props) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(mode === "link" ? String(editor.getAttributes("link").href ?? "") : "");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function apply() {
    const value = url.trim();
    const chain = editor.chain().focus();
    if (mode === "link") {
      if (value === "") {
        chain.extendMarkRange("link").unsetLink().run();
        onDone();
        return;
      }
      if (!isSafeLinkHref(value)) return setError(EDITOR_TEXT.errors.link);
      if (editor.state.selection.empty && !editor.isActive("link")) {
        chain.insertContent({ type: "text", text: value, marks: [{ type: "link", attrs: { href: value } }] }).run();
      } else {
        chain.extendMarkRange("link").setLink({ href: value }).run();
      }
    } else if (mode === "image") {
      if (!isSafeImageSrc(value)) return setError(EDITOR_TEXT.errors.image);
      chain.setImage({ src: value, alt: alt.trim() }).run();
    } else {
      if (!isYoutubeUrl(value)) return setError(EDITOR_TEXT.errors.youtube);
      chain.setYoutubeVideo({ src: value }).run();
    }
    onDone();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const res = await uploadImage(file);
    setUploading(false);
    if ("error" in res) setError(res.error);
    else setUrl(res.url);
  }

  return (
    <div
      className="grid gap-3 border-b border-border bg-muted/50 p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onDone();
        if (e.key === "Enter") {
          e.preventDefault();
          apply();
        }
      }}
    >
      <div>
        <label htmlFor={`${id}-url`} className={labelClass}>
          {LABEL[mode]}
        </label>
        <input
          id={`${id}-url`}
          type="url"
          inputMode="url"
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-help ${id}-err`}
          className={`${inputClass} h-11`}
        />
        {mode === "link" && (
          <p id={`${id}-help`} className={helpClass}>
            {EDITOR_TEXT.prompt.linkHelp}
          </p>
        )}
      </div>
      {mode === "image" && (
        <div>
          <label htmlFor={`${id}-alt`} className={labelClass}>
            {EDITOR_TEXT.prompt.imageAlt}
          </label>
          <input id={`${id}-alt`} type="text" value={alt} maxLength={200} onChange={(e) => setAlt(e.target.value)} className={`${inputClass} h-11`} />
        </div>
      )}
      <p id={`${id}-err`} role="alert" className={error ? errorClass : "sr-only"}>
        {error ?? ""}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary btn-sm" onClick={apply} disabled={uploading}>
          {EDITOR_TEXT.prompt.apply}
        </button>
        {mode === "image" && uploadEnabled && (
          <>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void onFile(e.target.files?.[0])} />
            <button type="button" className="btn btn-secondary btn-sm" aria-busy={uploading} disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? EDITOR_TEXT.prompt.uploading : EDITOR_TEXT.prompt.upload}
            </button>
          </>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>
          {EDITOR_TEXT.prompt.cancel}
        </button>
      </div>
    </div>
  );
}
