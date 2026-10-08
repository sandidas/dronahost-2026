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
  }),
});

export type RulesConfig = z.infer<typeof RulesConfigSchema>;
