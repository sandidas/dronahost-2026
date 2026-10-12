"use client";

import type { JSONContent } from "@tiptap/react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { EDITOR_TEXT, POST_FORM_TEXT } from "@/content/portal-strings";
import { savePostAction } from "@/lib/portal/actions/posts";
import { slugify } from "@/lib/portal/slug";
import { errorClass, helpClass, inputClass, labelClass } from "./field-styles";
import { RichTextEditor } from "./editor/RichTextEditor";
import { uploadImage } from "./editor/upload-image";
import { PORTAL_HOME } from "./PortalShell";

export type PostFormValues = { id: string | null; title: string; slug: string; excerpt: string; coverImage: string; content: JSONContent | string; status: "draft" | "published"; locked: boolean };

type Props = { post: PostFormValues; canEdit: boolean; isAdmin: boolean; uploadEnabled: boolean };

/** Create and edit form shared by both portals. Read-only (with a notice) when the post is locked for this person. */
export function PostForm({ post, canEdit, isAdmin, uploadEnabled }: Props) {
  const id = useId();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(post.id !== null);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [coverImage, setCoverImage] = useState(post.coverImage);
  const [content, setContent] = useState<JSONContent | string>(post.content);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const readOnly = !canEdit;

  function save() {
    setMessage(null);
    startTransition(async () => {
      // Sent as a JSON string: the server parses and validates it (lib/editor/schema.ts) before storing it as a document.
      const res = await savePostAction(post.id, { title, slug, excerpt, coverImage, content: typeof content === "string" ? content : JSON.stringify(content) });
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        setMessage({ kind: "error", text: res.error });
        return;
      }
      setErrors({});
      setSlug(res.data.slug);
      if (post.id === null) {
        router.push(`${PORTAL_HOME}/posts/${res.data.id}`);
        return;
      }
      setMessage({ kind: "ok", text: POST_FORM_TEXT.saved });
      router.refresh();
    });
  }

  async function onCoverFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const res = await uploadImage(file);
    setUploading(false);
    if ("error" in res) setErrors((e) => ({ ...e, coverImage: res.error }));
    else setCoverImage(res.url);
  }

  const field = (name: string) => ({
    id: `${id}-${name}`,
    disabled: readOnly,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `${id}-${name}-help ${id}-${name}-err`,
  });
  const err = (name: string) => (
    <p id={`${id}-${name}-err`} className={errors[name] ? errorClass : "sr-only"}>
      {errors[name] ?? ""}
    </p>
  );

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!readOnly) save();
      }}
    >
      {post.locked && !canEdit && (
        <div role="note" className="flex gap-3 rounded-xl border border-warning/30 bg-warning-surface p-4 text-warning">
          <Lock className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{POST_FORM_TEXT.lockedLabel}</p>
            <p className="mt-1 text-sm">{POST_FORM_TEXT.lockedBody}</p>
          </div>
        </div>
      )}
      {canEdit && post.status === "published" && <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">{POST_FORM_TEXT.publishedLive}</p>}

      <div>
        <label htmlFor={`${id}-title`} className={labelClass}>
          {POST_FORM_TEXT.fields.title}
        </label>
        <input
          {...field("title")}
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={`${inputClass} h-12 text-lg font-semibold`}
        />
        {err("title")}
      </div>

      <div>
        <label htmlFor={`${id}-slug`} className={labelClass}>
          {POST_FORM_TEXT.fields.slug}
        </label>
        <input
          {...field("slug")}
          type="text"
          maxLength={120}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value.toLowerCase());
          }}
          className={`${inputClass} h-11`}
        />
        <p id={`${id}-slug-help`} className={helpClass}>
          {POST_FORM_TEXT.fields.slugHelp}
        </p>
        {err("slug")}
      </div>

      <div>
        <label htmlFor={`${id}-excerpt`} className={labelClass}>
          {POST_FORM_TEXT.fields.excerpt}
        </label>
        <textarea {...field("excerpt")} rows={3} maxLength={300} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={`${inputClass} py-3`} />
        <p id={`${id}-excerpt-help`} className={helpClass}>
          {POST_FORM_TEXT.fields.excerptHelp}
        </p>
        {err("excerpt")}
      </div>

      <div>
        <label htmlFor={`${id}-coverImage`} className={labelClass}>
          {POST_FORM_TEXT.fields.coverImage}
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <input {...field("coverImage")} type="url" inputMode="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={`${inputClass} h-11 min-w-0 flex-1`} />
          {uploadEnabled && !readOnly && (
            <>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => void onCoverFile(e.target.files?.[0])} />
              <button type="button" className="btn btn-secondary btn-sm" aria-busy={uploading} disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? EDITOR_TEXT.prompt.uploading : EDITOR_TEXT.prompt.upload}
              </button>
            </>
          )}
        </div>
        <p id={`${id}-coverImage-help`} className={helpClass}>
          {POST_FORM_TEXT.fields.coverImageHelp}
        </p>
        {err("coverImage")}
      </div>

      <div>
        <span id={`${id}-content-label`} className={labelClass}>
          {POST_FORM_TEXT.fields.content}
        </span>
        <RichTextEditor initialContent={post.content} editable={!readOnly} onChange={setContent} uploadEnabled={uploadEnabled} labelledBy={`${id}-content-label`} />
        {err("content")}
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary" aria-busy={pending} disabled={pending}>
            {pending ? POST_FORM_TEXT.saving : post.id === null || post.status === "draft" ? POST_FORM_TEXT.save : POST_FORM_TEXT.saveChanges}
          </button>
          {!isAdmin && <p className="text-sm text-muted-foreground">{POST_FORM_TEXT.draftNote}</p>}
        </div>
      )}
      <p role="status" aria-live="polite" className={message ? (message.kind === "ok" ? "text-sm font-medium text-success" : errorClass) : "sr-only"}>
        {message?.text ?? ""}
      </p>
    </form>
  );
}
