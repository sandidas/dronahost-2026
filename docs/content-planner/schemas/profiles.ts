/**
 * Zod schema for the profile data a project supplies (paths.profiles): what a page must show for its search intent (Intent
 * group, IN1 to IN4) and what a page must show to be trusted (Trust group, TR1 to TR5). The rules are reusable; the words,
 * links and page types are the project's. Reusable guidance lives in rules/search-intent.md and rules/eeat-and-people-first.md.
 */
import { z } from "zod";

export const INTENTS = ["Learn", "Solve", "Compare", "Buy", "Find", "Plan"] as const;
export const IntentName = z.enum(INTENTS);
export type IntentName = z.infer<typeof IntentName>;

const re = z.string().min(1).refine((p) => { try { new RegExp(p, "i"); return true; } catch { return false; } }, "not a valid regular expression");

/** One way to see that something is on the page. Patterns are case-insensitive regular expressions. */
export const Detector = z.union([
  z.strictObject({ sectionType: z.string().min(1) }),
  /** A key that holds a non-empty value in a visible section (page specs), for example ctaPrimary. */
  z.strictObject({ field: z.string().min(1) }),
  z.strictObject({ text: re }),
  z.strictObject({ href: re }),
  z.strictObject({ heading: re }),
  z.strictObject({ table: z.literal(true) }),
  /** A direct answer: a section's `answer` (page specs) or the first paragraph under the H1 (articles). */
  z.strictObject({ answer: z.literal(true) }),
]);
export type Detector = z.infer<typeof Detector>;

export const Element = z.strictObject({
  id: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
  /** Plain name used in the message: "a visible price or a link to the pricing page". */
  label: z.string().min(3),
  /** Any one of these is enough. */
  any: z.array(Detector).min(1),
});
export type Element = z.infer<typeof Element>;

export const IntentProfile = z.strictObject({
  /** What the page must show for a reader with this intent. */
  needs: z.array(Element).min(1),
  /** Ids from `needs` that must show in the first screen (the first two visible sections, or the first 200 words). */
  firstScreen: z.array(z.string()).default([]),
  /** Things that must not show in the first screen (a sales push on a Learn page). */
  avoidFirstScreen: z.array(z.strictObject({ label: z.string().min(3), detector: Detector })).default([]),
  /** A call to action label matching any of these does not fit the intent. */
  avoidLabels: z.array(re).default([]),
});
export type IntentProfile = z.infer<typeof IntentProfile>;

const Applies = z.array(z.string().min(1)).min(1);

export const ProfilesSchema = z.strictObject({
  $comment: z.string().optional(),
  /** "warn" shows a failure as a warning. Flip a rule to "fail" once the pages are measured. Missing means "fail". */
  severity: z.record(z.string().regex(/^(IN|TR)\d$/), z.enum(["warn", "fail"])).default({}),
  intents: z.record(IntentName, IntentProfile),
  trust: z.strictObject({
    /** TR1: a reader can find out who is responsible. */
    identity: z.strictObject({
      appliesTo: Applies,
      /** Links that reach the answer. */
      hrefs: z.array(z.string().min(1)).min(1),
      /** A file (relative to the config) that holds the site-wide navigation. A link found there counts for every page. */
      siteWideFile: z.string().min(1).optional(),
    }),
    /** TR2: pages that ask for money link the policies they rely on. */
    policies: z.strictObject({ appliesTo: Applies, hrefs: z.array(z.string().min(1)).min(1), min: z.number().int().positive() }),
    /** TR3: wording that claims authority. Each hit needs a source in the same section, or a fact in the ledger. */
    authority: z.strictObject({ patterns: z.array(re).min(1), appliesTo: Applies.optional() }),
    /** TR4: honest limits. The page says who it is not for, or what it does not cover. */
    honestLimits: z.strictObject({ appliesTo: Applies, any: z.array(Detector).min(1) }),
    /** TR5: the page shows when it was last reviewed. Page specs carry rules.reviewedOn; articles carry reviewed_on. */
    freshness: z.strictObject({ appliesTo: Applies, maxAgeDays: z.number().int().positive() }),
  }),
  /** The "owner still owes" report: a hidden section's missing fact matched to what only a person can supply. */
  owed: z.array(z.strictObject({ match: re, label: z.string().min(3), who: z.string().min(2) })).default([]),
});
export type Profiles = z.infer<typeof ProfilesSchema>;
