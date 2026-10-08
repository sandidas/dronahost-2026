/** Zod schema for content-planner.config.json: the only place host paths, adapters, limits and the governor live. */
import { z } from "zod";

const pathOrNull = z.string().min(1).nullable();

export const ConfigSchema = z.object({
  $comment: z.string().optional(),
  name: z.string().min(1),
  locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, "use a locale such as en-US"),
  paths: z.object({
    register: z.string().min(1),
    pricing: z.string().min(1),
    claims: z.string().min(1),
    company: z.string().min(1),
    pages: z.string().min(1),
    posts: pathOrNull,
    briefs: z.string().min(1),
    facts: z.string().min(1),
    drafts: z.string().min(1),
    rulesConfig: z.string().min(1),
  }),
  adapters: z.object({
    claims: z.enum(["ts-export", "json"]),
    pricing: z.literal("json"),
    posts: z.enum(["files", "wordpress"]),
    pageSpec: z.object({ $comment: z.string().optional(), command: z.string().min(1) }).nullable(),
  }),
  governor: z.object({
    maxInFlight: z.number().int().positive(),
    monthlyNewPages: z.number().int().nonnegative(),
    paused: z.boolean(),
  }),
  cta: z.object({ bannedLabels: z.array(z.string()), cardLabelTemplate: z.string().includes("{plan}") }),
  limits: z
    .object({
      titleSuffix: z.string(),
      titleWarnAbove: z.number().int().positive(),
      titleFailAbove: z.number().int().positive(),
      descriptionWarnAbove: z.number().int().positive(),
      sentenceMax: z.number().int().positive(),
      averageSentenceMax: z.number().positive(),
      gradeTarget: z.tuple([z.number(), z.number()]),
      gradeWarnAbove: z.number(),
      gradeFailAbove: z.number(),
      answerBlockWords: z.tuple([z.number().int(), z.number().int()]),
      faqItems: z.tuple([z.number().int(), z.number().int()]),
      faqAnswerWarnBelow: z.number().int(),
      faqAnswerFailAbove: z.number().int(),
      internalLinksMin: z.number().int().nonnegative(),
    })
    .refine((l) => l.titleWarnAbove <= l.titleFailAbove, { message: "titleWarnAbove must not exceed titleFailAbove" })
    .refine((l) => l.gradeWarnAbove <= l.gradeFailAbove, { message: "gradeWarnAbove must not exceed gradeFailAbove" })
    .refine((l) => l.faqAnswerWarnBelow <= l.faqAnswerFailAbove, { message: "FAQ warn and fail limits are reversed" }),
  web: z.object({ serpSource: z.enum(["claude-web", "serpapi"]), gscSource: z.enum(["csv", "api"]) }),
});

export type Config = z.infer<typeof ConfigSchema>;
