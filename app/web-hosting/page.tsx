import IncludedEveryPlan from "@/components/webHosting/IncludedEveryPlan/IncludedEveryPlan";
import WhyBetter from "@/components/webHosting/WhyBetter/WhyBetter";
import GlobalReach from "@/components/webHosting/globalReach/globalReach";
import WebHostingHeroSection from "@/components/webHosting/heroSection/heroSection";
import PricingSection from "@/components/webHosting/webHostingPrice/pricing";
import webHostingPlanData from "@/data/webHostingPlan.json";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default function WebHostingPage() {
  const { hero, plans, includedFeatures, comparison, globalReach } = webHostingPlanData.webHostingPlanPage;

  return (
    <div>
      <Header />
      <WebHostingHeroSection heroData={hero} />
      <PricingSection plans={plans} />
      <IncludedEveryPlan includedFeatures={includedFeatures} />
      <WhyBetter comparison={comparison} />
      <GlobalReach globalReach={globalReach} />
      <Footer />
    </div>
  );
}
