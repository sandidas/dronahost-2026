import HeroSection from "@/components/Experience&Growth/HeroSection/HeroSection";
import Expertise from "@/components/Experience&Growth/Expertise/Expertise";
import OurPartners from "@/components/Experience&Growth/OurPartners/OurPartners";
import OurProcess from "@/components/Experience&Growth/OurProcess/Ourprocess";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import data from "@/data/Experience&Growth.json";

export const metadata = buildMetadata({
  title: "About DronaHost — Hosting Experts Since 2020",
  description: "DronaHost is a managed hosting company serving businesses in the US, UK, UAE, and EU. Learn about our mission, team, and values.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/about")),
        organizationSchema(),
      ]} />

      <h1 className="sr-only">About DronaHost</h1>
      <HeroSection data={data.experienceGrowthPage.hero} />
      <Expertise data={data.experienceGrowthPage.expertise} />
      <OurPartners data={data.experienceGrowthPage.partners} />
      <OurProcess data={data.experienceGrowthPage.process} />

      <section className="py-8 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm text-slate-500">
            Learn more:{" "}
            <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
            {" · "}
            <Link href="/wordpress-hosting" className="text-primary hover:underline">Our Hosting Plans</Link>
            {" · "}
            <Link href="/growth-services" className="text-primary hover:underline">Growth Services</Link>
          </p>
        </div>
      </section>
    </>
  );
}
