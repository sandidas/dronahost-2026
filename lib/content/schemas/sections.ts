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
    /** The secondary action shows only while this condition holds, for example "claim:free-migration && leadFormReady". */
    ctaSecondaryRequires: Requires.optional(),
    /** A real product screenshot in public/screenshots. When the file is missing the hero shows no visual and centres its text. */
    screenshot: z.strictObject({ src: z.string().regex(/^\/screenshots\/[a-z0-9-]+\.(png|jpg|webp)$/, "must be /screenshots/<name>.png, .jpg or .webp"), alt: z.string().min(10).max(160), width: z.number().int().positive(), height: z.number().int().positive() }).optional(),
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
    /** 40 to 80 words. Hidden until `answerRequires` is met, when that is set. */
    answer: z.string().refine((a) => wordCount(a) >= 40 && wordCount(a) <= 80, "the direct answer must be 40 to 80 words").optional(),
    /** A requires expression, for example "claim:backups && claim:free-migration". Every claim the answer states belongs here. */
    answerRequires: Requires.optional(),
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

/** Three to four measured numbers or ratings, each from a verified claim. Hidden until at least three render. */
export const ProofBar = z.strictObject({
  ...sectionBase,
  type: z.literal("ProofBar"),
  content: z.strictObject({ h2: z.string().min(8).max(60).optional(), claims: z.array(ClaimRef).min(3).max(4) }),
});

/** Three reasons to choose us. Each has an icon, a short title, one line and a source link, and shows only while its claim renders. */
export const WhyChoose = z.strictObject({
  ...sectionBase,
  type: z.literal("WhyChoose"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    items: z
      .array(
        z.strictObject({
          icon: IconName.optional(),
          title: z.string().min(4).max(60),
          text: z.string().min(10).max(140),
          source: Cta,
          requiresClaim: ClaimRef,
        }),
      )
      .min(3)
      .max(3),
  }),
});

/** Lead capture for a free move. The fields are listed here and limited by the blueprint. */
export const MigrationRequest = z.strictObject({
  ...sectionBase,
  type: z.literal("MigrationRequest"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(60),
    description,
    fields: z.array(z.enum(["siteUrl", "currentHost", "email", "note"])).min(3).max(4).refine((f) => new Set(f).size === f.length, "a field is listed twice"),
  }),
});

/** One approved case study with real numbers. Hidden until one exists (content/case-studies.ts). */
export const Evidence = z.strictObject({
  ...sectionBase,
  type: z.literal("Evidence"),
  content: z.strictObject({ source: z.literal("case-studies.json"), h2: z.string().max(70).optional() }),
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
  content: z.strictObject({ h2: z.string().min(8).max(60), description, ctaPrimary: Cta, ctaSecondary: Cta.optional(), ctaSecondaryRequires: Requires.optional(), note: z.string().max(120).optional() }),
});

/**
 * Honest limits (blueprint section "HonestLimits", trust rule TR4): what the product or the business does not do, so a reader
 * with the wrong need leaves quickly and a reader with the right need trusts the rest. Each item is a plain statement with an
 * optional reason and link; an item that depends on a claim hides with it. `firstHand` marks a decision we made ourselves
 * (trust rule TR7 counts it as first-hand experience).
 */
export const HonestLimits = z.strictObject({
  ...sectionBase,
  type: z.literal("HonestLimits"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    items: z
      .array(
        z.strictObject({
          /** The limit, in plain words: "We do not host email." */
          text: z.string().min(10).max(140),
          /** Why, or what to do instead. */
          reason: z.string().max(200).optional(),
          link: Cta.optional(),
          requiresClaim: ClaimRef.optional(),
          requires: Requires.optional(),
          firstHand: z.literal(true).optional(),
        }),
      )
      .min(2)
      .max(6),
  }),
});

/**
 * Page provenance (trust rule TR6): who reviewed the page, when, how its facts are checked, and where to report an error.
 * `reviewedOn` must equal `rules.reviewedOn`; check-content fails when they drift. The editorial policy link shows only
 * when that page is published.
 */
export const PageProvenance = z.strictObject({
  ...sectionBase,
  type: z.literal("PageProvenance"),
  content: z.strictObject({
    /** A real person's name. Never a team name or a pseudonym. */
    reviewer: z.string().min(3).max(60),
    role: z.string().min(2).max(40),
    reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
    /** One sentence on how the facts on this page are checked. */
    howLine: z.string().min(20).max(200),
    /** Where to report an error (the contact page). */
    report: Cta,
    /** The editorial policy page. Rendered only when it is in the published list. */
    policyHref: Href.optional(),
  }),
});

export const Section = z.discriminatedUnion("type", [
  ProductHero, AssuranceStrip, ProofBar, PathRouter, AnswerBlock, ResponsibilitySplit, Meaning, WhyChoose, MigrationRequest, Evidence, ProcessTimeline, BentoGrid, PricingPlans,
  SupportChannels, HelpAndPolicies, Testimonials, TrustSignals, FAQSection, HonestLimits, PageProvenance, CTABand,
]);

export type SectionSpec = z.infer<typeof Section>;
export type SectionType = SectionSpec["type"];
export const SECTION_TYPES = Section.options.map((o) => o.shape.type.value) as readonly SectionType[];
