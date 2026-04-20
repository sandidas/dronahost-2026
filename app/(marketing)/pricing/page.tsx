import IncludedEveryPlan from "./_components/IncludedEveryPlan";
import WhyBetter from "./_components/WhyBetter";
import GlobalReach from "./_components/GlobalReach";
import WebHostingHeroSection from "./_components/WebHostingHeroSection";
import PricingSection from "./_components/WebHostingPrice";
import JsonLd from "@/components/sections/JsonLd";
import webHostingPlanData from "@/data/webHostingPlan.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Web Hosting Pricing — Plans from $0.99/mo | DronaHost",
  description: "Compare DronaHost web hosting plans: Starter from $0.99/mo, Premium from $2.49/mo, Business from $3.99/mo. All include free SSL, domain, and 30-day money-back.",
  path: "/pricing",
});

export default function WebHostingPage() {
	const { hero, plans, includedFeatures, comparison, globalReach } = webHostingPlanData.webHostingPlanPage;

	const pricingJsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@graph": plans.map((plan: { name: string; price: string }) => ({
			"@type": "Product",
			name: `DronaHost ${plan.name} Hosting`,
			offers: {
				"@type": "Offer",
				price: plan.price.replace(/[^0-9.]/g, ""),
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
			},
		})),
	};

	return (
		<>
			<JsonLd schema={[pricingJsonLd, breadcrumbSchema(buildBreadcrumbs("/pricing"))]} />
			<WebHostingHeroSection heroData={hero} />
			<PricingSection plans={plans} />
			<IncludedEveryPlan includedFeatures={includedFeatures} />
			<WhyBetter comparison={comparison} />
			<GlobalReach globalReach={globalReach} />
			 
		</>
	);
}
