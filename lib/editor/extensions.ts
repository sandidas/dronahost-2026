import type { Extensions } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { isSafeLinkHref } from "./urls";

/** One lowlight instance with the common grammars, shared by the editor and the server renderer. */
export const lowlight = createLowlight(common);

export const HEADING_LEVELS = [2, 3, 4] as const;

/**
 * The extension set used by the editor and by the server renderer, so stored JSON always renders the
 * same way. Tiptap 3's StarterKit bundles Heading, Strike, Underline, Link and a plain CodeBlock: those
 * copies are switched off here and the standalone packages are registered once instead.
 */
export function blogExtensions(): Extensions {
  return [
    StarterKit.configure({ heading: false, strike: false, underline: false, link: false, codeBlock: false }),
    Heading.configure({ levels: [...HEADING_LEVELS] }),
    Strike,
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      isAllowedUri: (url) => isSafeLinkHref(url),
      HTMLAttributes: { rel: "noopener noreferrer nofollow", target: null },
    }),
    Image.configure({ inline: false, allowBase64: false }),
    Youtube.configure({ nocookie: true, controls: true, width: 640, height: 360 }),
    CodeBlockLowlight.configure({ lowlight, defaultLanguage: null }),
  ];
}
