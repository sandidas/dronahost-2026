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
    lead: z.string().max(220),
    ctaPrimary: Cta,
    ctaSecondary: Cta.optional(),
    /** Plain text or `claim:` refs. A claim that does not render is dropped. */
    highlights: z.array(z.union([ClaimRef, z.string().min(4).max(80)])).max(4).optional(),
  }),
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
    channels: z.array(z.enum(["whatsapp", "live-chat", "ticket"])).min(1).max(3),
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
  content: z.strictObject({ h2: z.string().min(8).max(60), links: z.array(Href).min(1).max(6), onlyPublished: z.boolean() }),
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
  ProductHero, AssuranceStrip, PathRouter, AnswerBlock, ResponsibilitySplit, ProcessTimeline, BentoGrid, PricingPlans,
  SupportChannels, Testimonials, TrustSignals, FAQSection, CTABand,
]);

export type SectionSpec = z.infer<typeof Section>;
export type SectionType = SectionSpec["type"];
export const SECTION_TYPES = Section.options.map((o) => o.shape.type.value) as readonly SectionType[];
