import type { ReactNode } from "react";
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
import { prepareSection, type Img, type Prepared, type SectionType } from "@/lib/builder/sections";

/**
 * Draws one builder section with the site's own components. Used unchanged by the editor canvas (in the browser, as you
 * type) and by the public page (on the server), so both show the same thing. Returns null while the section has nothing
 * to show. Headings are H2, except the hero's H1 (pages only; a post's title is its H1).
 */

// Staff images come from any https address or the site, so next/image (which needs known hosts) is not used.
const Picture = ({ image, className }: { image: Img; className: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className={className} />
);

const RENDER: { [K in SectionType]: (p: Prepared[K], className?: string, inPost?: boolean) => ReactNode } = {
  Hero: (p, className) => {
    const content = {
      eyebrow: p.eyebrow,
      title: p.accent ? p.title.slice(0, -p.accent.length).trimEnd() : p.title,
      titleAccent: p.accent,
      description: p.description ?? "",
      primaryCta: p.primaryCta,
      secondaryCta: p.secondaryCta,
      highlights: p.highlights.length ? p.highlights : undefined,
      className,
    };
    return p.image ? <SplitHero {...content} visual={<Picture image={p.image} className="h-auto w-full rounded-2xl border border-border object-cover shadow-lg" />} /> : <CenteredHero {...content} />;
  },
  SplitSection: (p, className) => (
    <TwoColumn
      eyebrow={p.eyebrow}
      title={p.title}
      description={p.description}
      features={p.features}
      cta={p.ctas.map((c, i) => ({ ...c, variant: i === 0 ? "primary" : "secondary" }))}
      visualPosition={p.imagePosition}
      visual={p.image ? <Picture image={p.image} className="h-auto w-full rounded-2xl border border-border object-cover" /> : null}
      className={className}
    />
  ),
  FeatureCards: (p, className, inPost) => <FeatureGrid eyebrow={p.eyebrow} title={p.title} description={p.description} columns={inPost ? postColumns(p.columns) : p.columns} variant={p.variant} items={p.items.map((i) => ({ icon: i.icon, title: i.title, description: i.description, cta: i.link }))} className={className} />,
  Steps: (p, className) => <ProcessTimeline eyebrow={p.eyebrow} title={p.title} description={p.description} steps={p.steps} className={className} />,
  Faq: (p, className) => <FAQSection eyebrow={p.eyebrow} title={p.title} description={p.description} items={p.items} className={className} />,
  LinkTiles: (p, className, inPost) => <DestinationBanner eyebrow={p.eyebrow} title={p.title} intro={p.intro} items={p.items} layout={p.layout} columns={inPost ? postColumns(p.columns) : p.columns} headingLevel="h2" className={className} />,
  CtaBand: (p, className) => <CTABand title={p.title} description={p.description} primaryCta={p.primaryCta} secondaryCta={p.secondaryCta} note={p.note} className={className} />,
  OfferBanner: (p, className) => (
    <OfferBanner eyebrow={p.eyebrow} title={p.title} description={p.description} planName={p.ticketLabel} primaryCta={p.primaryCta} nextStep={p.nextStep} layout={p.layout} scope={p.scope} headingLevel="h2" className={className} />
  ),
  GuideBanner: (p, className) => <GuideBanner eyebrow={p.eyebrow} title={p.title} summary={p.summary} learn={p.learn} cta={p.cta} layout={p.layout} numbered={p.numbered} scope={p.scope} headingLevel="h2" className={className} />,
  ActionBand: (p, className) => <ActionBand label={p.label} line={p.line} cta={p.cta} note={p.note} variant={p.variant} headingLevel="h2" className={className} />,
  AnswerBanner: (p, className) => <AnswerBanner eyebrow={p.eyebrow} question={p.question} answer={p.answer} next={p.next} layout={p.layout} headingLevel="h2" className={className} />,
};

/** A post's text column is narrow: card and tile grids use at most two columns there. */
const postColumns = (n: 2 | 3 | 4): 2 | 3 | 4 => (n > 2 ? 2 : n);

/** Draws a section. `inPost` adapts it to a post's text column (see also `.builder-in-post` in rich-content.css). */
export function renderSection(type: SectionType, content: unknown, className?: string, inPost = false): ReactNode {
  const prepared = prepareSection(type, content);
  const render = RENDER[type] as ((p: unknown, c?: string, inPost?: boolean) => ReactNode) | undefined;
  return prepared && render ? render(prepared, className, inPost) : null;
}

/** Sections that sit on the page background and take part in the alternating bands (banners and the hero bring their own). */
export const BANDED: ReadonlySet<string> = new Set(["section", "SplitSection", "FeatureCards", "Steps", "Faq", "LinkTiles"]);

/**
 * The band for every second banded block: the same soft light and dot texture as the hand-built pages' alternate
 * sections (app/styles/rich-content.css, `.builder-band`). Applied by class rather than by position, so the canvas (where
 * each block sits in an editing frame) and the public page get the same bands.
 */
export const BAND_CLASS = "builder-band";
