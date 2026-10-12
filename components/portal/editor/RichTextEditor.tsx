"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { blogExtensions } from "@/lib/editor/extensions";
import { EditorToolbar } from "./EditorToolbar";
// The editor carries its own content styles, so it looks the same in the portals and on /v2.
import "@/app/styles/rich-content.css";

type Props = {
  /** Tiptap JSON, or HTML for posts written before the portal. */
  initialContent: JSONContent | string;
  editable: boolean;
  onChange: (doc: JSONContent) => void;
  uploadEnabled: boolean;
  /** Id of the visible label, for the editing surface's accessible name. */
  labelledBy: string;
  /** "inline": no frame and a short surface, for the page builder canvas. */
  variant?: "form" | "inline";
  /** Inline only: show the formatting toolbar (the builder shows it on the selected block). */
  toolbar?: boolean;
  /** Report the parsed document as soon as the editor opens (the post form uses this to convert older HTML posts). */
  reportInitial?: boolean;
};

/**
 * Tiptap editor with the blog extension set (lib/editor/extensions.ts), the same set the server renders with.
 * immediatelyRender is off so server rendering and hydration match; the editor mounts in the browser.
 */
export function RichTextEditor({ initialContent, editable, onChange, uploadEnabled, labelledBy, variant = "form", toolbar = true, reportInitial = true }: Props) {
  const extensions = useMemo(() => [...blogExtensions(), Placeholder.configure({ placeholder: EDITOR_TEXT.placeholder })], []);
  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    immediatelyRender: false,
    editorProps: { attributes: { "aria-labelledby": labelledBy, "aria-multiline": "true", role: "textbox" } },
    // Reports the parsed document at once, so an older HTML post is saved as JSON even if it is not edited.
    onCreate: ({ editor: e }) => {
      if (reportInitial) onChange(e.getJSON());
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  });

  useEffect(() => {
    // No update event: switching to read-only (or back) is not an edit.
    editor?.setEditable(editable, false);
  }, [editor, editable]);

  if (variant === "inline") {
    return (
      <div className="portal-editor portal-editor-inline">
        {editor && editable && toolbar && (
          <div className="builder-ui sticky top-0 z-10 mb-2 overflow-hidden rounded-xl border border-border-strong bg-card shadow-sm">
            <EditorToolbar editor={editor} uploadEnabled={uploadEnabled} />
          </div>
        )}
        {editor ? <EditorContent editor={editor} /> : <div className="min-h-16 animate-pulse rounded-xl bg-muted/40" aria-hidden="true" />}
      </div>
    );
  }
  return (
    <div className="portal-editor mt-2 rounded-2xl border border-border-strong bg-card">
      {editor && editable && <EditorToolbar editor={editor} uploadEnabled={uploadEnabled} />}
      {editor ? <EditorContent editor={editor} /> : <div className="min-h-[22rem] animate-pulse rounded-2xl bg-muted/40" aria-hidden="true" />}
    </div>
  );
}
