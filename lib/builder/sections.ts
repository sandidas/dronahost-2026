import { z } from "zod";
import { ICON_NAMES } from "@/lib/content/schemas/common";
import { isSafeImageSrc, isSafeLinkHref } from "@/lib/editor/urls";

/**
 * The page builder's sections. Every word in them is written in the builder: no claims, prices or registries behind
 * them. One definition serves the editor canvas and the public page:
 *
 *   SECTION_SCHEMAS  what may be stored (sizes and shapes only, so a half-written draft always saves);
 *   prepareSection   the stored content cleaned for display: empty strings dropped, unsafe links and images dropped,
 *                    incomplete list items left out. The canvas and the public page both render its result, so they show
 *                    the same thing;
 *   sectionProblems  what a person must finish before publishing (a missing heading, a button without a link, ...).
 *
 * Client-safe: the canvas runs all three in the browser as you type.
 */

export const SECTION_TYPES = ["Hero", "SplitSection", "FeatureCards", "Steps", "Faq", "LinkTiles", "CtaBand", "OfferBanner", "GuideBanner", "ActionBand", "AnswerBanner"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];
export const isSectionType = (v: unknown): v is SectionType => typeof v === "string" && (SECTION_TYPES as readonly string[]).includes(v);

export type Cta = { label: string; href: string };
export type Img = { src: string; alt: string };
export type IconName = (typeof ICON_NAMES)[number];

// ─── Stored shapes ────────────────────────────────────────────────────────────

const str = (max: number) => z.string().max(max).optional();
const cta = z.strictObject({ label: z.string().max(60), href: z.string().max(2048) }).optional();
const img = z.strictObject({ src: z.string().max(2048), alt: z.string().max(200) }).optional();
const strings = (n: number, max: number) => z.array(z.string().max(max)).max(n).optional();
const icon = z.enum(ICON_NAMES).optional();

export const SECTION_SCHEMAS = {
  Hero: z.strictObject({ eyebrow: str(60), title: str(120), accent: str(120), description: str(400), primaryCta: cta, secondaryCta: cta, highlights: strings(4, 120), image: img }),
  SplitSection: z.strictObject({ eyebrow: str(60), title: str(120), description: str(600), features: strings(8, 160), ctaPrimary: cta, ctaSecondary: cta, image: img, imagePosition: z.enum(["left", "right"]).optional() }),
  FeatureCards: z.strictObject({
    eyebrow: str(60),
    title: str(120),
    description: str(400),
    items: z.array(z.strictObject({ icon, title: str(80), description: str(400), link: cta })).max(12).optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    variant: z.enum(["cards", "divided", "plain"]).optional(),
  }),
  Steps: z.strictObject({ eyebrow: str(60), title: str(120), description: str(400), steps: z.array(z.strictObject({ title: str(80), text: str(300) })).max(8).optional() }),
  Faq: z.strictObject({ eyebrow: str(60), title: str(120), description: str(400), items: z.array(z.strictObject({ question: str(200), answer: str(1500) })).max(20).optional() }),
  LinkTiles: z.strictObject({
    eyebrow: str(60),
    title: str(120),
    intro: str(400),
    items: z.array(z.strictObject({ icon, title: str(60), line: str(160), href: z.string().max(2048).optional() })).max(8).optional(),
    layout: z.enum(["palette", "split", "tiles"]).optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  }),
  CtaBand: z.strictObject({ title: str(120), description: str(400), primaryCta: cta, secondaryCta: cta, note: str(200) }),
  OfferBanner: z.strictObject({
    eyebrow: str(60),
    title: str(120),
    description: str(400),
    primaryCta: cta,
    ticketLabel: str(60),
    nextStep: str(200),
    layout: z.enum(["split", "centered", "compact"]).optional(),
    scope: z.enum(["ink", "page"]).optional(),
  }),
  GuideBanner: z.strictObject({ eyebrow: str(60), title: str(120), summary: str(500), learn: strings(6, 160), cta, layout: z.enum(["line", "vertical"]).optional(), numbered: z.boolean().optional(), scope: z.enum(["ink", "page"]).optional() }),
  ActionBand: z.strictObject({ label: str(80), line: str(200), cta, note: str(200), variant: z.enum(["split", "orange", "pill"]).optional() }),
  AnswerBanner: z.strictObject({ eyebrow: str(60), question: str(200), answer: str(1200), next: cta, layout: z.enum(["entry", "margin", "centered"]).optional() }),
} satisfies Record<SectionType, z.ZodType>;

export type SectionContent = { [K in SectionType]: z.infer<(typeof SECTION_SCHEMAS)[K]> };

// ─── Cleaning for display ─────────────────────────────────────────────────────

const text = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
/** A button shows only with a label and a safe link (a site path, https://, http:// or mailto:). */
export const link = (v: unknown): Cta | undefined => {
  const c = v as Partial<Cta> | undefined;
  const label = text(c?.label);
  const href = text(c?.href);
  return label && href && isSafeLinkHref(href) ? { label, href } : undefined;
};
const image = (v: unknown): Img | undefined => {
  const i = v as Partial<Img> | undefined;
  const src = text(i?.src);
  return src && isSafeImageSrc(src) ? { src, alt: text(i?.alt) ?? "" } : undefined;
};
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(text).filter((s): s is string => Boolean(s)) : []);
const items = <T>(v: unknown, keep: (item: Record<string, unknown>) => T | undefined): T[] =>
  Array.isArray(v) ? v.flatMap((i) => (i && typeof i === "object" ? [keep(i as Record<string, unknown>)].filter((x): x is T => x !== undefined) : [])) : [];
const iconOf = (v: unknown): IconName | undefined => ((ICON_NAMES as readonly string[]).includes(v as string) ? (v as IconName) : undefined);

/** What each section renders with. Undefined fields are simply not shown. */
export type Prepared = {
  Hero: { eyebrow?: string; title: string; accent?: string; description?: string; primaryCta?: Cta; secondaryCta?: Cta; highlights: string[]; image?: Img };
  SplitSection: { eyebrow?: string; title: string; description?: string; features: string[]; ctas: Cta[]; image?: Img; imagePosition: "left" | "right" };
  FeatureCards: { eyebrow?: string; title?: string; description?: string; items: { icon?: IconName; title: string; description: string; link?: Cta }[]; columns: 2 | 3 | 4; variant: "cards" | "divided" | "plain" };
  Steps: { eyebrow?: string; title: string; description?: string; steps: { title: string; description: string }[] };
  Faq: { eyebrow?: string; title: string; description?: string; items: { question: string; answer: string }[] };
  LinkTiles: { eyebrow?: string; title: string; intro?: string; items: { icon?: IconName; title: string; line: string; href: string }[]; layout: "palette" | "split" | "tiles"; columns: 2 | 3 | 4 };
  CtaBand: { title: string; description?: string; primaryCta: Cta; secondaryCta?: Cta; note?: string };
  OfferBanner: { eyebrow?: string; title: string; description: string; primaryCta: Cta; ticketLabel?: string; nextStep?: string; layout: "split" | "centered" | "compact"; scope: "ink" | "page" };
  GuideBanner: { eyebrow?: string; title: string; summary: string; learn: string[]; cta?: Cta; layout: "line" | "vertical"; numbered: boolean; scope: "ink" | "page" };
  ActionBand: { label: string; line: string; cta: Cta; note?: string; variant: "split" | "orange" | "pill" };
  AnswerBanner: { eyebrow?: string; question: string; answer: string; next?: Cta; layout: "entry" | "margin" | "centered" };
};

type C = Record<string, unknown>;
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => ((allowed as readonly unknown[]).includes(v) ? (v as T) : fallback);
const cols = (v: unknown): 2 | 3 | 4 => (v === 2 || v === 4 ? v : 3);

const PREPARE: { [K in SectionType]: (c: C) => Prepared[K] | null } = {
  Hero: (c) => {
    const title = text(c.title);
    if (!title) return null;
    const accent = text(c.accent);
    return { eyebrow: text(c.eyebrow), title, accent: accent && title.endsWith(accent) ? accent : undefined, description: text(c.description), primaryCta: link(c.primaryCta), secondaryCta: link(c.secondaryCta), highlights: list(c.highlights), image: image(c.image) };
  },
  SplitSection: (c) => {
    const title = text(c.title);
    if (!title) return null;
    return { eyebrow: text(c.eyebrow), title, description: text(c.description), features: list(c.features), ctas: [link(c.ctaPrimary), link(c.ctaSecondary)].filter((x): x is Cta => Boolean(x)), image: image(c.image), imagePosition: pick(c.imagePosition, ["left", "right"], "right") };
  },
  FeatureCards: (c) => {
    const cards = items(c.items, (i) => {
      const title = text(i.title);
      return title ? { icon: iconOf(i.icon), title, description: text(i.description) ?? "", link: link(i.link) } : undefined;
    });
    if (cards.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title: text(c.title), description: text(c.description), items: cards, columns: cols(c.columns), variant: pick(c.variant, ["cards", "divided", "plain"], "cards") };
  },
  Steps: (c) => {
    const title = text(c.title);
    const steps = items(c.steps, (i) => {
      const t = text(i.title);
      return t ? { title: t, description: text(i.text) ?? "" } : undefined;
    });
    if (!title || steps.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title, description: text(c.description), steps };
  },
  Faq: (c) => {
    const title = text(c.title);
    const qa = items(c.items, (i) => {
      const question = text(i.question);
      const answer = text(i.answer);
      return question && answer ? { question, answer } : undefined;
    });
    if (!title || qa.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title, description: text(c.description), items: qa };
  },
  LinkTiles: (c) => {
    const title = text(c.title);
    const tiles = items(c.items, (i) => {
      const t = text(i.title);
      const href = text(i.href);
      return t && href && isSafeLinkHref(href) ? { icon: iconOf(i.icon), title: t, line: text(i.line) ?? "", href } : undefined;
    });
    if (!title || tiles.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title, intro: text(c.intro), items: tiles, layout: pick(c.layout, ["palette", "split", "tiles"], "tiles"), columns: cols(c.columns) };
  },
  CtaBand: (c) => {
    const title = text(c.title);
    const primaryCta = link(c.primaryCta);
    if (!title || !primaryCta) return null;
    return { title, description: text(c.description), primaryCta, secondaryCta: link(c.secondaryCta), note: text(c.note) };
  },
  OfferBanner: (c) => {
    const title = text(c.title);
    const primaryCta = link(c.primaryCta);
    if (!title || !primaryCta) return null;
    return { eyebrow: text(c.eyebrow), title, description: text(c.description) ?? "", primaryCta, ticketLabel: text(c.ticketLabel), nextStep: text(c.nextStep), layout: pick(c.layout, ["split", "centered", "compact"], "split"), scope: pick(c.scope, ["ink", "page"], "ink") };
  },
  GuideBanner: (c) => {
    const title = text(c.title);
    const learn = list(c.learn);
    if (!title || learn.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title, summary: text(c.summary) ?? "", learn, cta: link(c.cta), layout: pick(c.layout, ["line", "vertical"], "line"), numbered: c.numbered === true, scope: pick(c.scope, ["ink", "page"], "ink") };
  },
  ActionBand: (c) => {
    const label = text(c.label);
    const ctaLink = link(c.cta);
    if (!label || !ctaLink) return null;
    return { label, line: text(c.line) ?? "", cta: ctaLink, note: text(c.note), variant: pick(c.variant, ["split", "orange", "pill"], "split") };
  },
  AnswerBanner: (c) => {
    const question = text(c.question);
    const answer = text(c.answer);
    if (!question || !answer) return null;
    return { eyebrow: text(c.eyebrow), question, answer, next: link(c.next), layout: pick(c.layout, ["entry", "margin", "centered"], "entry") };
  },
};

/** The section ready to render, or null when it has nothing to show yet. Used by the canvas and the public page alike. */
export function prepareSection<K extends SectionType>(type: K, content: unknown): Prepared[K] | null {
  // An unknown type (for example from a newer or older document) shows nothing rather than breaking the page.
  const prepare = PREPARE[type] as ((c: C) => Prepared[K] | null) | undefined;
  return prepare ? prepare((content && typeof content === "object" ? content : {}) as C) : null;
}

// ─── What to finish before publishing ─────────────────────────────────────────

/** Problem codes; the editor turns them into sentences (BUILDER_PROBLEMS.section in content/portal-strings.ts). */
export type SectionProblem =
  | { code: "missing"; field: string }
  | { code: "badLink"; field: string }
  | { code: "badImage"; field: string }
  | { code: "imageAlt"; field: string }
  | { code: "incompleteItem"; field: string; index: number }
  | { code: "noItems"; field: string };

const REQUIRED_TEXT: { [K in SectionType]?: string[] } = {
  Hero: ["title"],
  SplitSection: ["title"],
  Steps: ["title"],
  Faq: ["title"],
  LinkTiles: ["title"],
  CtaBand: ["title"],
  OfferBanner: ["title"],
  GuideBanner: ["title"],
  ActionBand: ["label"],
  AnswerBanner: ["question", "answer"],
};
const REQUIRED_LINKS: { [K in SectionType]?: string[] } = { CtaBand: ["primaryCta"], OfferBanner: ["primaryCta"], ActionBand: ["cta"] };
const OPTIONAL_LINKS: { [K in SectionType]?: string[] } = {
  Hero: ["primaryCta", "secondaryCta"],
  SplitSection: ["ctaPrimary", "ctaSecondary"],
  CtaBand: ["secondaryCta"],
  GuideBanner: ["cta"],
  AnswerBanner: ["next"],
};
const LISTS: { [K in SectionType]?: { field: string; complete: (i: C) => boolean; started: (i: C) => boolean } } = {
  FeatureCards: { field: "items", complete: (i) => Boolean(text(i.title)), started: (i) => Boolean(text(i.title) || text(i.description)) },
  Steps: { field: "steps", complete: (i) => Boolean(text(i.title)), started: (i) => Boolean(text(i.title) || text(i.text)) },
  Faq: { field: "items", complete: (i) => Boolean(text(i.question) && text(i.answer)), started: (i) => Boolean(text(i.question) || text(i.answer)) },
  LinkTiles: { field: "items", complete: (i) => Boolean(text(i.title) && text(i.href) && isSafeLinkHref(text(i.href))), started: (i) => Boolean(text(i.title) || text(i.line) || text(i.href)) },
};

const typedLink = (v: unknown) => {
  const c = v as Partial<Cta> | undefined;
  return Boolean(text(c?.label) || text(c?.href));
};

/** Everything that would be missing or left out on the live page. Empty means the section shows exactly as written. */
export function sectionProblems(type: SectionType, raw: unknown): SectionProblem[] {
  const c = (raw && typeof raw === "object" ? raw : {}) as C;
  const out: SectionProblem[] = [];
  for (const field of REQUIRED_TEXT[type] ?? []) if (!text(c[field])) out.push({ code: "missing", field });
  for (const field of REQUIRED_LINKS[type] ?? []) if (!link(c[field])) out.push({ code: typedLink(c[field]) ? "badLink" : "missing", field });
  for (const field of OPTIONAL_LINKS[type] ?? []) if (typedLink(c[field]) && !link(c[field])) out.push({ code: "badLink", field });
  const l = LISTS[type];
  if (l) {
    const arr = Array.isArray(c[l.field]) ? (c[l.field] as C[]) : [];
    arr.forEach((item, index) => {
      if (item && l.started(item) && !l.complete(item)) out.push({ code: "incompleteItem", field: l.field, index });
    });
    if (!arr.some((i) => i && l.complete(i))) out.push({ code: "noItems", field: l.field });
  }
  if (type === "GuideBanner" && list(c.learn).length === 0) out.push({ code: "noItems", field: "learn" });
  if (type === "Hero" || type === "SplitSection") {
    const i = c.image as Partial<Img> | undefined;
    if (text(i?.src) && !image(i)) out.push({ code: "badImage", field: "image" });
    else if (image(i) && !text(i?.alt)) out.push({ code: "imageAlt", field: "image" });
  }
  return out;
}

/** Keys that hold addresses or settings, not words a reader sees. */
const NOT_TEXT = new Set(["href", "src", "icon", "layout", "variant", "scope", "style", "tone", "imagePosition", "columns", "numbered"]);

/** The text a section shows, for reading time and search checks. */
export function sectionText(type: SectionType, raw: unknown): string {
  const p = prepareSection(type, raw);
  if (!p) return "";
  const parts: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") parts.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!NOT_TEXT.has(k)) walk(x);
  };
  walk(p);
  return parts.join(" ");
}
