/** Zod schema for project/rules.config.json: machine-readable project rules (lists the checks read). */
import { z } from "zod";

export const RulesConfigSchema = z.object({
  $comment: z.string().optional(),
  bannedPhrases: z.array(z.string().min(1)),
  idioms: z.array(z.string().min(1)).default([]),
  bannedCtaLabels: z.array(z.string().min(1)),
  featureWords: z.array(z.object({ pattern: z.string().min(1), claim: z.string().min(1), caseSensitive: z.boolean().optional() })),
  forbiddenChannels: z.array(z.string().min(1)),
  forbiddenClaims: z.array(z.string().min(1)),
  channelAllowlistFiles: z.array(z.string()),
  /** Wording that says where the business is based. It is allowed only on the listed pages (for example the About page). Patterns are regular expressions, case-insensitive. */
  locationClaims: z.object({ patterns: z.array(z.string().min(1)), allowedPages: z.array(z.string().min(1)) }).optional(),
  disclosureLine: z.string().min(1),
  brandSuffixPattern: z.string().min(1),
  /** Ordered: the first plan whose pattern matches the keyword owns it. Brand-name queries are matched first by the tool. */
  planRouting: z.array(z.object({ plan: z.string().regex(/^\d{2}$/), patterns: z.array(z.string().min(1)).min(1) })).default([]),
  intentByPlan: z.record(z.string().regex(/^\d{2}$/), z.enum(["Learn", "Solve", "Compare", "Buy", "Find", "Plan"])).default({}),
  noBrand: z.object({
    $comment: z.string().optional(),
    terms: z.array(z.string().min(1)).min(1),
    patterns: z.array(z.string().min(1)),
    allowFiles: z.array(z.string()),
    /** A term allowed in one file only, for wording the owner fixed exactly. Narrower than allowFiles. */
    allowTerms: z.array(z.object({ file: z.string(), term: z.string() })).default([]),
  }),
});

export type RulesConfig = z.infer<typeof RulesConfigSchema>;
