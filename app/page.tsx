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
import homeData from "@/data/home.json";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection data={homeData} />
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
      <FAQSection data={homeData} />
      <TeamsSection data={homeData} />
      <Footer />
    </div>
  );
}