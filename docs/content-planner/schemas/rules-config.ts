/** Zod schema for project/rules.config.json: machine-readable project rules (lists the checks read). */
import { z } from "zod";

export const RulesConfigSchema = z.object({
  $comment: z.string().optional(),
  bannedPhrases: z.array(z.string().min(1)),
  bannedCtaLabels: z.array(z.string().min(1)),
  featureWords: z.array(z.object({ pattern: z.string().min(1), claim: z.string().min(1), caseSensitive: z.boolean().optional() })),
  forbiddenChannels: z.array(z.string().min(1)),
  forbiddenClaims: z.array(z.string().min(1)),
  channelAllowlistFiles: z.array(z.string()),
  disclosureLine: z.string().min(1),
  brandSuffixPattern: z.string().min(1),
  noBrand: z.object({
    $comment: z.string().optional(),
    terms: z.array(z.string().min(1)).min(1),
    patterns: z.array(z.string().min(1)),
    allowFiles: z.array(z.string()),
  }),
});

export type RulesConfig = z.infer<typeof RulesConfigSchema>;
