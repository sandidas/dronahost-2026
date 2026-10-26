import { z } from "zod";
import { TEMPLATE_TOKENS, TOKEN_RE } from "../requires-grammar";
import { ClaimRef, Cta, FeatureRef, Href, IconName, Requires, Slug, sectionBase, wordCount } from "./common";

const eyebrow = z.string().max(40).optional();
const description = z.string().max(220).optional();
const gatedText = z.union([
  z.string().min(2).max(120),
  z.strictObject({ text: z.string().min(2).max(120), requiresClaim: ClaimRef.optional() }),
]);

export const ProductHero = z.strictObject({
  ...sectionBase,
  type: z.literal("ProductHero"),
  /**
   * "dashboard": text beside a screenshot. "console": the Home look (ink band, one-field form, product console, assurance rail).
   * "panel": text beside the illustration of the hosting control panel (content.panel), modeled on the real Plesk dashboard.
   */
  /** "tiers": the resources-by-plan graphic, drawn from data/pricing.json (business hosting). */
  variant: z.enum(["dashboard", "console", "panel", "tiers"]),
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
    /**
     * Console variant: a one-field form (the website address) that scrolls to the request form with id `targetId` and fills
     * in its site address. Shown while `formRequires` holds; otherwise the two actions show.
     */
    form: z
      .strictObject({ label: z.string().min(3).max(60), placeholder: z.string().min(3).max(60), button: z.string().min(3).max(40), note: z.string().max(120).optional(), targetId: Slug })
      .optional(),
    formRequires: Requires.optional(),
    /** Console variant: the decorative product console. Tiles are `claim:` refs (label and value from the claim, dropped when it does not render) or "Label: value" text. */
    console: z
      .strictObject({
        title: z.string().min(3).max(60),
        status: z.string().min(2).max(20),
        /** Must say it is an example (mockup rule). */
        caption: z.string().min(7).max(60).refine((c) => /\bexample\b/i.test(c), "the caption must say it is an example"),
        tiles: z.array(z.union([ClaimRef, z.string().min(3).max(40)])).min(1).max(3),
        steps: z.array(z.strictObject({ title: z.string().min(3).max(60), note: z.string().max(80), state: z.enum(["done", "current", "next"]) })).min(2).max(4),
      })
      .optional(),
    /** Panel variant: the domain shown in the control-panel illustration and its caption, which must say it is an illustration. */
    panel: z
      .strictObject({
        domain: z.string().min(4).max(40),
        caption: z.string().min(10).max(80).refine((c) => /\billustration\b/i.test(c), "the caption must say it is an illustration"),
      })
      .optional(),
    /**
     * Panel and tiers variants: the text alternative of the drawn visual (content rules section 7, CP2). With it the drawing is an
     * image for screen readers; without it the drawing stays decorative. Describe what the drawing shows, never stuff it.
     */
    visual: z.strictObject({ alt: z.string().min(10).max(160) }).optional(),
    /** Console variant: the hairline rail under the hero. Each claim shows its value and label, with a link to its terms; one that does not render is dropped. */
    assurances: z.array(ClaimRef).min(1).max(4).optional(),
  })
    .refine((c) => !c.accent || c.h1.endsWith(c.accent), { message: "accent must be the end of the h1", path: ["accent"] })
    .refine((c) => !c.h1Requires || Boolean(c.h1Fallback), { message: "h1Fallback is required with h1Requires", path: ["h1Fallback"] })
    .refine((c) => !c.leadRequiresClaims || Boolean(c.leadFallback), { message: "leadFallback is required with leadRequiresClaims", path: ["leadFallback"] })
    .refine((c) => !c.formRequires || Boolean(c.form), { message: "formRequires needs a form", path: ["formRequires"] }),
})
  .refine((s) => s.variant !== "console" || Boolean(s.content.console), { message: "the console variant needs content.console", path: ["content", "console"] })
  .refine((s) => s.variant !== "panel" || Boolean(s.content.panel), { message: "the panel variant needs content.panel", path: ["content", "panel"] });

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
    /** Optional animated graphic beside the answer (components/sections/visuals/motion-graphics.tsx). */
    visual: z.enum(["care"]).optional(),
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
    /** Optional animated graphic beside the heading (components/sections/visuals/motion-graphics.tsx). */
    visual: z.enum(["managed-vs-shared"]).optional(),
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

/**
 * The migration call to action without a form (owner, 2026-10-10): copy, three reassurances, a graphic of the move and one
 * button. `action` names where the button goes; the renderer resolves it from the company registry, so no URL is typed here.
 */
export const MigrationPromo = z.strictObject({
  ...sectionBase,
  type: z.literal("MigrationPromo"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(60),
    description,
    points: z.array(z.string().min(8).max(90)).min(2).max(4),
    cta: z.strictObject({ label: z.string().min(3).max(40), action: z.enum(["client-area"]) }),
    note: z.string().max(120).optional(),
    graphic: z.strictObject({ from: z.string().min(3).max(30), middle: z.string().min(3).max(30), to: z.string().min(3).max(30), caption: z.string().min(10).max(90) }),
  }),
});

/**
 * Real support from real people: the support promise beside the people who keep it. Photos come only from content/team.ts
 * (real staff, consent recorded); with fewer than three people the section shows its illustration of a ticket answered in
 * writing. Never stock or generated faces.
 */
export const SupportTeam = z.strictObject({
  ...sectionBase,
  type: z.literal("SupportTeam"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    accent: z.string().min(4).optional(),
    description,
    points: z.array(z.strictObject({ title: z.string().min(4).max(40), text: z.string().min(10).max(140), requiresClaim: ClaimRef.optional() })).min(2).max(3),
    links: z.array(Cta).min(1).max(2),
    visual: z.strictObject({ badge: z.string().min(2).max(20), question: z.string().min(10).max(120), answer: z.string().min(10).max(160), signature: z.string().min(3).max(40), caption: z.string().min(10).max(90) }),
  }),
});

/** One approved case study with real numbers. Hidden until one exists (content/case-studies.ts). */
export const Evidence = z.strictObject({
  ...sectionBase,
  type: z.literal("Evidence"),
  content: z.strictObject({ source: z.literal("case-studies.json"), h2: z.string().max(70).optional() }),
});

/** Three-year cost per plan, computed from data/pricing.json (never typed), with one sourced finding and a link to the terms. */
export const RenewalCost = z.strictObject({
  ...sectionBase,
  type: z.literal("RenewalCost"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    source: z.literal("pricing.json"),
    /** One sourced number about the market, shown beside the table. */
    finding: z
      .strictObject({
        text: z.string().min(20).max(200),
        source: z.strictObject({ label: z.string().min(3).max(60), href: z.string().url() }),
        checkedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .optional(),
    link: Cta.optional(),
  }),
});

/**
 * Which plan fits which stage of a business: one row per plan with sites, storage, CPU, memory and resource type rendered
 * from data/pricing.json (never typed), plus one plain line per plan saying who it fits. `rows` name plans by id.
 */
export const PlanGuide = z.strictObject({
  ...sectionBase,
  type: z.literal("PlanGuide"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    source: z.literal("pricing.json"),
    /** Who each plan fits, in plain words. No numbers: the figures come from the pricing file. */
    fit: z.array(z.strictObject({ plan: z.string().min(2), text: z.string().min(10).max(120) })).min(2).max(5),
    /** One line under the table, for example what happens when a site outgrows its plan. */
    note: z.string().max(200).optional(),
    link: Cta.optional(),
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
    /** Optional animated graphic of the move above the steps: where the site is, the transfer, the destination. */
    graphic: z.strictObject({ from: z.string().min(3).max(30), middle: z.string().min(3).max(30), to: z.string().min(3).max(30), caption: z.string().min(10).max(90) }).optional(),
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
      /** Optional: no price on the card; each card links here for the price. Product pages show prices since decision 63, so leave it unset there. */
      pricesHref: Href.optional(),
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
    /** One text link under the questions, e.g. the terms that answer the rest. */
    link: Cta.optional(),
    /** Up to three real photos for the collage: the team or customers who agreed, never stock images. Without them the collage is drawn. */
    photos: z.array(z.strictObject({ src: z.string().regex(/^\/images\//, "a file under /images/"), alt: z.string().min(5).max(140) })).min(1).max(3).optional(),
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


/** The rating band under the hero: a verified score and the public review profiles. Renders nothing until verified data exists. */
export const RatingBand = z.strictObject({
  ...sectionBase,
  type: z.literal("RatingBand"),
  content: z.strictObject({ source: z.literal("reviews.json") }),
});

const accentRefine = <T extends { h2: string; accent?: string }>(c: T) => !c.accent || c.h2.endsWith(c.accent);
const accentIssue = { message: "accent must be the end of the h2", path: ["accent"] };

/** Three or four commitments as large numerals, each with a policy link. An item hides when its claim does not render. */
export const AdvantageGrid = z.strictObject({
  ...sectionBase,
  type: z.literal("AdvantageGrid"),
  content: z
    .strictObject({
      eyebrow,
      h2: z.string().min(8).max(70),
      /** The closing phrase of the h2, set heavier. */
      accent: z.string().min(4).optional(),
      description,
      items: z
        .array(
          z.strictObject({
            /** The large figure. It must be the value of the claim below. */
            value: z.string().min(1).max(12),
            title: z.string().min(4).max(50),
            text: z.string().min(10).max(140),
            link: Cta,
            requiresClaim: ClaimRef,
            /** A decision we made ourselves (trust rule TR7). */
            firstHand: z.literal(true).optional(),
          }),
        )
        .min(3)
        .max(4),
    })
    .refine(accentRefine, accentIssue),
});

/** What we offer: one or two featured cards and three to eight small cards with a line icon. */
export const SolutionsGrid = z.strictObject({
  ...sectionBase,
  type: z.literal("SolutionsGrid"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    featured: z
      .array(z.strictObject({ tag: z.string().min(3).max(40), title: z.string().min(4).max(60), text: z.string().min(10).max(160), href: Href, cta: z.string().min(3).max(40), requiresClaim: ClaimRef.optional() }))
      .min(1)
      .max(2),
    items: z.array(z.strictObject({ icon: IconName, title: z.string().min(3).max(40), text: z.string().min(10).max(120), href: Href, requiresClaim: ClaimRef.optional() })).min(3).max(8),
    /** Small print under the grid, for example a trademark notice. */
    note: z.string().max(160).optional(),
  }),
});

/** One included feature in its own section: heading, two to four points and a large animated graphic. */
export const FeatureSpotlight = z.strictObject({
  ...sectionBase,
  type: z.literal("FeatureSpotlight"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    points: z.array(z.strictObject({ title: z.string().min(3).max(40), text: z.string().min(10).max(160), requiresClaim: ClaimRef.optional() })).min(2).max(4),
    visual: z.enum(["builder"]).optional(),
    note: z.string().max(220).optional(),
    /** The outside source the note relies on (content rules section 7, CP4): an authoritative page, never a competitor or affiliate. */
    source: z.strictObject({ label: z.string().min(3).max(60), href: z.string().url().startsWith("https://") }).optional(),
    reverse: z.boolean().optional(),
  }),
});

/** Product cards under the hero: two to four cards, each one icon, title, sentence and button. No prices (decision 58). */
export const ProductCards = z.strictObject({
  ...sectionBase,
  type: z.literal("ProductCards"),
  content: z.strictObject({
    /** Section name for screen readers; the row shows no heading. */
    h2: z.string().min(8).max(60),
    items: z
      .array(z.strictObject({ icon: IconName, tag: z.string().min(3).max(24).optional(), title: z.string().min(3).max(40), text: z.string().min(10).max(140), href: Href, cta: z.string().min(3).max(32), requiresClaim: ClaimRef.optional() }))
      .min(2)
      .max(4),
  }),
});

/** How the services fit together: three or four points beside an orbit diagram of four to eight nodes. */
export const Ecosystem = z.strictObject({
  ...sectionBase,
  type: z.literal("Ecosystem"),
  content: z
    .strictObject({
      eyebrow,
      h2: z.string().min(8).max(80),
      accent: z.string().min(4).optional(),
      description,
      points: z.array(z.strictObject({ title: z.string().min(3).max(40), text: z.string().min(10).max(120), requiresClaim: ClaimRef.optional() })).min(3).max(4),
      nodes: z.array(z.string().min(2).max(24)).min(4).max(8).refine((n) => new Set(n).size === n.length, "a node is listed twice"),
      center: z.string().min(2).max(24),
    })
    .refine(accentRefine, accentIssue),
});

/** A featured case study beside review cards. Only from verified data (content/case-studies.ts, lib/content/reviews.ts). */
export const ReviewsShowcase = z.strictObject({
  ...sectionBase,
  type: z.literal("ReviewsShowcase"),
  content: z.strictObject({ eyebrow, h2: z.string().min(8).max(70), description, source: z.literal("reviews.json") }),
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
    /** A real person's name, or the editorial team's name (owner decision 59). Never a pseudonym. */
    reviewer: z.string().min(3).max(60),
    role: z.string().min(2).max(40),
    reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
    /** One sentence on how the facts on this page are checked. */
    howLine: z.string().min(20).max(200),
    /** Where to report an error (the contact page). */
    report: Cta,
    /** The editorial policy page. Rendered only when it is in the published list. */
    policyHref: Href.optional(),
    /** "byline": one small line (who and when, report link) with no card; the how-line is kept for the record. */
    variant: z.enum(["card", "byline"]).optional(),
  }),
});

/**
 * One real video (content rules section 7, CP3): our own recording or a credited video from an authoritative source, never stock
 * or AI footage presented as ours. Add the section only when the video exists. It loads on click from youtube-nocookie.com, so
 * nothing reaches YouTube before the visitor presses play, and it costs no LCP. Captions are required.
 */
export const VideoEmbed = z.strictObject({
  ...sectionBase,
  type: z.literal("VideoEmbed"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    video: z.strictObject({
      youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "an 11-character YouTube video id"),
      /** What the video shows, in plain words. Also the VideoObject name. */
      title: z.string().min(10).max(100),
      /** One or two sentences for the VideoObject description. */
      summary: z.string().min(20).max(220),
      uploadDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
      /** ISO 8601 duration, for example PT2M30S. */
      duration: z.string().regex(/^PT(\d+H)?(\d+M)?(\d+S)?$/, "an ISO 8601 duration such as PT2M30S"),
      /** The video has captions (WCAG 1.2.2). Required: a video without captions does not go on a page. */
      captions: z.literal(true),
      /** Who made it, when it is not ours (for example "WordPress.org"). Shown under the player. */
      credit: z.string().min(3).max(60).optional(),
      /** A local still in public/videos, shown before play instead of loading YouTube's thumbnail. */
      poster: z.strictObject({ src: z.string().regex(/^\/videos\/[a-z0-9-]+\.(png|jpg|webp)$/), alt: z.string().min(10).max(160) }).optional(),
      /** A page with the full transcript. */
      transcriptHref: Href.optional(),
    }),
  }),
});

/**
 * The OfferBanner ticket as a page hero. The price on the ticket is the lowest plan's, read from data/pricing.json by the
 * renderer and hidden until prices show; the spec never names a plan or a price (decision 73).
 */
export const OfferHero = z.strictObject({
  ...sectionBase,
  type: z.literal("OfferHero"),
  /** split = text beside an upright ticket · centered = text over a long ticket · compact = the whole banner is the ticket. */
  variant: z.enum(["split", "centered", "compact"]),
  content: z.strictObject({
    eyebrow,
    h1: z.string().min(20).max(70),
    /** A phrase shown after the h1 in teal. */
    accent: z.string().min(4).max(40).optional(),
    lead: z.string().max(220).optional(),
    ctaPrimary: Cta,
    /** The risk reducer under the button, shown only while its claim renders. */
    riskReducer: z.strictObject({ text: z.string().min(10).max(80), href: Href, requiresClaim: ClaimRef }).optional(),
    /** One sentence on what happens after the click. */
    nextStep: z.string().min(10).max(160).optional(),
    highlights: z.array(gatedText).max(4).optional(),
  }),
});

/**
 * One row of logos: the technology we run (content/logos.ts TECH_LOGOS), one set per strip, each logo shown once its claim
 * is owner-confirmed (decision 81). The spec never lists logos; with none to show the section is left out. No customer logos.
 */
export const LogoStrip = z.strictObject({
  ...sectionBase,
  type: z.literal("LogoStrip"),
  /** marquee = one slowly scrolling row · static = a centred row. */
  variant: z.enum(["marquee", "static"]),
  content: z.strictObject({
    /** Which logos: "hosting" under the banner of the hosting pages, "development" for custom development. */
    set: z.enum(["hosting", "development"]),
    eyebrow,
    h2: z.string().min(8).max(70).optional(),
    /** One plain line in its own band under the logos, for example where the servers come from (decision 80). */
    note: z.string().min(10).max(160).optional(),
    /** The note shows only while every one of these claims renders; otherwise `noteFallback` shows. */
    noteRequires: z.array(ClaimRef).min(1).max(3).optional(),
    noteFallback: z.string().min(10).max(160).optional(),
  }),
});

/** Text, a checklist and actions beside one of the shared visuals. */
export const TwoColumn = z.strictObject({
  ...sectionBase,
  type: z.literal("TwoColumn"),
  content: z.strictObject({
    eyebrow,
    h2: z.string().min(8).max(70),
    description,
    points: z.array(gatedText).max(6).optional(),
    ctas: z.array(Cta).max(2).optional(),
    visual: z.enum(["cache", "growth", "restore", "channels", "shield", "backups", "panel", "uptime", "move"]),
    visualPosition: z.enum(["left", "right"]).optional(),
  }),
});

export const Section = z.discriminatedUnion("type", [
  OfferHero, TwoColumn, LogoStrip, ProductHero, AssuranceStrip, ProofBar, PathRouter, AnswerBlock, ResponsibilitySplit, Meaning, WhyChoose, MigrationRequest, MigrationPromo, SupportTeam, Evidence, ProcessTimeline, BentoGrid, PricingPlans,
  SupportChannels, HelpAndPolicies, Testimonials, TrustSignals, FAQSection, HonestLimits, PageProvenance, CTABand,
  RatingBand, ProductCards, FeatureSpotlight, AdvantageGrid, SolutionsGrid, Ecosystem, ReviewsShowcase, RenewalCost, PlanGuide, VideoEmbed,
]);

export type SectionSpec = z.infer<typeof Section>;
export type SectionType = SectionSpec["type"];
export const SECTION_TYPES = Section.options.map((o) => o.shape.type.value) as readonly SectionType[];
