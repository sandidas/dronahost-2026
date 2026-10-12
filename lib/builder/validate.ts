import { z } from "zod";
import { BUILDER_PROBLEMS } from "@/content/portal-strings";
import { BLOCKS, blockDef } from "./blocks";
import { fieldProblems, propsSchema } from "./fields";
import { upgradeDoc } from "./legacy";
import { BLOCK_ID, DOC_VERSION, PAGE_SPACINGS, type BuilderDoc } from "./model";

/**
 * Two levels of checking, both read from the block registry. Every save (drafts included, so autosave never loses
 * work) runs `parseBuilderDoc`: ids, block types, sizes and shapes. Publishing also runs `publishProblems`: links and
 * addresses that were typed but cannot work. Nothing has to be filled in; an empty field or block shows nothing.
 */

const MAX_BYTES = 1024 * 1024;
const MAX_BLOCKS = 80;

const Id = z.string().regex(BLOCK_ID);
const AnyBlock = z.discriminatedUnion(
  "type",
  BLOCKS.map((def) => z.strictObject({ id: Id, type: z.literal(def.type), props: propsSchema(def.fields) })) as unknown as [z.ZodObject, ...z.ZodObject[]],
);
const Settings = z.strictObject({ spacing: z.enum(PAGE_SPACINGS) });
const Doc = z.strictObject({ version: z.literal(DOC_VERSION), settings: Settings, blocks: z.array(AnyBlock).max(MAX_BLOCKS) });

export type ParseResult = { ok: true; doc: BuilderDoc } | { ok: false; error: string };

/** Accepts the document as an object or a JSON string (forms send it as a string), in the current or an older version. */
export function parseBuilderDoc(input: unknown): ParseResult {
  let raw = input;
  if (typeof raw === "string") {
    if (raw.length > MAX_BYTES) return { ok: false, error: BUILDER_PROBLEMS.tooLarge };
    try {
      raw = JSON.parse(raw);
    } catch {
      return { ok: false, error: BUILDER_PROBLEMS.unreadable };
    }
  }
  const parsed = Doc.safeParse(upgradeDoc(raw));
  if (!parsed.success) return { ok: false, error: parsed.error.issues.find((i) => i.code === "custom")?.message ?? BUILDER_PROBLEMS.structure };
  if (JSON.stringify(parsed.data).length > MAX_BYTES) return { ok: false, error: BUILDER_PROBLEMS.tooLarge };
  const doc = parsed.data as BuilderDoc;
  const ids = doc.blocks.map((b) => b.id);
  if (new Set(ids).size !== ids.length) return { ok: false, error: BUILDER_PROBLEMS.structure };
  return { ok: true, doc };
}

export type Problem = { blockId: string; message: string };

/** Everything that stops a document from being published. Empty means it can go live. */
export function publishProblems(doc: BuilderDoc): Problem[] {
  const problems: Problem[] = [];
  if (doc.blocks.length === 0) problems.push({ blockId: "", message: BUILDER_PROBLEMS.emptyDoc });
  for (const block of doc.blocks) {
    const def = blockDef(block.type);
    if (def) for (const message of fieldProblems(def.fields, block.props)) problems.push({ blockId: block.id, message });
  }
  return problems;
}
