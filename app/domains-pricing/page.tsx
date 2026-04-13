import BuildCustomCloud from "@/components/DomainHosting/BuildCustomCloud/BuildCustomCloud";
import ChooseAPlan from "@/components/DomainHosting/ChooseAPlan/ChooseAPlan";
import CountryExtension from "@/components/DomainHosting/countryExtension/countryExtension";
import DomainExtension from "@/components/DomainHosting/DomainExtension/DomainExtension";
import GrowManage from "@/components/DomainHosting/Grow&Manage/Grow&Manage";
import HeroSection from "@/components/DomainHosting/HeroSection/HeroSection";
import PerformanceSection from "@/components/DomainHosting/Performance/PerformanceSection";
import SearchDomain from "@/components/DomainHosting/searchDomain/searchDomain";
import data from "@/data/domainPricing.json";

import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

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
      <Header />
      <HeroSection data={hero} />
      <SearchDomain data={domainSearch} />
      <CountryExtension data={countryExtensions} />
      <DomainExtension data={allExtensions} />
      <GrowManage data={growth} />
      <PerformanceSection data={performance} />
      <ChooseAPlan data={cloudPricing} />
      <BuildCustomCloud data={customCloud} />
      <Footer />
    </>
  );
}