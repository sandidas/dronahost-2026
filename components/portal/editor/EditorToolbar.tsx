"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  Heading4,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  SquareCode,
  SquarePlay,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { lowlight } from "@/lib/editor/extensions";
import { cn } from "@/utils/cn";
import { UrlPanel, type UrlMode } from "./UrlPanel";

type Tool = { key: string; label: string; icon: LucideIcon; run: () => void; active?: boolean; disabled?: boolean };

const LANGUAGES = lowlight.listLanguages().sort();
const B = EDITOR_TEXT.buttons;

function ToolButton({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <button
      type="button"
      title={tool.label}
      aria-label={tool.label}
      aria-pressed={tool.active === undefined ? undefined : tool.active}
      disabled={tool.disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={tool.run}
      className={cn(
        "flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
        tool.active && "bg-accent/15 text-foreground",
      )}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}

/** Formatting toolbar. Active states come from useEditorState so the bar re-renders only when they change. */
export function EditorToolbar({ editor, uploadEnabled }: { editor: Editor; uploadEnabled: boolean }) {
  const langId = useId();
  const [mode, setMode] = useState<UrlMode | null>(null);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      paragraph: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      codeBlock: e.isActive("codeBlock"),
      language: String(e.getAttributes("codeBlock").language ?? ""),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();

  const groups: Tool[][] = [
    [
      { key: "p", label: B.paragraph, icon: Pilcrow, active: s.paragraph, run: () => c().setParagraph().run() },
      { key: "h2", label: B.h2, icon: Heading2, active: s.h2, run: () => c().toggleHeading({ level: 2 }).run() },
      { key: "h3", label: B.h3, icon: Heading3, active: s.h3, run: () => c().toggleHeading({ level: 3 }).run() },
      { key: "h4", label: B.h4, icon: Heading4, active: s.h4, run: () => c().toggleHeading({ level: 4 }).run() },
    ],
    [
      { key: "b", label: B.bold, icon: Bold, active: s.bold, run: () => c().toggleBold().run() },
      { key: "i", label: B.italic, icon: Italic, active: s.italic, run: () => c().toggleItalic().run() },
      { key: "u", label: B.underline, icon: Underline, active: s.underline, run: () => c().toggleUnderline().run() },
      { key: "s", label: B.strike, icon: Strikethrough, active: s.strike, run: () => c().toggleStrike().run() },
    ],
    [
      { key: "ul", label: B.bulletList, icon: List, active: s.bulletList, run: () => c().toggleBulletList().run() },
      { key: "ol", label: B.orderedList, icon: ListOrdered, active: s.orderedList, run: () => c().toggleOrderedList().run() },
      { key: "q", label: B.quote, icon: Quote, active: s.quote, run: () => c().toggleBlockquote().run() },
      { key: "code", label: B.codeBlock, icon: SquareCode, active: s.codeBlock, run: () => c().toggleCodeBlock().run() },
    ],
    [
      { key: "link", label: B.link, icon: LinkIcon, active: s.link, run: () => setMode(mode === "link" ? null : "link") },
      { key: "img", label: B.image, icon: ImageIcon, run: () => setMode(mode === "image" ? null : "image") },
      { key: "yt", label: B.youtube, icon: SquarePlay, run: () => setMode(mode === "youtube" ? null : "youtube") },
    ],
    [
      { key: "undo", label: B.undo, icon: Undo2, disabled: !s.canUndo, run: () => c().undo().run() },
      { key: "redo", label: B.redo, icon: Redo2, disabled: !s.canRedo, run: () => c().redo().run() },
    ],
  ];

  return (
    <div className="sticky top-0 z-10 rounded-t-2xl border-b border-border bg-card">
      <div role="toolbar" aria-label={EDITOR_TEXT.toolbarLabel} className="flex flex-wrap items-center gap-1 p-2">
        {groups.map((group, i) => (
          <div key={i} className={cn("flex items-center gap-0.5", i > 0 && "border-s border-border ps-1")}>
            {group.map((tool) => (
              <ToolButton key={tool.key} tool={tool} />
            ))}
          </div>
        ))}
        {s.codeBlock && (
          <div className="flex items-center gap-2 border-s border-border ps-2">
            <label htmlFor={langId} className="text-sm text-muted-foreground">
              {EDITOR_TEXT.codeLanguage}
            </label>
            <select
              id={langId}
              value={s.language}
              onChange={(e) => c().updateAttributes("codeBlock", { language: e.target.value || null }).run()}
              className="h-11 rounded-lg border border-border-strong bg-card px-2 text-sm text-foreground"
            >
              <option value="">{EDITOR_TEXT.codeLanguageAuto}</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {mode && <UrlPanel key={mode} editor={editor} mode={mode} uploadEnabled={uploadEnabled} onDone={() => setMode(null)} />}
    </div>
  );
}
