import { SectionFrame } from "@/components/builder/layout";
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
import SplitHero from "@/components/sections/SplitHero";
import TwoColumn from "@/components/sections/TwoColumn";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { ICON_NAMES } from "@/lib/content/schemas/common";
import { completeItems, image, link, pick, strings, text, type Cta, type Field, type Img } from "../fields";
import { defineBlock } from "./types";

/**
 * The site's own sections and banners, drawn with the components the hand-built pages use. Every word in them is
 * written in the builder: no claims, prices or registries behind them. Headings are H2, except the hero's H1.
 */

const F = BUILDER_TEXT.fields;
type IconName = (typeof ICON_NAMES)[number];

const options = <K extends string | number>(labels: Record<K, string>, cast: (k: string) => K = (k) => k as K) => Object.entries<string>(labels).map(([k, label]) => ({ value: cast(k), label }));
const iconField: Field = { kind: "select", key: "icon", label: F.icon, options: [{ value: "", label: F.noIcon }, ...ICON_NAMES.map((name) => ({ value: name, label: name.replace(/-/g, " ") }))] };
const iconOf = (v: unknown): IconName | undefined => ((ICON_NAMES as readonly string[]).includes(v as string) ? (v as IconName) : undefined);
const eyebrow: Field = { kind: "text", key: "eyebrow", label: F.eyebrow, max: 60 };
const title = (required = true): Field => ({ kind: "text", key: "title", label: required ? F.title : F.titleOptional, max: 120, required });
const description = (key = "description", label: string = F.description, max = 400): Field => ({ kind: "textarea", key, label, max });
const COLUMNS = [3, 2, 4] as const;
const columnsField: Field = { kind: "select", key: "columns", label: F.columns, options: COLUMNS.map((n) => ({ value: n, label: F.columnCount(n) })) };
/** A post's text column is narrow: card and tile grids use at most two columns there. */
const postColumns = (n: 2 | 3 | 4, kind: string): 2 | 3 | 4 => (kind === "post" && n > 2 ? 2 : n);
/** One heading (H2) for the outline, when the section has one. */
const h2 = (t: string | undefined) => (t ? [{ level: 2, text: t }] : []);

export const Hero = defineBlock({
  type: "Hero",
  group: "sections",
  icon: "panel-top",
  kinds: ["page"],
  first: true,
  fields: [
    eyebrow,
    { kind: "text", key: "title", label: F.h1, max: 120, required: true },
    { kind: "text", key: "accent", label: F.accent, help: F.accentHelp, max: 120 },
    { kind: "textarea", key: "description", label: F.lead, max: 400 },
    { kind: "link", key: "primaryCta", label: F.ctaPrimary },
    { kind: "link", key: "secondaryCta", label: F.ctaSecondary },
    { kind: "strings", key: "highlights", label: F.highlights, max: 4, itemMax: 120 },
    { kind: "image", key: "image", label: F.heroImage },
  ],
  prepare: (c) => {
    const t = text(c.title);
    if (!t) return null;
    const accent = text(c.accent);
    return { eyebrow: text(c.eyebrow), title: t, accent: accent && t.endsWith(accent) ? accent : undefined, description: text(c.description), primaryCta: link(c.primaryCta), secondaryCta: link(c.secondaryCta), highlights: strings(c.highlights), image: image(c.image) };
  },
  render: (p, ctx) => {
    const content = {
      eyebrow: p.eyebrow,
      title: p.accent ? p.title.slice(0, -p.accent.length).trimEnd() : p.title,
      titleAccent: p.accent,
      description: p.description ?? "",
      primaryCta: p.primaryCta,
      secondaryCta: p.secondaryCta,
      highlights: p.highlights.length ? p.highlights : undefined,
      className: ctx.band,
    };
    return p.image ? <SplitHero {...content} visual={<Picture image={p.image} className="h-auto w-full rounded-2xl border border-border object-cover shadow-lg" />} /> : <CenteredHero {...content} />;
  },
  headings: (p) => [{ level: 1, text: p.title }],
});

// Staff images come from any https address or the site, so next/image (which needs known hosts) is not used.
const Picture = ({ image: img, className }: { image: Img; className: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className={className} />
);

export const SplitSection = defineBlock({
  type: "SplitSection",
  group: "sections",
  icon: "split",
  banded: true,
  fields: [
    eyebrow,
    title(),
    description("description", F.description, 600),
    { kind: "strings", key: "features", label: F.points, max: 8, itemMax: 160 },
    { kind: "link", key: "ctaPrimary", label: F.ctaPrimary },
    { kind: "link", key: "ctaSecondary", label: F.ctaSecondary },
    { kind: "image", key: "image", label: F.image },
    { kind: "select", key: "imagePosition", label: F.imagePosition, options: options(F.imagePositions) },
  ],
  defaults: () => ({ imagePosition: "right" }),
  prepare: (c) => {
    const t = text(c.title);
    if (!t) return null;
    return { eyebrow: text(c.eyebrow), title: t, description: text(c.description), features: strings(c.features), ctas: [link(c.ctaPrimary), link(c.ctaSecondary)].filter((x): x is Cta => Boolean(x)), image: image(c.image), imagePosition: pick(c.imagePosition, ["right", "left"] as const, "right") };
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
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
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

const cards: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.cards,
  max: 12,
  itemTitle: F.card,
  required: true,
  item: [iconField, { kind: "text", key: "title", label: F.cardTitle, max: 80, required: true }, { kind: "textarea", key: "description", label: F.cardText, max: 400 }, { kind: "link", key: "link", label: F.cardLink }],
  empty: () => ({}),
};

export const FeatureCards = defineBlock({
  type: "FeatureCards",
  group: "sections",
  icon: "layout-grid",
  banded: true,
  fields: [eyebrow, title(false), description(), cards, columnsField, { kind: "select", key: "variant", label: F.cardStyle, options: options(F.cardStyles) }],
  defaults: () => ({ items: [{}, {}, {}], columns: 3, variant: "cards" }),
  prepare: (c) => {
    const items = completeItems(cards, c.items).map((i) => ({ icon: iconOf(i.icon), title: text(i.title)!, description: text(i.description) ?? "", cta: link(i.link) }));
    if (items.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title: text(c.title), description: text(c.description), items, columns: pick(c.columns, COLUMNS, 3), variant: pick(c.variant, ["cards", "divided", "plain"] as const, "cards") };
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <FeatureGrid {...p} columns={postColumns(p.columns, ctx.kind)} className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

const steps: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "steps",
  label: F.steps,
  max: 8,
  itemTitle: F.stepTitle,
  required: true,
  item: [{ kind: "text", key: "title", label: F.stepTitle, max: 80, required: true }, { kind: "textarea", key: "text", label: F.stepText2, max: 300 }],
  empty: () => ({}),
};

export const Steps = defineBlock({
  type: "Steps",
  group: "sections",
  icon: "list-ordered",
  banded: true,
  fields: [eyebrow, title(), description(), steps],
  defaults: () => ({ steps: [{}, {}, {}] }),
  prepare: (c) => {
    const t = text(c.title);
    const list = completeItems(steps, c.steps).map((i) => ({ title: text(i.title)!, description: text(i.text) ?? "" }));
    return t && list.length ? { eyebrow: text(c.eyebrow), title: t, description: text(c.description), steps: list } : null;
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <ProcessTimeline {...p} className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

const questions: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.items,
  max: 20,
  itemTitle: F.question,
  required: true,
  item: [{ kind: "text", key: "question", label: F.question, max: 200, required: true }, { kind: "textarea", key: "answer", label: F.faqAnswer, max: 1500, required: true }],
  empty: () => ({}),
};

export const Faq = defineBlock({
  type: "Faq",
  group: "sections",
  icon: "circle-help",
  banded: true,
  fields: [eyebrow, title(), description(), questions],
  defaults: () => ({ items: [{}, {}, {}] }),
  prepare: (c) => {
    const t = text(c.title);
    const items = completeItems(questions, c.items).map((i) => ({ question: text(i.question)!, answer: text(i.answer)! }));
    return t && items.length ? { eyebrow: text(c.eyebrow), title: t, description: text(c.description), items } : null;
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <FAQSection {...p} className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
  faq: (p) => p.items,
});

const tiles: Extract<Field, { kind: "list" }> = {
  kind: "list",
  key: "items",
  label: F.linkTiles,
  max: 8,
  itemTitle: F.tile,
  required: true,
  item: [
    iconField,
    { kind: "text", key: "title", label: F.tileTitle, max: 60, required: true },
    { kind: "text", key: "line", label: F.tileLine, max: 160 },
    { kind: "text", key: "href", label: F.tileHref, help: F.ctaHrefHelp, max: 2048, format: "href", required: true },
  ],
  empty: () => ({}),
};

export const LinkTiles = defineBlock({
  type: "LinkTiles",
  group: "sections",
  icon: "signpost",
  banded: true,
  fields: [eyebrow, title(), description("intro", F.intro), tiles, { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.tileLayouts) }, columnsField],
  defaults: () => ({ items: [{}, {}, {}], layout: "tiles", columns: 3 }),
  prepare: (c) => {
    const t = text(c.title);
    const items = completeItems(tiles, c.items).map((i) => ({ icon: iconOf(i.icon), title: text(i.title)!, line: text(i.line) ?? "", href: text(i.href)! }));
    if (!t || items.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title: t, intro: text(c.intro), items, layout: pick(c.layout, ["tiles", "palette", "split"] as const, "tiles"), columns: pick(c.columns, COLUMNS, 3) };
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <DestinationBanner {...p} columns={postColumns(p.columns, ctx.kind)} headingLevel="h2" className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

export const CtaBand = defineBlock({
  type: "CtaBand",
  group: "sections",
  icon: "megaphone",
  fields: [title(), description(), { kind: "link", key: "primaryCta", label: F.ctaPrimary, required: true }, { kind: "link", key: "secondaryCta", label: F.ctaSecondary }, { kind: "text", key: "note", label: F.note, max: 200 }],
  prepare: (c) => {
    const t = text(c.title);
    const primaryCta = link(c.primaryCta);
    return t && primaryCta ? { title: t, description: text(c.description), primaryCta, secondaryCta: link(c.secondaryCta), note: text(c.note) } : null;
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <CTABand {...p} className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

const scopeField: Field = { kind: "select", key: "scope", label: F.background, options: options(F.backgrounds) };
const SCOPES = ["ink", "page"] as const;

export const Offer = defineBlock({
  type: "OfferBanner",
  group: "banners",
  icon: "badge-percent",
  fields: [
    eyebrow,
    title(),
    { kind: "textarea", key: "description", label: F.pitch, max: 400 },
    { kind: "link", key: "primaryCta", label: F.ctaPrimary, required: true },
    { kind: "text", key: "ticketLabel", label: F.ticketLabel, help: F.ticketLabelHelp, max: 60 },
    { kind: "text", key: "nextStep", label: F.nextStep, max: 200 },
    { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.offerLayouts) },
    scopeField,
  ],
  prepare: (c) => {
    const t = text(c.title);
    const primaryCta = link(c.primaryCta);
    if (!t || !primaryCta) return null;
    return { eyebrow: text(c.eyebrow), title: t, description: text(c.description) ?? "", primaryCta, planName: text(c.ticketLabel), nextStep: text(c.nextStep), layout: pick(c.layout, ["split", "centered", "compact"] as const, "split"), scope: pick(c.scope, SCOPES, "ink") };
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <OfferBanner {...p} headingLevel="h2" className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

export const Guide = defineBlock({
  type: "GuideBanner",
  group: "banners",
  icon: "map",
  fields: [
    eyebrow,
    title(),
    { kind: "textarea", key: "summary", label: F.summary, max: 500 },
    { kind: "strings", key: "learn", label: F.learn, max: 6, itemMax: 160, required: true },
    { kind: "link", key: "cta", label: F.nextLink },
    { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.guideLayouts) },
    { kind: "toggle", key: "numbered", label: F.numbered },
    scopeField,
  ],
  defaults: () => ({ learn: ["", "", ""], layout: "line", numbered: true, scope: "ink" }),
  prepare: (c) => {
    const t = text(c.title);
    const learn = strings(c.learn);
    if (!t || learn.length === 0) return null;
    return { eyebrow: text(c.eyebrow), title: t, summary: text(c.summary) ?? "", learn, cta: link(c.cta), layout: pick(c.layout, ["line", "vertical"] as const, "line"), numbered: c.numbered === true, scope: pick(c.scope, SCOPES, "ink") };
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <GuideBanner {...p} headingLevel="h2" className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.title),
});

export const Action = defineBlock({
  type: "ActionBand",
  group: "banners",
  icon: "mouse-pointer-click",
  fields: [
    { kind: "text", key: "label", label: F.bandLabel, max: 80, required: true },
    { kind: "text", key: "line", label: F.bandLine, max: 200 },
    { kind: "link", key: "cta", label: F.ctaPrimary, required: true },
    { kind: "text", key: "note", label: F.note, max: 200 },
    { kind: "select", key: "variant", label: F.bannerLayout, options: options(F.bandVariants) },
  ],
  prepare: (c) => {
    const label = text(c.label);
    const cta = link(c.cta);
    return label && cta ? { label, line: text(c.line) ?? "", cta, note: text(c.note), variant: pick(c.variant, ["split", "orange", "pill"] as const, "split") } : null;
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <ActionBand {...p} headingLevel="h2" className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.label),
});

export const Answer = defineBlock({
  type: "AnswerBanner",
  group: "banners",
  icon: "message-circle-question",
  fields: [
    eyebrow,
    { kind: "text", key: "question", label: F.question, max: 200, required: true },
    { kind: "textarea", key: "answer", label: F.faqAnswer, max: 1200, required: true },
    { kind: "link", key: "next", label: F.nextLink },
    { kind: "select", key: "layout", label: F.bannerLayout, options: options(F.answerLayouts) },
  ],
  prepare: (c) => {
    const question = text(c.question);
    const answer = text(c.answer);
    return question && answer ? { eyebrow: text(c.eyebrow), question, answer, next: link(c.next), layout: pick(c.layout, ["entry", "margin", "centered"] as const, "entry") } : null;
  },
  render: (p, ctx) => (
    <SectionFrame ctx={ctx}>
      <AnswerBanner {...p} headingLevel="h2" className={ctx.band} />
    </SectionFrame>
  ),
  headings: (p) => h2(p.question),
});
