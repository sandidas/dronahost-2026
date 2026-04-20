import CaseStudy from "@/components/sections/CaseStudy";
import CTASection from "./_components/HomeCTA";
import FAQSection from "@/components/sections/FAQSection";
import FeatureSection from "./_components/HomeFeatureSection";
import HeroSection from "@/components/sections/HomeHero";
import PricingJourney from "@/components/sections/PricingJourney";
import TwoColumn from "@/components/sections/TwoColumn";
import FeatureGrid from "@/components/sections/FeatureGrid";
import LogoWall from "@/components/sections/LogoWall";
import TestimonialsSection from "@/components/sections/Testimonials";
import TrustBadges from "@/components/sections/TrustBadges";
import StatsBar from "@/components/sections/StatsBar";
import JsonLd from "@/components/sections/JsonLd";
import homeData from "@/data/home.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";

export const metadata = buildMetadata({
  title: "DronaHost — Managed WordPress & Cloud Hosting",
  description: "High-performance WordPress and cloud hosting with NVMe storage, LiteSpeed servers, and 24/7 support. Serving US, UK, and UAE businesses from $0.99/mo.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <HeroSection data={homeData} />
      <TrustBadges />
      <StatsBar />
      <FeatureSection data={homeData} />
      <FeatureGrid
        tagline={homeData.servicesSection?.tagline}
        title={homeData.servicesSection?.title}
        description={homeData.servicesSection?.description}
        columns={3}
        divided={true}
        items={homeData.servicesSection?.services?.map((s: { title: string; description: string; icon?: string; cta?: { label: string; link: string } }) => ({
          iconKey: s.icon,
          title: s.title,
          description: s.description,
          cta: s.cta ? { label: s.cta.label, href: s.cta.link } : undefined,
        }))}
      />
      <CaseStudy data={homeData} />
      <CTASection data={homeData} />
      <TwoColumn
        tagline={homeData.managedHostingSection.tagline}
        title={homeData.managedHostingSection.title}
        description={homeData.managedHostingSection.description}
        features={homeData.managedHostingSection.features.map((f: { text: string; icon: string }) => f.text)}
        cta={homeData.managedHostingSection.buttons.map((b: { label: string; link: string; variant: string }) => ({ label: b.label, href: b.link, variant: b.variant as "primary" | "secondary" }))}
        image={{ src: homeData.managedHostingSection.image.src, alt: homeData.managedHostingSection.image.alt }}
        imagePosition="left"
      />
      <TwoColumn
        tagline={homeData.managedHostingIllustrationSection.tagline}
        title={homeData.managedHostingIllustrationSection.title}
        description={homeData.managedHostingIllustrationSection.description}
        features={homeData.managedHostingIllustrationSection.features.map((f: { text: string; icon: string }) => f.text)}
        cta={homeData.managedHostingIllustrationSection.buttons.map((b: { label: string; link: string; variant: string }) => ({ label: b.label, href: b.link, variant: b.variant as "primary" | "secondary" }))}
        image={{ src: homeData.managedHostingIllustrationSection.illustration.src, alt: homeData.managedHostingIllustrationSection.illustration.alt }}
        imagePosition="right"
      />
      <TwoColumn
        tagline={homeData.managedHostingAbstractSection.tagline}
        title={homeData.managedHostingAbstractSection.title}
        description={homeData.managedHostingAbstractSection.description}
        features={homeData.managedHostingAbstractSection.features.map((f: { text: string; icon: string }) => f.text)}
        cta={homeData.managedHostingAbstractSection.buttons.map((b: { label: string; link: string; variant: string }) => ({ label: b.label, href: b.link, variant: b.variant as "primary" | "secondary" }))}
        image={{ src: homeData.managedHostingAbstractSection.illustration.src, alt: homeData.managedHostingAbstractSection.illustration.alt }}
        imagePosition="left"
      />
      <TwoColumn
        tagline={homeData.managedHostingUISection.tagline}
        title={homeData.managedHostingUISection.title}
        description={homeData.managedHostingUISection.description}
        features={homeData.managedHostingUISection.features.map((f: { text: string; icon: string }) => f.text)}
        cta={homeData.managedHostingUISection.buttons.map((b: { label: string; link: string; variant: string }) => ({ label: b.label, href: b.link, variant: b.variant as "primary" | "secondary" }))}
        image={{ src: homeData.managedHostingUISection.illustration.src, alt: homeData.managedHostingUISection.illustration.alt }}
        imagePosition="right"
      />
      <PricingJourney data={homeData} />
      <TestimonialsSection data={homeData} />
      <JsonLd schema={faqPageSchema(homeData.faqSection.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      <FAQSection data={homeData} />
      <LogoWall data={homeData} />

    </>
  );
}