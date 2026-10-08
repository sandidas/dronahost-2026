/** Zod schema for the blueprint data a project supplies (paths.blueprints). Reusable rules live in rules/page-blueprints.md. */
import { z } from "zod";

const range = z.tuple([z.number().int().nonnegative(), z.number().int().positive()]);

export const SectionLimitSchema = z.object({
  /** Dotted path inside one section spec. `[*]` walks an array: content.paths[*].line. */
  path: z.string().min(1),
  /** chars and words measure a string. items measures an array's length. */
  unit: z.enum(["chars", "words", "items"]),
  min: z.number().int().nonnegative().optional(),
  max: z.number().int().positive().optional(),
  /** Plain name used in the message, for example "lead". */
  what: z.string().min(1),
});

export const BlueprintSchema = z.object({
  name: z.string().min(1),
  stage: z.string().min(1),
  /** Visible sections when nothing is hidden. */
  sections: range,
  /** Fewest visible sections a page may publish with. Below this the Count check fails. Between this and sections[0] it warns. */
  publishMinimum: z.number().int().positive(),
  /** Visible words, a planning range (warns only). */
  words: range,
  /** Section types that must be visible. "Hero" stands for any of heroTypes. */
  required: z.array(z.string().min(1)),
  /** The order pattern, as section types. "Hero" stands for any of heroTypes. */
  order: z.array(z.string().min(1)),
});

export const BlueprintsSchema = z.object({
  $comment: z.string().optional(),
  heroTypes: z.array(z.string().min(1)).min(1),
  /** How many times a section type may appear. Default 1. */
  duplicateAllowance: z.record(z.string(), z.number().int().positive()).default({}),
  /** Page-spec keys that hold the primary and the secondary call to action. */
  ctaKeys: z.object({ primary: z.array(z.string()), secondary: z.array(z.string()) }),
  /** A button label matching this is a price in a label. */
  pricePattern: z.string().default("[$\\u00a3\\u20ac\\u20b9]\\s?\\d|\\d+[.,]\\d{2}\\b"),
  blueprints: z.record(z.string(), BlueprintSchema),
  sectionLimits: z.record(z.string(), z.array(SectionLimitSchema)).default({}),
});

export type Blueprints = z.infer<typeof BlueprintsSchema>;
export type Blueprint = z.infer<typeof BlueprintSchema>;
export type SectionLimit = z.infer<typeof SectionLimitSchema>;

/** What a host's visibility adapter prints (JSON on stdout): for each page path, its sections after gating. */
export const VisibilitySchema = z.object({
  pages: z.record(
    z.string(),
    z.object({
      sections: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          visible: z.boolean(),
          /** ok: renders. gated: its requires or requiresClaim is not met. empty: the section renders nothing (not enough visible items). */
          reason: z.enum(["ok", "gated", "empty"]),
          /** The facts (claims, flags, features) that would unhide it. */
          missing: z.array(z.string()).default([]),
          /** False when a gate is not met. A visible section with gatesOk false is a Gate failure. */
          gatesOk: z.boolean(),
          words: z.number().int().nonnegative(),
        }),
      ),
    }),
  ),
});
export type Visibility = z.infer<typeof VisibilitySchema>;
