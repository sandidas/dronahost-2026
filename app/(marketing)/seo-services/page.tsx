import HeroSection from "@/components/sections/ExperienceHeroSection";
import Expertise from "@/components/sections/Expertise";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import data from "@/data/Experience&Growth.json";

export const metadata = buildMetadata({
  title: "SEO Services — Rank Higher on Google | DronaHost",
  description: "Data-driven SEO services to grow your organic traffic. Technical SEO, content strategy, and link building for US, UK, and UAE markets.",
  path: "/seo-services",
});

export default function SeoServicesPage() {
  return (
    <>
      <JsonLd schema={[
        breadcrumbSchema(buildBreadcrumbs("/seo-services")),
        serviceSchema({
          name: "SEO Services",
          description: "Data-driven SEO to grow organic traffic with technical SEO, content strategy, and link building.",
          url: "https://dronahost.com/seo-services",
        }),
      ]} />

      <h1 className="sr-only">SEO Services — Rank Higher on Google</h1>
      <HeroSection data={data.experienceGrowthPage.hero} />
      <Expertise data={data.experienceGrowthPage.expertise} />

      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          Our SEO Capabilities
        </HeadLineText>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Technical SEO", desc: "Core Web Vitals, crawlability, structured data, and site speed optimisation for Google's ranking factors." },
            { title: "Keyword Research", desc: "In-depth keyword analysis targeting high-intent queries in your industry across US, UK, and UAE markets." },
            { title: "Content Strategy", desc: "Editorial planning, topic clusters, and AI-discoverability optimisation so ChatGPT and Perplexity cite your brand." },
            { title: "Link Building", desc: "White-hat link acquisition from authoritative domains in your niche to build long-term domain authority." },
            { title: "Local SEO", desc: "Google Business Profile optimisation and local citation building for businesses targeting specific cities or regions." },
            { title: "Analytics & Reporting", desc: "Monthly ranking reports, traffic analysis, and conversion tracking with Google Analytics 4 and Search Console." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="py-8 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm text-slate-500">
            Also explore:{" "}
            <Link href="/web-design" className="text-primary hover:underline">Web Design</Link>
            {" · "}
            <Link href="/growth-services" className="text-primary hover:underline">Growth Services</Link>
            {" · "}
            <Link href="/contact" className="text-primary hover:underline">Get a Free Audit</Link>
          </p>
        </div>
      </section>
    </>
  );
}
