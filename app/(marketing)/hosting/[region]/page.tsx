import Section from "@/components/section/section";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import JsonLd from "@/components/seo/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";

type Region = "us" | "uk" | "eu" | "uae";

type RegionMeta = {
  name: string;
  title: string;
  description: string;
  currency: string;
  currencySymbol: string;
  serverLocation: string;
  latency: string;
  compliance: string;
  complianceNote: string;
  timezone: string;
  starterPrice: string;
};

const REGION_META: Record<Region, RegionMeta> = {
  us: {
    name: "United States",
    title: "Web Hosting in the USA — Fast US Servers | DronaHost",
    description:
      "US-based web hosting with servers in New York and Los Angeles. Low latency for American visitors, free SSL, and 24/7 support. From $0.99/mo.",
    currency: "USD",
    currencySymbol: "$",
    serverLocation: "New York & Los Angeles, USA",
    latency: "< 20ms for US East Coast, < 40ms for US West Coast",
    compliance: "CCPA Compliant",
    complianceNote:
      "Our US data centres comply with the California Consumer Privacy Act (CCPA). Data residency in the USA available on all plans.",
    timezone: "EST / PST",
    starterPrice: "$0.99",
  },
  uk: {
    name: "United Kingdom",
    title: "UK Web Hosting — London Servers, Fast & Reliable | DronaHost",
    description:
      "UK-based hosting with London data centres. ICO-registered, GDPR compliant, and optimised for British visitors. From £0.79/mo.",
    currency: "GBP",
    currencySymbol: "£",
    serverLocation: "London, United Kingdom",
    latency: "< 10ms for London, < 25ms for rest of UK",
    compliance: "ICO Registered & GDPR Compliant",
    complianceNote:
      "DronaHost is registered with the Information Commissioner's Office (ICO). All UK customer data is stored in London under UK GDPR requirements.",
    timezone: "GMT / BST",
    starterPrice: "£0.79",
  },
  eu: {
    name: "Europe",
    title: "EU Web Hosting — GDPR Compliant European Servers | DronaHost",
    description:
      "European hosting with Frankfurt and Amsterdam data centres. Full GDPR compliance, Data Processing Agreement included. From €0.89/mo.",
    currency: "EUR",
    currencySymbol: "€",
    serverLocation: "Frankfurt, Germany & Amsterdam, Netherlands",
    latency: "< 15ms for Central Europe, < 30ms for rest of EU",
    compliance: "GDPR Compliant — EU Data Residency",
    complianceNote:
      "All EU customer data is processed and stored within the European Union. A GDPR-compliant Data Processing Agreement (DPA) is included with every plan.",
    timezone: "CET / CEST",
    starterPrice: "€0.89",
  },
  uae: {
    name: "United Arab Emirates",
    title: "UAE Web Hosting — Dubai Servers, Low Latency | DronaHost",
    description:
      "UAE-based hosting with Dubai data centres. Sub-30ms latency for Gulf visitors, Arabic language support, and local billing in AED. From AED 3.99/mo.",
    currency: "AED",
    currencySymbol: "AED",
    serverLocation: "Dubai, United Arab Emirates",
    latency: "< 15ms for UAE, < 30ms for GCC region",
    compliance: "UAE PDPL Compliant",
    complianceNote:
      "Our UAE data centre operates under the UAE Personal Data Protection Law (PDPL). Data residency in the UAE available on all plans.",
    timezone: "GST (UTC+4)",
    starterPrice: "AED 3.99",
  },
};

const VALID_REGIONS: Region[] = ["us", "uk", "eu", "uae"];

function isRegion(value: string): value is Region {
  return VALID_REGIONS.includes(value as Region);
}

export function generateStaticParams(): { region: string }[] {
  return VALID_REGIONS.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  if (!isRegion(region)) {
    return buildMetadata({
      title: "Hosting | DronaHost",
      description: "Web hosting plans.",
      path: `/hosting/${region}`,
    });
  }
  const meta = REGION_META[region];
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: `/hosting/${region}`,
  });
}

export default async function RegionalHostingPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  if (!isRegion(region)) notFound();

  const meta = REGION_META[region];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(buildBreadcrumbs(`/hosting/${region}`)),
          serviceSchema({
            name: `Web Hosting in ${meta.name}`,
            description: meta.description,
            url: `${SITE_URL}/hosting/${region}`,
          }),
        ]}
      />

      {/* Hero */}
      <Section padding="hero" hAlign="center">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="center">
          Web Hosting in {meta.name}
        </HeadLineText>
        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 text-center mx-auto">
          {meta.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/pricing"
            className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            View Plans
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-colors"
          >
            Talk to Sales
          </Link>
        </div>
      </Section>

      {/* Server info */}
      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          {meta.name} Infrastructure
        </HeadLineText>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Server Location", value: meta.serverLocation },
            { label: "Latency", value: meta.latency },
            { label: "Compliance", value: meta.compliance },
            { label: "Timezone", value: meta.timezone },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 p-6 dark:border-slate-700"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Compliance */}
      <Section padding="lg" variant="inset">
        <HeadLineText as="h2" fontSize="threeXl" fontWeight="bold">
          {meta.compliance}
        </HeadLineText>
        <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
          {meta.complianceNote}
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Request a Data Processing Agreement
          </Link>
        </div>
      </Section>

      {/* Pricing CTA */}
      <Section padding="lg" variant="highlight" hAlign="center">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold" align="center">
          {meta.name} Hosting from {meta.starterPrice}/mo
        </HeadLineText>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
          Compare plans or explore{" "}
          <Link href="/wordpress-hosting" className="text-primary hover:underline">
            WordPress Hosting
          </Link>{" "}
          and{" "}
          <Link href="/vps-hosting" className="text-primary hover:underline">
            VPS Hosting
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/pricing"
            className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            See All Plans
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </Section>
    </>
  );
}
