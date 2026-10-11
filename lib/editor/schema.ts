import { z } from "zod";
import { isSafeImageSrc, isSafeLinkHref, isYoutubeUrl } from "./urls";

/**
 * Server-side check for Tiptap JSON before it is stored. MongoDB enforces no schema, so this is the schema:
 * only the node and mark types the editor offers, bounded size and depth, and safe URLs.
 */
export const NODE_TYPES = [
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "hardBreak",
  "horizontalRule",
  "image",
  "youtube",
] as const;

export const MARK_TYPES = ["bold", "italic", "underline", "strike", "code", "link"] as const;

export type TiptapMark = { type: (typeof MARK_TYPES)[number]; attrs?: Record<string, unknown> };
export type TiptapNode = {
  type: (typeof NODE_TYPES)[number];
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
};
export type TiptapDoc = TiptapNode & { type: "doc" };

const MAX_BYTES = 512 * 1024;
const MAX_NODES = 20_000;
const MAX_DEPTH = 24;
const MAX_CHILDREN = 5_000;

const Attrs = z.record(z.string().max(64), z.unknown()).optional();
const Mark = z.object({ type: z.enum(MARK_TYPES), attrs: Attrs });
const Node: z.ZodType<TiptapNode> = z.lazy(() =>
  z.object({
    type: z.enum(NODE_TYPES),
    attrs: Attrs,
    content: z.array(Node).max(MAX_CHILDREN).optional(),
    marks: z.array(Mark).max(10).optional(),
    text: z.string().max(100_000).optional(),
  }),
);

export const EMPTY_DOC: TiptapDoc = { type: "doc", content: [{ type: "paragraph" }] };

/** Returns an error message for the first problem found, or null when the document is safe to store. */
function checkTree(node: TiptapNode, depth: number, count: { n: number }): string | null {
  count.n += 1;
  if (count.n > MAX_NODES) return "The post is too long. Split it into two posts.";
  if (depth > MAX_DEPTH) return "The post nests too deeply. Flatten the lists or quotes.";
  if (node.type === "doc" && depth > 0) return "The post content is not valid.";
  if (node.type === "image" && !isSafeImageSrc(node.attrs?.src)) return "An image address must start with https:// or http://.";
  if (node.type === "youtube" && !isYoutubeUrl(node.attrs?.src)) return "Videos can only be embedded from YouTube.";
  if (node.type === "heading" && ![2, 3, 4].includes(Number(node.attrs?.level))) return "Headings in a post must be level 2, 3 or 4.";
  for (const mark of node.marks ?? []) {
    if (mark.type === "link" && !isSafeLinkHref(mark.attrs?.href)) return "A link must start with https://, http://, mailto: or /.";
  }
  for (const child of node.content ?? []) {
    const problem = checkTree(child, depth + 1, count);
    if (problem) return problem;
  }
  return null;
}

export type DocResult = { ok: true; doc: TiptapDoc } | { ok: false; error: string };

export function parseTiptapDoc(input: unknown): DocResult {
  let raw = input;
  if (typeof raw === "string") {
    if (raw.length > MAX_BYTES) return { ok: false, error: "The post is too long. Split it into two posts." };
    try {
      raw = JSON.parse(raw);
    } catch {
      return { ok: false, error: "The post content could not be read. Reload the page and try again." };
    }
  }
  const parsed = Node.safeParse(raw);
  if (!parsed.success || parsed.data.type !== "doc") return { ok: false, error: "The post content is not valid. Reload the page and try again." };
  if (JSON.stringify(parsed.data).length > MAX_BYTES) return { ok: false, error: "The post is too long. Split it into two posts." };
  const problem = checkTree(parsed.data, 0, { n: 0 });
  if (problem) return { ok: false, error: problem };
  return { ok: true, doc: parsed.data as TiptapDoc };
}

/** Plain text of a document, for reading time and empty checks. */
export function docText(node: TiptapNode): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(docText).join(" ");
}
