import PricingCards from "@/components/sections/PricingCards";
import CTA from "./_components/cta";
import EnterpriseSection from "./_components/EnterpriseHosting";
import FeatureSection from "./_components/FeatureSection";
import HeadlessSolutions from "./_components/HeadlessSolutions";
import HeroSection from "./_components/HeroSection";
import HostingPro from "./_components/HostingPro";
import HostingProComparison from "./_components/HostingProComparison";
import HowItWorks from "./_components/HowItWorks";
import IntegratedPartner from "./_components/IntegratedPartner";
import PartnerProgram from "./_components/PartnerProgram";
import Performance from "./_components/Performance";
import ResourceInsights from "./_components/ResourceInsights";
import ReviewFeedback from "./_components/ReviewFeedback";
import SupportingTeam from "./_components/SupportingTeam";
import TechStack from "./_components/TechStack";
import Testimonials from "./_components/testimonials";
import JsonLd from "@/components/sections/JsonLd";
import data from "@/data/hostingLandingPage.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "WordPress Hosting Plans — Fast & Managed | DronaHost",
  description: "Managed WordPress hosting on LiteSpeed with NVMe storage. Free migration, SSL, and daily backups. Plans from $0.99/mo with a 30-day money-back guarantee.",
  path: "/wordpress-hosting",
});

export default function WebHostingPage() {
	return (
		<>
			<JsonLd schema={[
				breadcrumbSchema(buildBreadcrumbs("/wordpress-hosting")),
				serviceSchema({
					name: "WordPress Hosting",
					description: "Managed WordPress hosting on LiteSpeed servers with NVMe storage, free SSL, and daily backups.",
					url: "https://dronahost.com/wordpress-hosting",
				}),
			]} />
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
			<PricingCards data={data.resourcesReviewsPartner.pricingPlansSection} />
			<IntegratedPartner data={data.resourcesReviewsPartner.pricingPlansSection} />
			<Performance data={data.resourcesReviewsPartner.pricingPlansSection} />
			</>
	);
}


