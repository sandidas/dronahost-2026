/**
 * Zod schema for the envelope of a page spec (content/pages/*.json): the fields every project's page file needs for
 * check-content. Section types and their content are validated by the host adapter (`adapters.pageSpec` in the config),
 * not here: the host's renderer owns them (owner decision, Q9). `.passthrough()` keeps host-only fields.
 */
import { z } from "zod";
import { IsoDate, SitePath } from "./common";

const SectionEnvelope = z.object({ id: z.string().min(1), type: z.string().min(2), content: z.record(z.string(), z.unknown()).optional() }).passthrough();

export const PageEnvelope = z
  .object({
    $comment: z.string().optional(),
    id: z.string().min(1),
    path: SitePath,
    primaryKeyword: z.string().min(3),
    secondaryKeywords: z.array(z.string()).optional(),
    seo: z.object({ title: z.string().min(1), description: z.string().min(1) }).passthrough(),
    rules: z.object({ reviewedOn: IsoDate }).passthrough(),
    sections: z.array(SectionEnvelope).min(1),
  })
  .passthrough()
  .superRefine((p, ctx) => {
    const ids = p.sections.map((s) => s.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) ctx.addIssue({ code: "custom", path: ["sections"], message: `duplicate section id "${dup}"` });
  });

export type PageEnvelopeData = z.infer<typeof PageEnvelope>;
