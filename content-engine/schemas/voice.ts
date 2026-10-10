/**
 * Zod schema for project/voice.json: how the brand sounds, as data. The checks read the readability limits, the spelling
 * variant, the word swaps and the banned lists from here (the loader merges them into the config and the rules), and
 * `npm run content:voice` prints the whole voice as a card for a writer or an agent to read before drafting.
 */
import { z } from "zod";

const range = z.tuple([z.number(), z.number()]);

export const VoiceSchema = z
  .object({
    $comment: z.string().optional(),
    /** The voice in one line. */
    summary: z.string().min(1),
    attributes: z.array(z.object({ name: z.string().min(1), means: z.string().min(1) })).min(1),
    /** One sentence that shows where the voice sits between too formal and too casual. */
    spectrum: z.object({ tooFormal: z.string().min(1), tooCasual: z.string().min(1), target: z.string().min(1) }).optional(),
    writeLike: z.array(z.string().min(1)).default([]),
    neverWriteLike: z.array(z.string().min(1)).default([]),
    /** Who "we" and "you" are in copy. */
    person: z.object({ we: z.string().min(1), you: z.string().min(1) }).optional(),
    readability: z.object({
      gradeTarget: range,
      gradeWarnAbove: z.number(),
      gradeFailAbove: z.number(),
      sentenceMax: z.number().int().positive(),
      averageSentenceMax: z.number().positive(),
    }),
    spelling: z.object({
      variant: z.enum(["US", "UK"]),
      /** Word -> preferred form. Check V10 warns on each. */
      avoid: z.record(z.string().min(1), z.string().min(1)).default({}),
    }),
    /** False: check V2 fails on any exclamation mark in copy. */
    exclamationMarks: z.boolean().default(false),
    /** Plain-word swaps for second-language readers. Check V11 warns on each avoided word. */
    wordSwaps: z.array(z.object({ avoid: z.array(z.string().min(1)).min(1), use: z.string().min(1) })).default([]),
    bannedPhrases: z.array(z.string().min(1)),
    idioms: z.array(z.string().min(1)).default([]),
    bannedCtaLabels: z.array(z.string().min(1)),
    /** The line an AI-assisted article carries, followed by the approver's name. */
    disclosureLine: z.string().min(1),
  })
  .refine((v) => v.readability.gradeWarnAbove <= v.readability.gradeFailAbove, { message: "readability.gradeWarnAbove must not exceed gradeFailAbove" })
  .refine((v) => v.readability.averageSentenceMax <= v.readability.sentenceMax, { message: "readability.averageSentenceMax must not exceed sentenceMax" });

export type Voice = z.infer<typeof VoiceSchema>;
