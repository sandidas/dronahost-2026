import HeroSection from "@/components/Experience&Growth/HeroSection/HeroSection";
import Services from "@/components/Experience&Growth/services/services";
import ServicesDetails from "@/components/Experience&Growth/servicesDetails/servicesDetails";
import WebDesign from "@/components/Experience&Growth/WebDesign/WebDesign";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import data from "@/data/Experience&Growth.json";

export const metadata = buildMetadata({
  title: "Professional Web Design Services | DronaHost",
  description: "Custom web design that converts. Mobile-first, fast-loading websites built for US, UK, and UAE markets. Get a free consultation.",
  path: "/web-design",
});

export default function WebDesignPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/web-design")),
        serviceSchema({
          name: "Web Design",
          description: "Custom web design services delivering mobile-first, conversion-optimized websites.",
          url: "https://dronahost.com/web-design",
        }),
      ]} />

      <h1 className="sr-only">Professional Web Design Services</h1>
      <HeroSection data={data.experienceGrowthPage.hero} />
      <Services data={data.experienceGrowthPage.services} />
      <ServicesDetails data={data.servicesDetailSection.servicesOverview} />
      <WebDesign data={data.servicesDetailSection.serviceDetail} />

      {/* Internal links for SEO */}
      <section className="py-8 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm text-slate-500">
            Also explore:{" "}
            <Link href="/seo-services" className="text-primary hover:underline">SEO Services</Link>
            {" · "}
            <Link href="/growth-services" className="text-primary hover:underline">Growth Services</Link>
            {" · "}
            <Link href="/contact" className="text-primary hover:underline">Get a Free Quote</Link>
          </p>
        </div>
      </section>
    </>
  );
}
