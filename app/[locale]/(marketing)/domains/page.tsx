import DomainSearch from "@/components/sections/DomainSearch";
import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";
import { SERVICES } from "@/content/services";
import { FEATURES } from "@/lib/flags";

const content = SERVICES["domains"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return serviceMetadata(content, locale);
}

export default function Page() {
  return (
    <ServicePage
      content={content}
      heroVariant="centered"
      afterHero={
        FEATURES.domainSearch ? (
          <section aria-label="Search for a domain" className="container-site pb-12">
            <DomainSearch />
          </section>
        ) : null
      }
    />
  );
}
