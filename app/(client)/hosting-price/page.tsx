import IncludedEveryPlan from "@/components/HostingPrice/IncludedEveryPlan/IncludedEveryPlan";
import WhyBetter from "@/components/HostingPrice/WhyBetter/WhyBetter";
import GlobalReach from "@/components/HostingPrice/globalReach/globalReach";
import WebHostingHeroSection from "@/components/HostingPrice/heroSection/heroSection";
import PricingSection from "@/components/HostingPrice/webHostingPrice/pricing";
import webHostingPlanData from "@/data/webHostingPlan.json";

export default function WebHostingPage() {
	const { hero, plans, includedFeatures, comparison, globalReach } = webHostingPlanData.webHostingPlanPage;

	return (
		<>
			 
			<WebHostingHeroSection heroData={hero} />
			<PricingSection plans={plans} />
			<IncludedEveryPlan includedFeatures={includedFeatures} />
			<WhyBetter comparison={comparison} />
			<GlobalReach globalReach={globalReach} />
			 
		</>
	);
}
