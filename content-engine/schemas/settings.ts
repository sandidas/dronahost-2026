/**
 * Zod schema for project/settings.json: who the business is, in one machine-readable file. Change the brand name, the
 * business type, the locale or the support channels here and every tool picks it up (the loader merges it into the config).
 * Business facts that need proof (address, numbers, guarantees) stay in project/PROJECT.md and the registries.
 */
import { z } from "zod";

const locale = z.string().regex(/^[a-z]{2}-[A-Z]{2}$/, "use a locale such as en-US");

export const SettingsSchema = z.object({
  $comment: z.string().optional(),
  brand: z.object({
    /** The name as written in prose, headings and titles. */
    name: z.string().min(1),
    /** The logo form, if it differs (for example all lowercase). Never used in prose. */
    wordmark: z.string().min(1).optional(),
    domain: z.string().min(1),
    /** Wrong spellings of the name. The no-brand test and the writer treat them as banned. */
    neverWrite: z.array(z.string().min(1)).default([]),
    /** What the metadata helper appends to every title. Default: " | <name>". */
    titleSuffix: z.string().optional(),
  }),
  business: z.object({
    /** Plain words for what the business is, used to brief writers and agents. */
    type: z.string().min(1),
    /** A short slug for the industry, for example "web-hosting", "bakery", "saas". */
    category: z.string().regex(/^[a-z0-9-]+$/, "use lowercase words joined by hyphens"),
    /** One sentence a reader would understand. Draft until the owner confirms it in PROJECT.md. */
    oneLine: z.string().min(1).optional(),
    /** What the business sells. offered: sold today. planned: not sellable yet (no plans, prices or scope). paused: no longer sold. */
    offerings: z
      .array(z.object({ name: z.string().min(1), url: z.string().min(1).nullable(), status: z.enum(["offered", "planned", "paused"]) }))
      .default([]),
    /** Where the business is based, and the only pages that may say it. */
    basedIn: z.object({ country: z.string().min(1), mentionOnlyOn: z.array(z.string().min(1)) }).optional(),
  }),
  audience: z.object({
    summary: z.string().min(1),
    priorityMarkets: z.array(z.string().min(1)).default([]),
    /** True when many readers read the language as a second language: plain words, no idioms. */
    secondLanguageReaders: z.boolean().default(true),
  }),
  language: z.object({
    locale,
    otherLocales: z.array(locale).default([]),
    /** How a date and a time are written in copy, as an example. */
    dateExample: z.string().min(1),
    timeExample: z.string().min(1),
  }),
  pricing: z
    .object({
      defaultCurrency: z.string().regex(/^[A-Z]{3}$/),
      currencies: z.array(z.string().regex(/^[A-Z]{3}$/)).min(1),
      /** The one line shown near prices, or null when no tax line applies. */
      taxLine: z.string().min(1).nullable(),
    })
    .optional(),
  support: z.object({
    /** Channels that are really covered, in the words the copy uses. */
    channels: z.array(z.string().min(1)).min(1),
    /** Channels the business does not offer. The copy never mentions them (detection phrases: forbiddenChannels in rules.config.json). */
    notOffered: z.array(z.string().min(1)).default([]),
  }),
  people: z.object({
    /** Who approves and publishes content. */
    approver: z.string().min(1),
    /** Who drafts. "Claude" when the AI drafts and a person edits. */
    drafter: z.string().min(1),
    /** Who reviews legal (Tier B) text, or null when nobody is appointed (those pages then stay drafts). */
    legalReviewer: z.string().min(1).nullable(),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;
