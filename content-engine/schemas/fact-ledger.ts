/** Zod schema for a fact ledger (templates/fact-ledger.json): every fact a page may state, with source and date. */
import { z } from "zod";
import { IsoDate } from "./common";

const Source = z.discriminatedUnion("type", [
  z.object({ type: z.literal("url"), ref: z.string().url().startsWith("https://", "use an https source"), title: z.string().optional(), pageDate: IsoDate.optional() }),
  z.object({ type: z.literal("project-file"), ref: z.string().min(2) }),
  z.object({ type: z.literal("interview"), ref: z.string().min(1) }),
  /** A source named but not yet read. Allowed only while the fact needs a check. */
  z.object({ type: z.literal("unresolved"), ref: z.string().min(3) }),
]);

const Fact = z
  .object({
    id: z.string().regex(/^F\d+$/, "ids look like F1, F2"),
    fact: z.string().min(5),
    kind: z.enum(["number", "date", "claim", "quote", "business", "definition", "procedure"]),
    source: Source,
    retrievedOn: IsoDate.optional(),
    checkedBy: z.string().min(2).optional(),
    status: z.enum(["verified", "needs-check", "rejected"]),
    usedIn: z.array(z.string()).optional(),
  })
  .superRefine((f, ctx) => {
    if (f.source.type === "unresolved" && f.status !== "needs-check") ctx.addIssue({ code: "custom", path: ["source"], message: `${f.id}: an unresolved source can only belong to a fact that needs a check` });
    if (f.status === "verified") {
      if (!f.retrievedOn) ctx.addIssue({ code: "custom", path: ["retrievedOn"], message: `${f.id}: a verified fact needs the date it was read` });
      if (!f.checkedBy) ctx.addIssue({ code: "custom", path: ["checkedBy"], message: `${f.id}: a verified fact needs who checked it` });
    }
  });

export const FactLedger = z
  .object({
    $comment: z.string().optional(),
    slug: z.string().regex(/^\//),
    updated: IsoDate,
    facts: z.array(Fact),
  })
  .superRefine((l, ctx) => {
    const ids = l.facts.map((f) => f.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) ctx.addIssue({ code: "custom", path: ["facts"], message: `duplicate fact id ${dup}` });
  });

export type FactLedgerData = z.infer<typeof FactLedger>;
