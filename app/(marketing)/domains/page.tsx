import BuildCustomCloud from "@/components/DomainHosting/BuildCustomCloud/BuildCustomCloud";
import ChooseAPlan from "@/components/DomainHosting/ChooseAPlan/ChooseAPlan";
import CountryExtension from "@/components/DomainHosting/countryExtension/countryExtension";
import DomainExtension from "@/components/DomainHosting/DomainExtension/DomainExtension";
import GrowManage from "@/components/DomainHosting/Grow&Manage/Grow&Manage";
import HeroSection from "@/components/DomainHosting/HeroSection/HeroSection";
import PerformanceSection from "@/components/DomainHosting/Performance/PerformanceSection";
import SearchDomain from "@/components/DomainHosting/searchDomain/searchDomain";
import JsonLd from "@/components/sections/JsonLd";
import data from "@/data/domainPricing.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Domain Registration — .com from $17.99/yr | DronaHost",
  description: "Register your domain with free WHOIS privacy. Over 400 TLDs available including .co.uk, .de, .ae, and .com. ICANN accredited with 30-day transfer guarantee.",
  path: "/domains",
});

export default function Page() {
  const hero = data.domainPricingSection.hero;
  const domainSearch = data.domainPricingSection.domainSearch;

  const countryExtensions =
    data.domainExtensionsSection.countryExtensions;

  const allExtensions =
    data.domainExtensionsSection.allExtensions;
  const growth =
    data.growthPerformanceSection.subscriberGrowth;
  const performance =
  data.growthPerformanceSection.performance;
  const cloudPricing =
  data.cloudPricingSection;
  const customCloud = data.cloudPricingSection.customCloud;
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/domains")),
        serviceSchema({
          name: "Domain Registration",
          description: "Register domains with free WHOIS privacy, auto-renewal, and DNS management. Supports 400+ TLDs.",
          url: "https://dronahost.com/domains",
        }),
      ]} />
      <HeroSection data={hero} />
      <SearchDomain data={domainSearch} />
      <CountryExtension data={countryExtensions} />
      <DomainExtension data={allExtensions} />
      <GrowManage data={growth} />
      <PerformanceSection data={performance} />
      <ChooseAPlan data={cloudPricing} />
      <BuildCustomCloud data={customCloud} />
 
    </>
  );
}