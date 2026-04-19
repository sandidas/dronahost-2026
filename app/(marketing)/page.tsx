import CaseStudy from "@/components/home/CaseStudy/CaseStudy";
import CTASection from "@/components/home/CTA/CTA";
import FAQSection from "@/components/home/FAQ/FAQSection";
import FeatureSection from "@/components/home/FeatureSection/FeatureSection";
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
import PricingJourney from "@/components/home/pricingjourney/pricingJourney";
import PricingSection1 from "@/components/home/PricingSection1/PricingSection1";
import PricingSection2 from "@/components/home/PricingSection2/PricingSection2";
import PricingSection3 from "@/components/home/PricingSection3/PricingSection3";
import PricingSection4 from "@/components/home/PricingSection4/PricingSection4";
import ServicesSection from "@/components/home/ServiceSection/ServiceSection";
import TeamsSection from "@/components/home/Teams/TeamsSection";
import TestimonialsSection from "@/components/home/Testimonials/TestimonialsSection";
import TrustBadges from "@/components/trust/TrustBadges";
import JsonLd from "@/components/seo/JsonLd";
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
      <FeatureSection data={homeData} />
      <ServicesSection data={homeData} />
      <CaseStudy data={homeData} />
      <CTASection data={homeData} />
      <PricingSection1 data={homeData} />
      <PricingSection2 data={homeData} />
      <PricingSection3 data={homeData} />
      <PricingSection4 data={homeData} />
      <PricingJourney data={homeData} />
      <TestimonialsSection data={homeData} />
      <JsonLd schema={faqPageSchema(homeData.faqSection.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      <FAQSection data={homeData} />
      <TeamsSection data={homeData} />

    </>
  );
}