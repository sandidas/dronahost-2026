/** Picks a schema by file-name prefix (brief-, post-, ledger-, page-) and validates one file. Shared by check-schemas and its tests. */
import { readFileSync } from "node:fs";
import type { ZodType } from "zod";
import { BriefFrontMatter } from "../schemas/brief";
import { FactLedger } from "../schemas/fact-ledger";
import { PostFrontMatter } from "../schemas/front-matter";
import { PageEnvelope } from "../schemas/page-envelope";
import { parseFrontMatter } from "./front-matter";

export const KINDS: Record<string, { schema: ZodType; read: (text: string) => unknown }> = {
  brief: { schema: BriefFrontMatter, read: (t) => parseFrontMatter(t).front },
  post: { schema: PostFrontMatter, read: (t) => parseFrontMatter(t).front },
  ledger: { schema: FactLedger, read: (t) => JSON.parse(t) },
  page: { schema: PageEnvelope, read: (t) => JSON.parse(t) },
};

export function validateFile(file: string): { ok: boolean; problems: string[] } {
  const kind = Object.keys(KINDS).find((k) => file.split("/").pop()?.startsWith(`${k}-`));
  if (!kind) return { ok: false, problems: ["file name must start with brief-, post-, ledger- or page-"] };
  const result = KINDS[kind].schema.safeParse(KINDS[kind].read(readFileSync(file, "utf8")));
  return result.success ? { ok: true, problems: [] } : { ok: false, problems: result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`) };
}
