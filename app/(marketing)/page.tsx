import BentoGrid, { type BentoItem } from "@/components/sections/BentoGrid";
import ComparisonTable from "@/components/sections/ComparisonTable";
import CTASection from "@/components/sections/HomeCTA";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import ProductHero from "@/components/sections/ProductHero";
import StatsBar from "@/components/sections/StatsBar";
import TrustBadges from "@/components/sections/TrustBadges";
import TwoColumn from "@/components/sections/TwoColumn";
import CaseStudy from "@/components/sections/CaseStudy";
import LogoWall from "@/components/sections/LogoWall";
import TestimonialsSection from "@/components/sections/Testimonials";
import { CacheVisual, ChannelsVisual, GrowthVisual, RestoreVisual } from "@/components/sections/visuals/bento";
import {
  MigrationVisual,
  ProtectionVisual,
  SupportChannelsVisual,
  WordPressSettingsVisual,
} from "@/components/sections/visuals/split";
import { HOME_HERO } from "@/content/heroes";
import { HOME_BENTO, HOME_COMPARE, HOME_OFFER, HOME_SPLITS, homeData } from "@/content/home";
import { faqPageSchema, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { startingPriceLabel } from "@/lib/pricing";

export const metadata = buildMetadata({
  title: "DronaHost — Managed WordPress & Cloud Hosting",
  description: `High-performance WordPress and cloud hosting with NVMe storage and LiteSpeed servers. Serving US, UK, and UAE businesses${startingPriceLabel() ? ` from ${startingPriceLabel()}` : ""}.`,
  path: "/",
});

const BENTO_VISUALS = {
  cache: <CacheVisual />,
  growth: <GrowthVisual />,
  restore: <RestoreVisual />,
  channels: <ChannelsVisual />,
} as const;

const SPLIT_VISUALS = {
  wordpress: <WordPressSettingsVisual />,
  migration: <MigrationVisual />,
  protection: <ProtectionVisual />,
  support: <SupportChannelsVisual />,
} as const;

const bentoItems: BentoItem[] = HOME_BENTO.items.map((item) => ({
  title: item.title,
  description: item.description,
  span: item.span,
  href: item.href,
  linkLabel: item.linkLabel,
  visual: BENTO_VISUALS[item.visual],
}));

export default function Home() {
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <ProductHero {...HOME_HERO} />
      <TrustBadges />
      <StatsBar />

      <BentoGrid eyebrow={HOME_BENTO.eyebrow} title={HOME_BENTO.title} description={HOME_BENTO.description} items={bentoItems} />

      <FeatureGrid
        eyebrow={HOME_OFFER.eyebrow}
        title={HOME_OFFER.title}
        description={HOME_OFFER.description}
        items={HOME_OFFER.items}
        columns={4}
      />

      {HOME_SPLITS.map((split, i) => (
        <TwoColumn
          key={split.title}
          eyebrow={split.eyebrow}
          title={split.title}
          description={split.description}
          features={split.features}
          cta={split.cta}
          visual={SPLIT_VISUALS[split.visual]}
          visualPosition={i % 2 === 0 ? "right" : "left"}
        />
      ))}

      <ComparisonTable
        eyebrow={HOME_COMPARE.eyebrow}
        title={HOME_COMPARE.title}
        description={HOME_COMPARE.description}
        caption={HOME_COMPARE.caption}
        columns={HOME_COMPARE.columns}
        groups={HOME_COMPARE.groups}
        rowHeader="Hosting type"
      />

      <CaseStudy data={homeData} />
      <CTASection data={homeData} />
      <TestimonialsSection data={homeData} />
      <JsonLd schema={faqPageSchema(homeData.faqSection.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      <FAQSection data={homeData} />
      <LogoWall data={homeData} />
    </>
  );
}
