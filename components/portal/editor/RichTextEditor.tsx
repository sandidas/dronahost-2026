"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import { useEffect, useMemo } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { blogExtensions } from "@/lib/editor/extensions";
import { EditorToolbar } from "./EditorToolbar";

type Props = {
  /** Tiptap JSON, or HTML for posts written before the portal. */
  initialContent: JSONContent | string;
  editable: boolean;
  onChange: (doc: JSONContent) => void;
  uploadEnabled: boolean;
  /** Id of the visible label, for the editing surface's accessible name. */
  labelledBy: string;
};

/**
 * Tiptap editor with the blog extension set (lib/editor/extensions.ts), the same set the server renders with.
 * immediatelyRender is off so server rendering and hydration match; the editor mounts in the browser.
 */
export function RichTextEditor({ initialContent, editable, onChange, uploadEnabled, labelledBy }: Props) {
  const extensions = useMemo(() => [...blogExtensions(), Placeholder.configure({ placeholder: EDITOR_TEXT.placeholder })], []);
  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    immediatelyRender: false,
    editorProps: { attributes: { "aria-labelledby": labelledBy, "aria-multiline": "true", role: "textbox" } },
    // Reports the parsed document at once, so an older HTML post is saved as JSON even if it is not edited.
    onCreate: ({ editor: e }) => onChange(e.getJSON()),
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  return (
    <div className="portal-editor mt-2 rounded-2xl border border-border-strong bg-card">
      {editor && editable && <EditorToolbar editor={editor} uploadEnabled={uploadEnabled} />}
      {editor ? <EditorContent editor={editor} /> : <div className="min-h-[22rem] animate-pulse rounded-2xl bg-muted/40" aria-hidden="true" />}
    </div>
  );
}
