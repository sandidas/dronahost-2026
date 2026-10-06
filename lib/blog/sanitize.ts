import sanitizeHtml from "sanitize-html";
import type { TocItem } from "./types";

const slug = (s: string) => s.toLowerCase().replace(/&[a-z]+;/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
const stripTags = (s: string) => sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} });

/**
 * Sanitizes CMS HTML with an allow-list (no scripts, styles, iframes, forms or event handlers,
 * https/mailto links only), adds rel="noopener noreferrer" to external links, then gives h2 and
 * h3 headings stable ids and returns a table of contents. Output is safe to render as HTML.
 */
export function prepareArticle(raw: string): { html: string; toc: TocItem[] } {
  const clean = sanitizeHtml(raw, {
    allowedTags: ["h2", "h3", "h4", "p", "br", "hr", "a", "ul", "ol", "li", "strong", "em", "b", "i", "code", "pre", "blockquote", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "sup", "sub"],
    allowedAttributes: { a: ["href", "title", "rel"], img: ["src", "alt", "width", "height", "title"], th: ["scope"] },
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: (tag, attribs) => {
        const external = /^https:\/\//.test(attribs.href ?? "") && !/^https:\/\/(www\.)?dronahost\.com/.test(attribs.href ?? "");
        return { tagName: tag, attribs: { ...attribs, ...(external && { rel: "noopener noreferrer" }) } };
      },
      img: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, loading: "lazy", decoding: "async" } }),
    },
    allowedClasses: {},
  });

  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const html = clean.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level: string, inner: string) => {
    const text = stripTags(inner).trim();
    let id = slug(text);
    const n = used.get(id) ?? 0;
    used.set(id, n + 1);
    if (n > 0) id = `${id}-${n}`;
    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html, toc };
}

export const plainText = (html: string): string => stripTags(html).replace(/\s+/g, " ").trim();
export const readingMinutes = (html: string): number => Math.max(1, Math.round(plainText(html).split(" ").length / 220));
