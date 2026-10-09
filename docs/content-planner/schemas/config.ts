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
    pricingModule: z.string().min(1).optional(),
    claims: z.string().min(1),
    company: z.string().min(1),
    pages: z.string().min(1),
    posts: pathOrNull,
    briefs: z.string().min(1),
    facts: z.string().min(1),
    drafts: z.string().min(1),
    rulesConfig: z.string().min(1),
    /** Blueprint data (schemas/blueprints.ts). Without it the Blueprint checks are skipped. */
    blueprints: z.string().min(1).optional(),
    /** Intent and trust profile data (schemas/profiles.ts). Without it the Intent and Trust checks are skipped. */
    profiles: z.string().min(1).optional(),
  }),
  adapters: z.object({
    claims: z.enum(["ts-export", "json"]),
    /** json: read the pricing file generically. module: call prices() exported by paths.pricingModule (a project-side module that uses the host's typed loader). */
    pricing: z.enum(["json", "module"]),
    posts: z.enum(["files", "wordpress"]),
    /** Used when posts is "wordpress": how a REST post maps to the fields check-content needs. No credentials here; they come from the environment. */
    wordpress: z
      .object({
        apiUrlEnv: z.string().min(1),
        userEnv: z.string().min(1),
        passwordEnv: z.string().min(1),
        webhookSecretEnv: z.string().min(1),
        /** Public path of a post, for example "/kb/{slug}". The register's Target URL decides the real match. */
        urlTemplate: z.string().includes("{slug}"),
        /** Dotted paths into the REST post object. Only title, slug, content and excerpt are WordPress core; the rest are custom fields (see rules/wordpress-content-model.md). */
        fields: z.record(z.string(), z.string()),
        /** WordPress status -> the state check-content sees. */
        stateMap: z.record(z.string(), z.string()),
      })
      .optional(),
    pageSpec: z
      .object({
        $comment: z.string().optional(),
        command: z.string().min(1),
        /** Keys in a page spec whose strings are structure, not copy. */
        nonCopyKeys: z.array(z.string()).default([]),
        /** Keys that hold a button or link label. */
        labelKeys: z.array(z.string()).default([]),
      })
      .nullable(),
    /** Prints which sections of each page are visible after gating, as JSON on stdout (schemas/blueprints.ts, VisibilitySchema). */
    pageVisibility: z.object({ command: z.string().min(1) }).nullable().optional(),
    /** Exits 1 and prints a line for each piece of page copy found in a component instead of the page JSON or the shared strings file. */
    copySource: z.object({ command: z.string().min(1) }).nullable().optional(),
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
      /** FAQ item counts by page archetype (for example money, guide). A page's own `archetype` wins, then the plan's archetype, then faqItems. */
      faqItemsByArchetype: z.record(z.string(), z.tuple([z.number().int(), z.number().int()])).default({}),
      /** Which archetype each plan belongs to, keyed by plan number such as "01". */
      archetypeByPlan: z.record(z.string(), z.string()).default({}),
      /** Maps another system's archetype names (a page spec's own) to the keys of faqItemsByArchetype. */
      archetypeAliases: z.record(z.string(), z.string()).default({}),
      similarity: z.object({ shingleWords: z.number().int().min(2), threshold: z.number().min(0).max(1) }).default({ shingleWords: 5, threshold: 0.3 }),
      linksSuggested: z.number().int().positive().default(3),
    })
    .refine((l) => l.titleWarnAbove <= l.titleFailAbove, { message: "titleWarnAbove must not exceed titleFailAbove" })
    .refine((l) => l.gradeWarnAbove <= l.gradeFailAbove, { message: "gradeWarnAbove must not exceed gradeFailAbove" })
    .refine((l) => l.faqAnswerWarnBelow <= l.faqAnswerFailAbove, { message: "FAQ warn and fail limits are reversed" }),
  web: z.object({ serpSource: z.enum(["claude-web", "serpapi"]), gscSource: z.enum(["csv", "api"]) }),
});

export type Config = z.infer<typeof ConfigSchema>;
