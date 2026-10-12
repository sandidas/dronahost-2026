import { z } from "zod";
import { Cta, Href, ICON_NAMES, wordCount } from "@/lib/content/schemas/common";
import { isSafeImageSrc } from "@/lib/editor/urls";

/**
 * Sections whose content is written entirely in the page builder: no claims, prices or registries behind them. Each one
 * wraps an existing site component (components/sections), so it looks like the rest of the site. These schemas are the
 * publishing rules; drafts may be incomplete. Links are site paths, like every action in the page specs.
 */

const eyebrow = z.string().max(40).optional();
const title = z.string().min(8).max(70);
const optionalCta = Cta.optional();
const image = z.strictObject({
  src: z.string().max(2048).refine(isSafeImageSrc, "use an image address that starts with https://, http:// or /"),
  alt: z.string().min(5).max(200),
});

export const OfferBanner = z.strictObject({
  id: z.string(),
  type: z.literal("OfferBanner"),
  content: z.strictObject({
    eyebrow,
    title,
    description: z.string().min(20).max(220),
    primaryCta: Cta,
    /** The name printed on the ticket beside "Plan": a plan or service, such as "Site move". */
    ticketLabel: z.string().min(3).max(40),
    /** One sentence on what happens after the click. */
    nextStep: z.string().max(140).optional(),
    layout: z.enum(["split", "centered", "compact"]),
    scope: z.enum(["ink", "page"]),
  }),
});

export const GuideBanner = z.strictObject({
  id: z.string(),
  type: z.literal("GuideBanner"),
  content: z.strictObject({
    eyebrow,
    title,
    summary: z.string().min(20).max(300),
    learn: z.array(z.string().min(3).max(90)).min(3).max(5),
    cta: optionalCta,
    layout: z.enum(["line", "vertical"]),
    numbered: z.boolean(),
    scope: z.enum(["ink", "page"]),
  }),
});

export const ActionBand = z.strictObject({
  id: z.string(),
  type: z.literal("ActionBand"),
  content: z.strictObject({
    label: z.string().min(3).max(60),
    line: z.string().min(8).max(140),
    cta: Cta,
    note: z.string().max(140).optional(),
    variant: z.enum(["split", "orange", "pill"]),
  }),
});

export const AnswerBanner = z.strictObject({
  id: z.string(),
  type: z.literal("AnswerBanner"),
  content: z.strictObject({
    eyebrow,
    question: z.string().min(10).max(120),
    answer: z
      .string()
      .min(20)
      .max(800)
      .refine((a) => wordCount(a) <= 80, "the answer is at most 80 words"),
    next: optionalCta,
    layout: z.enum(["entry", "margin", "centered"]),
  }),
});

export const SplitSection = z.strictObject({
  id: z.string(),
  type: z.literal("SplitSection"),
  content: z.strictObject({
    eyebrow,
    title,
    description: z.string().max(300).optional(),
    features: z.array(z.string().min(3).max(120)).max(6).optional(),
    ctaPrimary: optionalCta,
    ctaSecondary: optionalCta,
    image,
    imagePosition: z.enum(["left", "right"]),
  }),
});

export const FeatureCards = z.strictObject({
  id: z.string(),
  type: z.literal("FeatureCards"),
  content: z.strictObject({
    eyebrow,
    title,
    description: z.string().max(220).optional(),
    items: z
      .array(z.strictObject({ icon: z.enum(ICON_NAMES).optional(), title: z.string().min(3).max(60), description: z.string().min(10).max(220), link: optionalCta }))
      .min(2)
      .max(12),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    variant: z.enum(["cards", "divided", "plain"]),
  }),
});

export const LinkTiles = z.strictObject({
  id: z.string(),
  type: z.literal("LinkTiles"),
  content: z.strictObject({
    eyebrow,
    title,
    intro: z.string().max(220).optional(),
    items: z.array(z.strictObject({ title: z.string().min(3).max(40), line: z.string().min(3).max(100), href: Href, icon: z.enum(ICON_NAMES).optional() })).min(2).max(6),
    layout: z.enum(["palette", "split", "tiles"]),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  }),
});

export const FREE_SCHEMAS = { OfferBanner, GuideBanner, ActionBand, AnswerBanner, SplitSection, FeatureCards, LinkTiles } as const;

export type FreeSectionData = { [K in keyof typeof FREE_SCHEMAS]: z.infer<(typeof FREE_SCHEMAS)[K]> };
