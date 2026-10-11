import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import { toHtml } from "hast-util-to-html";
import sanitizeHtml from "sanitize-html";
import { EDITOR_TEXT } from "@/content/portal-strings";
import { blogExtensions, lowlight } from "./extensions";
import { EMBED_HOSTS, isAllowedEmbedSrc } from "./urls";
import type { TiptapDoc } from "./schema";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Code blocks are highlighted on the server with the same lowlight grammars the editor uses. */
function renderCodeBlock(text: string, language: unknown): string {
  const lang = typeof language === "string" && lowlight.registered(language) ? language : null;
  const body = lang ? toHtml(lowlight.highlight(lang, text)) : escapeHtml(text);
  return `<pre><code class="hljs${lang ? ` language-${lang}` : ""}">${body}</code></pre>`;
}

/**
 * Staff write this content and visitors read it, so it is untrusted. The allow-list keeps formatting, links
 * (http, https, mailto, site paths), images and YouTube embeds, and drops scripts, styles, event handlers and
 * every other iframe.
 */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "h4", "p", "br", "hr", "a", "ul", "ol", "li", "strong", "em", "u", "s", "code", "pre", "blockquote", "img", "div", "iframe", "span"],
    allowedAttributes: {
      a: ["href", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "title", "loading", "referrerpolicy"],
      div: ["data-youtube-video"],
      ol: ["start"],
    },
    allowedClasses: { code: ["hljs", "language-*"], span: ["hljs-*"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"], iframe: ["https"] },
    allowProtocolRelative: false,
    allowedIframeHostnames: [...EMBED_HOSTS],
    exclusiveFilter: (frame) => frame.tag === "iframe" && !isAllowedEmbedSrc(frame.attribs.src ?? ""),
    transformTags: {
      a: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, rel: "noopener noreferrer nofollow" } }),
      img: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
      iframe: (tag, attribs) => ({
        tagName: tag,
        attribs: { ...attribs, title: EDITOR_TEXT.videoTitle, loading: "lazy", referrerpolicy: "strict-origin-when-cross-origin" },
      }),
    },
  });
}

/** Tiptap JSON to sanitised HTML, using the editor's own extension set. */
export function renderTiptapHtml(doc: TiptapDoc): string {
  const raw = renderToHTMLString({
    content: doc,
    extensions: blogExtensions(),
    options: {
      nodeMapping: {
        codeBlock: ({ node }) => renderCodeBlock(node.textContent, node.attrs.language),
      },
    },
  });
  return sanitizeRichHtml(raw);
}
