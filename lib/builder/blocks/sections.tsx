import ActionBand from "@/components/sections/banners/ActionBand";
import AnswerBanner from "@/components/sections/banners/AnswerBanner";
import DestinationBanner from "@/components/sections/banners/DestinationBanner";
import GuideBanner from "@/components/sections/banners/GuideBanner";
import OfferBanner from "@/components/sections/banners/OfferBanner";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import TwoColumn from "@/components/sections/TwoColumn";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { ICON_NAMES } from "@/lib/content/schemas/common";
import { showPrices } from "@/lib/flags";
import { buildPlanCards } from "@/lib/pricing/plans";
import type { ComponentProps, ComponentType } from "react";
import { completeItems, hasContent, image, link, pick, strings, text, type Cta, type Field, type Img, type Props } from "../fields";
import { defineBlock } from "./types";

/**
 * The site's own sections and banners, drawn with the components the hand-built pages use. Every word in them is
 * written in the builder: no claims, prices or registries behind them. Headings are H2, except the first hero's H1 on a
 * page. Nothing is required: a section shows as soon as anything in it is filled in, and leaves out what is empty.
 */

const F = BUILDER_TEXT.fields;
type IconName = (typeof ICON_NAMES)[number];

const options = <K extends string | number>(labels: Record<K, string>, cast: (k: string) => K = (k) => k as K) => Object.entries<string>(labels).map(([k, label]) => ({ value: cast(k), label }));
const iconField: Field = { kind: "select", key: "icon", label: F.icon, options: [{ value: "", label: F.noIcon }, ...ICON_NAMES.map((name) => ({ value: name, label: name.replace(/-/g, " ") }))] };
const iconOf = (v: unknown): IconName | undefined => ((ICON_NAMES as readonly string[]).includes(v as string) ? (v as IconName) : undefined);
const eyebrow: Field = { kind: "text", key: "eyebrow", label: F.eyebrow, max: 60 };
const title: Field = { kind: "text", key: "title", label: F.title, max: 120 };
const description = (key = "description", label: string = F.description, max = 400): Field => ({ kind: "textarea", key, label, max });
const COLUMNS = [3, 2, 4] as const;
const columnsField: Field = { kind: "select", key: "columns", label: F.columns, options: COLUMNS.map((n) => ({ value: n, label: F.columnCount(n) })) };
/** One heading (H2) for the outline, when the section has one. */
const h2 = (t: string | undefined) => (t ? [{ level: 2, text: t }] : []);
/** The props when anything in them shows, otherwise null (the block then shows nothing). */
const shown = (fields: readonly Field[], c: Props) => (hasContent(fields, c) ? c : null);

// The "lines" look of the site FAQ (FAQSection `variant`), typed here until every checkout of FAQSection has it.
const Faqs = FAQSection as ComponentType<ComponentProps<typeof FAQSection> & { variant?: "cards" | "lines" }>;

const heroFields: Field[] = [
  eyebrow,
  { kind: "text", key: "title", label: F.h1, max: 120 },
  { kind: "text", key: "accent", label: F.accent, help: F.accentHelp, max: 120 },
  { kind: "textarea", key: "description", label: F.lead, max: 400 },
  { kind: "link", key: "primaryCta", label: F.ctaPrimary },
  { kind: "link", key: "secondaryCta", label: F.ctaSecondary },
  { kind: "strings", key: "highlights", label: F.highlights, max: 4, itemMax: 120 },
];

export const Hero = defineBlock({
  type: "CenteredHero",
  group: "sections",
  icon: "panel-top",
  hero: true,
  fields: heroFields,
  prepare: (c) => {
    if (!shown(heroFields, c)) return null;
    const t = text(c.title);
    const accent = text(c.accent);
    const split = Boolean(t && accent && t.endsWith(accent) && t !== accent);
    return {
      eyebrow: text(c.eyebrow),
      title: split ? t!.slice(0, -accent!.length).trimEnd() : t,
      fullTitle: t,
      accent: split ? accent : undefined,
      description: text(c.description),
      primaryCta: link(c.primaryCta),
      secondaryCta: link(c.secondaryCta),
      highlights: strings(c.highlights),
    };
  },
  render: (p, ctx) => (
    <CenteredHero
      eyebrow={p.eyebrow}
      title={p.title}
      titleAccent={p.accent}
      description={p.description}
      primaryCta={p.primaryCta}
      secondaryCta={p.secondaryCta}
      highlights={p.highlights.length ? p.highlights : undefined}
      headingLevel={ctx.h1 ? "h1" : "h2"}
      className={ctx.band}
    />
  ),
  headings: (p, h1) => (p.fullTitle ? [{ level: h1 ? 1 : 2, text: p.fullTitle }] : []),
});

// Staff images come from any https address or the site, so next/image (which needs known hosts) is not used.
const Picture = ({ image: img, className }: { image: Img; className: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className={className} />
);

const splitFields: Field[] = [
  eyebrow,
  title,
  description("description", F.description, 600),
  { kind: "strings", key: "features", label: F.points, max: 8, itemMax: 160 },
  { kind: "link", key: "ctaPrimary", label: F.ctaPrimary },
  { kind: "link", key: "ctaSecondary", label: F.ctaSecondary },
  { kind: "image", key: "image", label: F.image },
  { kind: "select", key: "imagePosition", label: F.imagePosition, options: options(F.imagePositions) },
];

export const SplitSection = defineBlock({
  type: "SplitSection",
  group: "sections",
  icon: "split",
  banded: true,
  fields: splitFields,
  defaults: () => ({ imagePosition: "right" }),
  prepare: (c) =>
    shown(splitFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      description: text(c.description),
      features: strings(c.features),
      ctas: [link(c.ctaPrimary), link(c.ctaSecondary)].filter((x): x is Cta => Boolean(x)),
      image: image(c.image),
      imagePosition: pick(c.imagePosition, ["right", "left"] as const, "right"),
    },
  render: (p, ctx) => (
    <TwoColumn
      eyebrow={p.eyebrow}
      title={p.title}
      description={p.description}
      features={p.features}
      cta={p.ctas.map((c, i) => ({ ...c, variant: i === 0 ? "primary" : "secondary" }))}
      visualPosition={p.imagePosition}
      visual={p.image ? <Picture image={p.image} className="h-auto w-full rounded-2xl border border-border object-cover" /> : null}
      className={ctx.band}
    />
  ),
  headings: (p) => h2(p.title),
});

const cards: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.cards,
  max: 12,
  itemTitle: F.card,
  item: [iconField, { kind: "text", key: "title", label: F.cardTitle, max: 80 }, { kind: "textarea", key: "description", label: F.cardText, max: 400 }, { kind: "link", key: "link", label: F.cardLink }],
  empty: () => ({}),
};
const cardFields: Field[] = [eyebrow, title, description(), cards, columnsField, { kind: "select", key: "variant", label: F.cardStyle, options: options(F.cardStyles) }];

export const FeatureCards = defineBlock({
  type: "FeatureCards",
  group: "sections",
  icon: "layout-grid",
  banded: true,
  fields: cardFields,
  defaults: () => ({ items: [{}, {}, {}], columns: 3, variant: "cards" }),
  prepare: (c) =>
    shown(cardFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      description: text(c.description),
      items: completeItems(cards, c.items).map((i) => ({ icon: iconOf(i.icon), title: text(i.title) ?? "", description: text(i.description) ?? "", cta: link(i.link) })),
      columns: pick(c.columns, COLUMNS, 3),
      variant: pick(c.variant, ["cards", "divided", "plain"] as const, "cards"),
    },
  render: (p, ctx) => <FeatureGrid {...p} className={ctx.band} />,
  headings: (p) => h2(p.title),
});

const steps: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "steps",
  label: F.steps,
  max: 8,
  itemTitle: F.stepTitle,
  item: [{ kind: "text", key: "title", label: F.stepTitle, max: 80 }, { kind: "textarea", key: "text", label: F.stepText2, max: 300 }],
  empty: () => ({}),
};
const stepFields: Field[] = [eyebrow, title, description(), steps];

export const Steps = defineBlock({
  type: "Steps",
  group: "sections",
  icon: "list-ordered",
  banded: true,
  fields: stepFields,
  defaults: () => ({ steps: [{}, {}, {}] }),
  prepare: (c) =>
    shown(stepFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      description: text(c.description),
      steps: completeItems(steps, c.steps).map((i) => ({ title: text(i.title) ?? "", description: text(i.text) ?? "" })),
    },
  render: (p, ctx) => <ProcessTimeline {...p} className={ctx.band} />,
  headings: (p) => h2(p.title),
});

const questions: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.items,
  max: 20,
  itemTitle: F.question,
  item: [{ kind: "text", key: "question", label: F.question, max: 200 }, { kind: "textarea", key: "answer", label: F.faqAnswer, max: 1500 }],
  empty: () => ({}),
};
const faqFields: Field[] = [eyebrow, title, description(), questions];

export const Faq = defineBlock({
  type: "Faq",
  group: "sections",
  icon: "circle-help",
  banded: true,
  fields: faqFields,
  defaults: () => ({ items: [{}, {}, {}] }),
  prepare: (c) =>
    shown(faqFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      description: text(c.description),
      items: completeItems(questions, c.items).map((i) => ({ question: text(i.question) ?? "", answer: text(i.answer) ?? "" })),
    },
  render: (p, ctx) => <Faqs {...p} variant="lines" className={ctx.band} />,
  headings: (p) => h2(p.title),
  // Structured data needs both halves of each entry.
  faq: (p) => p.items.filter((i) => i.question && i.answer),
});

const tiles: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.linkTiles,
  max: 8,
  itemTitle: F.tile,
  item: [
    iconField,
    { kind: "text", key: "title", label: F.tileTitle, max: 60 },
    { kind: "text", key: "line", label: F.tileLine, max: 160 },
    { kind: "text", key: "href", label: F.tileHref, help: F.ctaHrefHelp, max: 2048, format: "href" },
  ],
  empty: () => ({}),
};
const tileFields: Field[] = [eyebrow, title, description("intro", F.intro), tiles, { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.tileLayouts) }, columnsField];

export const LinkTiles = defineBlock({
  type: "LinkTiles",
  group: "sections",
  icon: "signpost",
  banded: true,
  fields: tileFields,
  defaults: () => ({ items: [{}, {}, {}], layout: "tiles", columns: 3 }),
  prepare: (c) =>
    shown(tileFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      intro: text(c.intro),
      // A tile is a link: it shows once it has somewhere to go.
      items: completeItems(tiles, c.items).flatMap((i) => (link({ label: text(i.title) ?? text(i.href), href: i.href }) ? [{ icon: iconOf(i.icon), title: text(i.title) ?? text(i.href)!, line: text(i.line) ?? "", href: text(i.href)! }] : [])),
      layout: pick(c.layout, ["tiles", "palette", "split"] as const, "tiles"),
      columns: pick(c.columns, COLUMNS, 3),
    },
  render: (p, ctx) => <DestinationBanner {...p} headingLevel="h2" className={ctx.band} />,
  headings: (p) => h2(p.title),
});

const ctaFields: Field[] = [title, description(), { kind: "link", key: "primaryCta", label: F.ctaPrimary }, { kind: "link", key: "secondaryCta", label: F.ctaSecondary }, { kind: "text", key: "note", label: F.note, max: 200 }];

export const CtaBand = defineBlock({
  type: "CtaBand",
  group: "sections",
  icon: "megaphone",
  fields: ctaFields,
  prepare: (c) => shown(ctaFields, c) && { title: text(c.title), description: text(c.description), primaryCta: link(c.primaryCta), secondaryCta: link(c.secondaryCta), note: text(c.note) },
  render: (p, ctx) => <CTABand {...p} className={ctx.band} />,
  headings: (p) => h2(p.title),
});

const scopeField: Field = { kind: "select", key: "scope", label: F.background, options: options(F.backgrounds) };
const SCOPES = ["ink", "page"] as const;

const offerFields: Field[] = [
  eyebrow,
  title,
  { kind: "textarea", key: "description", label: F.pitch, max: 400 },
  { kind: "link", key: "primaryCta", label: F.ctaPrimary },
  { kind: "text", key: "ticketLabel", label: F.ticketLabel, help: F.ticketLabelHelp, max: 60 },
  { kind: "text", key: "nextStep", label: F.nextStep, max: 200 },
  scopeField,
];

/** The offer ticket in one fixed layout. Never a price: prices come only from data/pricing.json, never from the builder. */
const offer = (type: string, layout: "split" | "centered", icon: string) =>
  defineBlock({
    type,
    group: "banners",
    icon,
    fields: offerFields,
    prepare: (c) =>
      shown(offerFields, c) && {
        eyebrow: text(c.eyebrow),
        title: text(c.title),
        description: text(c.description),
        primaryCta: link(c.primaryCta),
        planName: text(c.ticketLabel),
        nextStep: text(c.nextStep),
        scope: pick(c.scope, SCOPES, "ink"),
      },
    render: (p, ctx) => <OfferBanner {...p} layout={layout} headingLevel="h2" className={ctx.band} />,
    headings: (p) => h2(p.title),
  });

export const OfferSplit = offer("OfferSplit", "split", "ticket");
export const OfferCentered = offer("OfferCentered", "centered", "badge-percent");

const guideFields: Field[] = [
  eyebrow,
  title,
  { kind: "textarea", key: "summary", label: F.summary, max: 500 },
  { kind: "strings", key: "learn", label: F.learn, max: 6, itemMax: 160 },
  { kind: "link", key: "cta", label: F.nextLink },
  { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.guideLayouts) },
  { kind: "toggle", key: "numbered", label: F.numbered },
  scopeField,
];

export const Guide = defineBlock({
  type: "GuideBanner",
  group: "banners",
  icon: "map",
  fields: guideFields,
  defaults: () => ({ learn: ["", "", ""], layout: "line", numbered: true, scope: "ink" }),
  prepare: (c) =>
    shown(guideFields, c) && {
      eyebrow: text(c.eyebrow),
      title: text(c.title),
      summary: text(c.summary),
      learn: strings(c.learn),
      cta: link(c.cta),
      layout: pick(c.layout, ["line", "vertical"] as const, "line"),
      numbered: c.numbered === true,
      scope: pick(c.scope, SCOPES, "ink"),
    },
  render: (p, ctx) => <GuideBanner {...p} headingLevel="h2" className={ctx.band} />,
  headings: (p) => h2(p.title),
});

/** Plans with a published price (custom-priced plans have none to show). Names and prices come from data/pricing.json. */
const PRICED_PLANS = buildPlanCards().filter((plan) => !plan.custom);
const PLAN_IDS = ["", ...PRICED_PLANS.map((plan) => plan.id)] as const;

const actionFields: Field[] = [
  { kind: "text", key: "label", label: F.bandLabel, max: 80 },
  { kind: "text", key: "line", label: F.bandLine, max: 200 },
  { kind: "select", key: "plan", label: F.plan, help: F.planHelp, options: [{ value: "", label: F.noPlan }, ...PRICED_PLANS.map((plan) => ({ value: plan.id, label: plan.name }))] },
  { kind: "link", key: "cta", label: F.ctaPrimary },
  { kind: "text", key: "note", label: F.note, max: 200 },
];

/**
 * A plan's price for the orange block: read from data/pricing.json through lib/pricing at render time, so the page
 * stores only the plan id and a price change shows everywhere at once. Hidden while prices are (FEATURES.pricesConfirmed).
 */
function planPrice(planId: string) {
  const plan = planId && showPrices() ? PRICED_PLANS.find((p) => p.id === planId) : undefined;
  return plan?.annual ? { amount: plan.annual, period: F.pricePeriod, renewal: plan.renewal ?? undefined } : undefined;
}

/** The plan on navy; its price (picked from the price list, never typed) and the action on the orange block. */
export const Action = defineBlock({
  type: "ActionBand",
  group: "banners",
  icon: "mouse-pointer-click",
  fields: actionFields,
  prepare: (c) => shown(actionFields, c) && { label: text(c.label), line: text(c.line), plan: pick(c.plan, PLAN_IDS, ""), cta: link(c.cta), note: text(c.note) },
  render: ({ plan, note, ...p }, ctx) => {
    const price = planPrice(plan);
    // A price always has the tax line near it; the band's own note replaces it only when there is no price.
    return <ActionBand {...p} price={price} note={price ? (note ? `${note} ${F.taxLine}` : F.taxLine) : note} variant="split" headingLevel="h2" className={ctx.band} />;
  },
  headings: (p) => h2(p.label),
});

const answerFields: Field[] = [
  eyebrow,
  { kind: "text", key: "question", label: F.question, max: 200 },
  { kind: "textarea", key: "answer", label: F.faqAnswer, max: 1200 },
  { kind: "link", key: "next", label: F.nextLink },
  { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.answerLayouts) },
];

export const Answer = defineBlock({
  type: "AnswerBanner",
  group: "banners",
  icon: "message-circle-question",
  fields: answerFields,
  prepare: (c) => shown(answerFields, c) && { eyebrow: text(c.eyebrow), question: text(c.question), answer: text(c.answer), next: link(c.next), layout: pick(c.layout, ["entry", "margin", "centered"] as const, "entry") },
  render: (p, ctx) => <AnswerBanner {...p} headingLevel="h2" className={ctx.band} />,
  headings: (p) => h2(p.question),
});
