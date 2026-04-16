import ChooseYourPlan from "@/components/Web-Hosting/ChooseYourPlan/ChooseYourPlan";
import CTA from "@/components/Web-Hosting/CTA/cta";
import EnterpriseSection from "@/components/Web-Hosting/EnterpriseHosting/EnterpriseHosting";
import FeatureSection from "@/components/Web-Hosting/FeatureSection/FeatureSection";
import HeadlessSolutions from "@/components/Web-Hosting/HeadlessSolutions/HeadlessSolutions";
import HeroSection from "@/components/Web-Hosting/HeroSection/HeroSection";
import HostingPro from "@/components/Web-Hosting/HostingPro/HostingPro";
import HostingProComparison from "@/components/Web-Hosting/HostingProComparison/HostingProComparison";
import HowItWorks from "@/components/Web-Hosting/HowItWorks/HowItWorks";
import IntegratedPartner from "@/components/Web-Hosting/IntegratedPartner/IntegratedPartner";
import PartnerProgram from "@/components/Web-Hosting/PartnerProgram/PartnerProgram";
import Performance from "@/components/Web-Hosting/performance/performance";
import ResourceInsights from "@/components/Web-Hosting/ResourceInsights/ResourceInsights";
import ReviewFeedback from "@/components/Web-Hosting/Review&Feedback/Review&Feedback";
import SupportingTeam from "@/components/Web-Hosting/SupportingTeam/SupportingTeam";
import TechStack from "@/components/Web-Hosting/TechStack/TechStack";
import Testimonials from "@/components/Web-Hosting/testimonials/testimonials";
import data from "@/data/hostingLandingPage.json";

export default function WebHostingPage() {
	return (
		<>
			<HeroSection data={data.hostingLandingPage.hero} />
			<EnterpriseSection data={data.hostingLandingPage.enterpriseSection} />
			<Testimonials data={data.hostingLandingPage.testimonials} />
			<SupportingTeam data={data.hostingLandingPage.publishingSupport} />
			<CTA data={data.headlessSection.testimonial} />
			<HeadlessSolutions data={data.headlessSection.solutions} />
			<TechStack data={data.headlessSection.features} />
			<ResourceInsights data={data.resourcesReviewsPartner.resources} />
			<ReviewFeedback data={data.resourcesReviewsPartner.reviews} />
			<HowItWorks data={data.resourcesReviewsPartner.howItWorks} />
			<PartnerProgram data={data.resourcesReviewsPartner.partnerProgram} />
			<HostingPro data={data.resourcesReviewsPartner.partnerMatchForm} />
			<FeatureSection data={data.resourcesReviewsPartner.featureComparisonSection} />
			<HostingProComparison data={data.resourcesReviewsPartner.featureComparisonSection} />
			<ChooseYourPlan data={data.resourcesReviewsPartner.pricingPlansSection} />
			<IntegratedPartner data={data.resourcesReviewsPartner.pricingPlansSection} />
			<Performance data={data.resourcesReviewsPartner.pricingPlansSection} />
			</>
	);
}


