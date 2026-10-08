import { z } from "zod";
import { TEMPLATE_TOKENS, TOKEN_RE } from "../requires-grammar";
import { ClaimRef, Cta, FeatureRef, Href, IconName, Requires, sectionBase, wordCount } from "./common";

const eyebrow = z.string().max(40).optional();
const description = z.string().max(220).optional();
const gatedText = z.union([
  z.string().min(2).max(120),
  z.strictObject({ text: z.string().min(2).max(120), requiresClaim: ClaimRef.optional() }),
]);

export const ProductHero = z.strictObject({
  ...sectionBase,
  type: z.literal("ProductHero"),
  variant: z.enum(["dashboard"]),
  content: z.strictObject({
    eyebrow,
    h1: z.string().min(20).max(70),
    /** When set, `h1` shows only if every one of these claims renders; otherwise `h1Fallback` shows. Used by the reason-led headline. */
    h1Requires: z.array(ClaimRef).min(1).max(3).optional(),
    h1Fallback: z.string().min(20).max(70).optional(),
    accentFallback: z.string().min(4).optional(),
    /** One phrase at the end of the H1 shown in teal. At most one highlighted phrase per heading. */
    accent: z.string().min(4).optional(),
    lead: z.string().max(220),
    /** When set, `lead` shows only if every one of these claims renders; otherwise `leadFallback` shows. */
    leadRequiresClaims: z.array(ClaimRef).min(1).max(4).optional(),
    /** Neutral copy that states no unconfirmed capability. Required with `leadRequiresClaims`. */
    leadFallback: z.string().max(220).optional(),
    ctaPrimary: Cta,
    ctaSecondary: Cta.optional(),
    /** Plain text or `claim:` refs. A claim that does not render is dropped. */
    highlights: z.array(z.union([ClaimRef, z.string().min(4).max(80)])).max(4).optional(),
    /** Text of the decorative dashboard. The caption must say it is an example. */
    mockup: z.strictObject({ address: z.string().max(40).optional(), status: z.string().max(20).optional(), tiles: z.array(z.string().max(16)).length(3).optional(), caption: z.string().min(7).max(40).optional() }).optional(),
  })
    .refine((c) => !c.accent || c.h1.endsWith(c.accent), { message: "accent must be the end of the h1", path: ["accent"] })
    .refine((c) => !c.h1Requires || Boolean(c.h1Fallback), { message: "h1Fallback is required with h1Requires", path: ["h1Fallback"] })
    .refine((c) => !c.leadRequiresClaims || Boolean(c.leadFallback), { message: "leadFallback is required with leadRequiresClaims", path: ["leadFallback"] }),
});

export const AssuranceStrip = z.strictObject({
  ...sectionBase,
  type: z.literal("AssuranceStrip"),
  content: z.strictObject({ claims: z.array(ClaimRef).min(1).max(4), label: z.string().max(60).optional() }),
});

export const PathRouter = z.strictObject({
  ...sectionBase,
  type: z.literal("PathRouter"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(60),
    description,
    compact: z.boolean().optional(),
    paths: z
      .array(
        z.strictObject({
          title: z.string().min(8).max(90),
          line: z.string().max(160),
          href: Href,
          cta: z.string().min(3).max(40),
          icon: IconName.optional(),
          requiresClaim: ClaimRef.optional(),
        }),
      )
      .min(2)
      .max(4),
  }),
});

export const AnswerBlock = z.strictObject({
  ...sectionBase,
  type: z.literal("AnswerBlock"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(80),
    answer: z.string().refine((a) => wordCount(a) >= 40 && wordCount(a) <= 80, "the direct answer must be 40 to 80 words"),
    detail: z.array(z.string().min(10).max(400)).max(3).optional(),
    link: z.strictObject({ label: z.string().min(3).max(40), href: Href }).optional(),
  }),
});

export const ResponsibilitySplit = z.strictObject({
  ...sectionBase,
  type: z.literal("ResponsibilitySplit"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    weLookAfter: z.array(gatedText).min(1).max(6),
    youKeep: z.array(gatedText).min(1).max(6),
    note: z.string().max(160).optional(),
  }),
});

/** AnswerBlock and ResponsibilitySplit as one section (blueprint section "Meaning"). One H2; the answer and each line gate on their own. */
export const Meaning = z.strictObject({
  ...sectionBase,
  type: z.literal("Meaning"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(80),
    /** 40 to 80 words. Hidden until `answerRequiresClaim` renders, when that is set. */
    answer: z.string().refine((a) => wordCount(a) >= 40 && wordCount(a) <= 80, "the direct answer must be 40 to 80 words").optional(),
    answerRequiresClaim: ClaimRef.optional(),
    /** The heading when the answer is hidden. */
    h2Fallback: z.string().min(8).max(80).optional(),
    weLookAfter: z.array(gatedText).min(1).max(6),
    youKeep: z.array(gatedText).min(1).max(6),
    lookAfterLabel: z.string().max(30).optional(),
    keepLabel: z.string().max(30).optional(),
    note: z.string().max(160).optional(),
  }),
});

/** SupportChannels and TrustSignals as one section (blueprint section "Help and policies"). */
export const HelpAndPolicies = z.strictObject({
  ...sectionBase,
  type: z.literal("HelpAndPolicies"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(80),
    description,
    supportLabel: z.string().min(3).max(40),
    policiesLabel: z.string().min(3).max(40),
    links: z.array(Href).min(1).max(8),
    onlyPublished: z.boolean(),
  }),
});

export const ProcessTimeline = z.strictObject({
  ...sectionBase,
  type: z.literal("ProcessTimeline"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    steps: z.array(z.strictObject({ title: z.string().min(3).max(40), text: z.string().max(120) })).min(2).max(6),
  }),
});

export const BentoGrid = z.strictObject({
  ...sectionBase,
  type: z.literal("BentoGrid"),
  content: z.strictObject({ eyebrow, h2: z.string().min(8).max(70), description, tiles: z.array(FeatureRef).min(1).max(6) }),
});

export const PricingPlans = z.strictObject({
  ...sectionBase,
  type: z.literal("PricingPlans"),
  content: z
    .strictObject({
      h2: z.string().min(8).max(60),
      description,
      source: z.literal("pricing.json"),
      show: z.array(z.string().min(2)).min(1).max(5),
      highlight: z.string().optional(),
      /** The renewal price always shows; the promise wording is gated by the renewal-price-same claim. */
      showRenewalPrice: z.literal(true),
      link: z.strictObject({ label: z.string().min(3).max(40), href: Href }).optional(),
    })
    .refine((c) => !c.highlight || c.show.includes(c.highlight), { message: "highlight must be one of the shown plans", path: ["highlight"] }),
});

export const SupportChannels = z.strictObject({
  ...sectionBase,
  type: z.literal("SupportChannels"),
  content: z.strictObject({
    h2: z.string().min(8).max(70),
    description,
    channels: z.array(z.enum(["ticket", "email"])).min(1).max(2),
    layout: z.enum(["stacked", "split"]).optional(),
    /** Hours text comes from this claim once its terms page is published. */
    hoursFrom: ClaimRef.optional(),
  }),
});

export const Testimonials = z.strictObject({
  ...sectionBase,
  type: z.literal("Testimonials"),
  content: z.strictObject({ source: z.literal("reviews.json"), h2: z.string().max(70).optional() }),
});

export const TrustSignals = z.strictObject({
  ...sectionBase,
  type: z.literal("TrustSignals"),
  content: z.strictObject({ h2: z.string().min(8).max(60), links: z.array(Href).min(1).max(8), onlyPublished: z.boolean(), variant: z.enum(["cards", "list"]).optional() }),
});

export const FAQSection = z.strictObject({
  ...sectionBase,
  type: z.literal("FAQSection"),
  content: z.strictObject({
    h2: z.string().min(8).max(60),
    items: z
      .array(
        z.strictObject({
          q: z.string().min(10).max(120),
          /** Answer-first prose, at most 80 words. `{{pricing.summary}}` is filled from pricing.json. */
          a: z
            .string()
            .min(10)
            .refine((a) => wordCount(a) <= 80, "FAQ answers are at most 80 words")
            .refine((a) => [...a.matchAll(TOKEN_RE)].every((m) => (TEMPLATE_TOKENS as readonly string[]).includes(m[1] ?? "")), "unknown {{token}}"),
          requires: Requires.optional(),
          requiresClaim: ClaimRef.optional(),
        }),
      )
      .min(3)
      .max(10),
  }),
});

export const CTABand = z.strictObject({
  ...sectionBase,
  type: z.literal("CTABand"),
  content: z.strictObject({ h2: z.string().min(8).max(60), description, ctaPrimary: Cta, ctaSecondary: Cta.optional(), note: z.string().max(120).optional() }),
});

export const Section = z.discriminatedUnion("type", [
  ProductHero, AssuranceStrip, PathRouter, AnswerBlock, ResponsibilitySplit, Meaning, ProcessTimeline, BentoGrid, PricingPlans,
  SupportChannels, HelpAndPolicies, Testimonials, TrustSignals, FAQSection, CTABand,
]);

export type SectionSpec = z.infer<typeof Section>;
export type SectionType = SectionSpec["type"];
export const SECTION_TYPES = Section.options.map((o) => o.shape.type.value) as readonly SectionType[];
