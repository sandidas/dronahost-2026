import { z } from "zod";
import { BUILDER_PROBLEMS } from "@/content/portal-strings";
import { docText, parseTiptapDoc, type TiptapDoc, type TiptapNode } from "@/lib/editor/schema";
import { isSafeImageSrc, isSafeLinkHref } from "@/lib/editor/urls";
import { youtubeId } from "./model";

/**
 * Block fields: one list per block (lib/builder/blocks) drives everything about its props.
 *
 *   propsSchema    what may be stored (sizes and shapes only, so a half-written draft always saves);
 *   fieldProblems  what a person must finish before publishing (a required field, a bad link, an image without alt text);
 *   the Block panel (components/builder/FieldControl.tsx) draws one control per field.
 *
 * The cleaning helpers below (text, link, image, ...) are what blocks use to prepare their props for display, so the
 * canvas and the public page show exactly the same thing. Client-safe.
 */

type Base = { key: string; label: string; help?: string };

export type Field =
  | (Base & { kind: "text"; max: number; required?: boolean; format?: "youtube" | "href" })
  | (Base & { kind: "textarea"; max: number; required?: boolean })
  | (Base & { kind: "select"; options: readonly { value: string | number; label: string }[] })
  | (Base & { kind: "toggle" })
  /** Stored as { src, alt }. The alt text is asked for with the image. */
  | (Base & { kind: "image"; required?: boolean })
  /** A button or link, stored as { label, href }. */
  | (Base & { kind: "link"; required?: boolean })
  | (Base & { kind: "strings"; max: number; itemMax: number; required?: boolean })
  /** Repeated items (cards, questions, images). `required`: at least one complete item. */
  | (Base & { kind: "list"; max: number; itemTitle: string; item: readonly Field[]; empty: () => Record<string, unknown>; required?: boolean })
  /** Formatted text, written on the canvas itself rather than in the Block panel. */
  | (Base & { kind: "richtext"; required?: boolean });

export type Props = Record<string, unknown>;
export type Cta = { label: string; href: string };
export type Img = { src: string; alt: string };

// ─── Cleaning for display ─────────────────────────────────────────────────────

export const text = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** A button shows only with a label and a safe link (a site path, https://, http:// or mailto:). */
export const link = (v: unknown): Cta | undefined => {
  const c = v as Partial<Cta> | undefined;
  const label = text(c?.label);
  const href = text(c?.href);
  return label && href && isSafeLinkHref(href) ? { label, href } : undefined;
};

export const image = (v: unknown): Img | undefined => {
  const i = v as Partial<Img> | undefined;
  const src = text(i?.src);
  return src && isSafeImageSrc(src) ? { src, alt: text(i?.alt) ?? "" } : undefined;
};

/** A list of short texts: empty entries dropped, and an exact repeat shown once (the site's lists key items by their text). */
export const strings = (v: unknown): string[] => (Array.isArray(v) ? [...new Set(v.map(text).filter((s): s is string => Boolean(s)))] : []);

/** A stored choice, or the first option when it is missing or no longer offered. */
export const pick = <T extends string | number>(v: unknown, allowed: readonly T[], fallback: T): T => ((allowed as readonly unknown[]).includes(v) ? (v as T) : fallback);

/** Rich text with something in it: Tiptap JSON with words, or an older post's HTML. */
export const richtext = (v: unknown): TiptapDoc | string | undefined => {
  if (typeof v === "string") return v.trim() ? v : undefined;
  if (v && typeof v === "object" && (v as TiptapDoc).type === "doc") return docText(v as TiptapDoc).trim() ? (v as TiptapDoc) : undefined;
  return undefined;
};

/** A text field's value is there and, for addresses, usable. */
function formatOk(field: Extract<Field, { kind: "text" }>, v: string | undefined): boolean {
  if (!v) return false;
  if (field.format === "youtube") return youtubeId(v) !== null;
  if (field.format === "href") return isSafeLinkHref(v);
  return true;
}

/** Whether a field holds something that will show. Used for required fields and to decide which list items are complete. */
function filled(field: Field, v: unknown): boolean {
  switch (field.kind) {
    case "text":
      return formatOk(field, text(v));
    case "textarea":
      return Boolean(text(v));
    case "image":
      return Boolean(image(v)?.alt);
    case "link":
      return Boolean(link(v));
    case "strings":
      return strings(v).length > 0;
    case "list":
      return completeItems(field, v).length > 0;
    case "richtext":
      return richtext(v) !== undefined;
    case "select":
    case "toggle":
      return true;
  }
}

/** The items of a list whose required fields are all filled in. Incomplete items are left off the page. */
export function completeItems(field: Extract<Field, { kind: "list" }>, v: unknown): Props[] {
  if (!Array.isArray(v)) return [];
  return v.filter((item): item is Props => Boolean(item) && typeof item === "object" && field.item.every((f) => !("required" in f && f.required) || filled(f, (item as Props)[f.key])));
}

// ─── What may be stored ───────────────────────────────────────────────────────

const RICH_MAX = 512 * 1024;
const tiptap = z.record(z.string(), z.unknown()).superRefine((doc, ctx) => {
  const res = parseTiptapDoc(doc);
  if (!res.ok) ctx.addIssue({ code: "custom", message: res.error });
});

function fieldSchema(field: Field): z.ZodType {
  switch (field.kind) {
    case "text":
    case "textarea":
      return z.string().max(field.max);
    case "select": {
      const values = field.options.map((o) => o.value);
      return z.custom<string | number>((v) => values.includes(v as never));
    }
    case "toggle":
      return z.boolean();
    case "image":
      return z.strictObject({ src: z.string().max(2048), alt: z.string().max(200) });
    case "link":
      return z.strictObject({ label: z.string().max(60), href: z.string().max(2048) });
    case "strings":
      return z.array(z.string().max(field.itemMax)).max(field.max);
    case "list":
      return z.array(propsSchema(field.item)).max(field.max);
    case "richtext":
      return z.union([z.string().max(RICH_MAX), tiptap]);
  }
}

/** The stored shape of a block's props: every field optional, nothing else allowed. */
export function propsSchema(fields: readonly Field[]): z.ZodObject {
  return z.strictObject(Object.fromEntries(fields.map((f) => [f.key, fieldSchema(f).optional()])));
}

// ─── What to finish before publishing ─────────────────────────────────────────

const P = BUILDER_PROBLEMS.section;

/** Typed something into a link (so a broken one is worth mentioning, not just left out). */
const started = (v: unknown) => {
  const c = v as Partial<Cta> | undefined;
  return Boolean(text(c?.label) || text(c?.href));
};

/** Whether anything at all was written in a field (choices and switches do not count). */
function typed(field: Field, v: unknown): boolean {
  switch (field.kind) {
    case "link":
      return started(v);
    case "image":
      return Boolean(text((v as Partial<Img> | undefined)?.src) || text((v as Partial<Img> | undefined)?.alt));
    case "strings":
      return strings(v).length > 0;
    case "list":
      return Array.isArray(v) && v.length > 0;
    case "richtext":
      return richtext(v) !== undefined;
    case "select":
    case "toggle":
      return false;
    default:
      return Boolean(text(v));
  }
}

/** Everything that would be missing or left out on the live page, in the words of the Block panel. */
export function fieldProblems(fields: readonly Field[], props: unknown, prefix = ""): string[] {
  const p = (props && typeof props === "object" ? props : {}) as Props;
  const out: string[] = [];
  for (const field of fields) {
    const v = p[field.key];
    const label = prefix ? `${prefix}: ${field.label}` : field.label;
    const required = "required" in field && field.required === true;
    switch (field.kind) {
      case "link":
        if (started(v) && !link(v)) out.push(P.badLink(label));
        else if (required && !link(v)) out.push(P.missing(label));
        break;
      case "image": {
        const src = text((v as Partial<Img> | undefined)?.src);
        if (src && !image(v)) out.push(P.badImage(label));
        else if (src && !text((v as Partial<Img>).alt)) out.push(P.imageAlt(label));
        else if (required && !src) out.push(P.missing(label));
        break;
      }
      case "text":
        if (text(v) && !formatOk(field, text(v))) out.push(field.format === "youtube" ? P.badVideo(label) : P.badHref(label));
        else if (required && !filled(field, v)) out.push(P.missing(label));
        break;
      case "list": {
        const items = Array.isArray(v) ? v : [];
        items.forEach((item, i) => {
          const name = `${field.itemTitle} ${i + 1}`;
          const inner = fieldProblems(field.item, item, name);
          // An item nobody has started is ignored; a started one names what it still needs.
          if (field.item.some((f) => typed(f, (item as Props | undefined)?.[f.key]))) out.push(...inner);
        });
        if (required && !filled(field, v)) out.push(P.noItems(label));
        break;
      }
      case "strings":
        if (required && !filled(field, v)) out.push(P.noItems(label));
        break;
      default:
        if (required && !filled(field, v)) out.push(P.missing(label));
    }
  }
  return out;
}

// ─── Reading and writing props ────────────────────────────────────────────────

/** Rich text as plain text, one line per paragraph, heading or list item (so a heading never runs into a sentence). */
function lines(node: TiptapNode): string {
  if (node.type === "text") return node.text ?? "";
  const inner = (node.content ?? []).map(lines).join("");
  return node.type === "paragraph" || node.type === "heading" ? `${inner}\n` : inner;
}

/** The text of a block's props for reading time and search checks: words people read, not addresses or settings. */
export function fieldText(fields: readonly Field[], props: unknown): string {
  const p = (props && typeof props === "object" ? props : {}) as Props;
  const parts: string[] = [];
  for (const f of fields) {
    const v = p[f.key];
    if (f.kind === "text" && !f.format) parts.push(text(v) ?? "");
    else if (f.kind === "textarea") parts.push(text(v) ?? "");
    else if (f.kind === "link") parts.push(link(v)?.label ?? "");
    else if (f.kind === "image") parts.push(image(v)?.alt ?? "");
    else if (f.kind === "strings") parts.push(...strings(v));
    else if (f.kind === "list") completeItems(f, v).forEach((item) => parts.push(fieldText(f.item, item)));
    else if (f.kind === "richtext") {
      const r = richtext(v);
      parts.push(typeof r === "string" ? r.replace(/<\/(?:p|h[1-6]|li|blockquote)>/gi, "\n").replace(/<[^>]+>/g, " ") : r ? lines(r) : "");
    }
  }
  return parts.filter(Boolean).join(" ");
}

/** Every image a block shows, with its alt text (the SEO checklist asks that each has one). */
export function fieldImages(fields: readonly Field[], props: unknown): Img[] {
  const p = (props && typeof props === "object" ? props : {}) as Props;
  return fields.flatMap((f) => {
    if (f.kind === "image") {
      const i = image(p[f.key]);
      return i ? [i] : [];
    }
    if (f.kind === "list") return (Array.isArray(p[f.key]) ? (p[f.key] as Props[]) : []).flatMap((item) => fieldImages(f.item, item));
    return [];
  });
}

/** Starting props: each select at its first option, each toggle off, everything else empty. */
export function emptyProps(fields: readonly Field[]): Props {
  const out: Props = {};
  for (const f of fields) {
    if (f.kind === "select") out[f.key] = f.options[0]?.value;
  }
  return out;
}
