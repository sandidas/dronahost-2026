import Integration from "@/components/Experience&Growth/Integrations/Integrations";
import HeappyClients from "@/components/Experience&Growth/HappyClients/HappyClients";
import CTA from "@/components/Experience&Growth/CTA/cta";
import OurWork from "@/components/Experience&Growth/OurWork/OurWork";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import data from "@/data/Experience&Growth.json";

export const metadata = buildMetadata({
  title: "Digital Growth Services — Scale Your Business | DronaHost",
  description: "Full-stack digital growth: integrations, CRM, marketing automation, and conversion optimization for businesses in the US, UK, and UAE.",
  path: "/growth-services",
});

export default function GrowthServicesPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/growth-services")),
        serviceSchema({
          name: "Growth Services",
          description: "Full-stack digital growth including CRM integrations, marketing automation, and conversion optimisation.",
          url: "https://dronahost.com/growth-services",
        }),
      ]} />

      <h1 className="sr-only">Digital Growth Services</h1>
      <Integration data={data.experienceGrowthPage.integrations} />
      <HeappyClients data={data.clientWorkSection.clients} />
      <CTA data={data.clientWorkSection.ctaBanner} />
      <OurWork data={data.clientWorkSection.ourWork} />

      <section className="py-8 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm text-slate-500">
            Also explore:{" "}
            <Link href="/web-design" className="text-primary hover:underline">Web Design</Link>
            {" · "}
            <Link href="/seo-services" className="text-primary hover:underline">SEO Services</Link>
            {" · "}
            <Link href="/contact" className="text-primary hover:underline">Start a Project</Link>
          </p>
        </div>
      </section>
    </>
  );
}
