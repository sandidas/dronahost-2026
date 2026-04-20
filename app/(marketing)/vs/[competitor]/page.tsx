import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, articleSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import type { CompetitorData } from "@/data/vs/types";

// Import all competitor data statically
import siteground from "@/data/vs/siteground";
import kinsta from "@/data/vs/kinsta";
import wpEngine from "@/data/vs/wp-engine";
import bluehost from "@/data/vs/bluehost";
import hostinger from "@/data/vs/hostinger";
import a2Hosting from "@/data/vs/a2-hosting";
import cloudways from "@/data/vs/cloudways";

type Competitor =
  | "siteground"
  | "kinsta"
  | "wp-engine"
  | "bluehost"
  | "hostinger"
  | "a2-hosting"
  | "cloudways";

const COMPETITOR_DATA: Record<Competitor, CompetitorData> = {
  siteground,
  kinsta,
  "wp-engine": wpEngine,
  bluehost,
  hostinger,
  "a2-hosting": a2Hosting,
  cloudways,
};

const VALID_COMPETITORS = Object.keys(COMPETITOR_DATA) as Competitor[];

function isCompetitor(value: string): value is Competitor {
  return VALID_COMPETITORS.includes(value as Competitor);
}

export function generateStaticParams(): { competitor: string }[] {
  return VALID_COMPETITORS.map((competitor) => ({ competitor }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  if (!isCompetitor(competitor)) {
    return buildMetadata({
      title: "Comparison | DronaHost",
      description: "Hosting comparison.",
      path: `/vs/${competitor}`,
    });
  }
  const d = COMPETITOR_DATA[competitor];
  return buildMetadata({
    title: d.tagline,
    description: d.intro.slice(0, 160),
    path: `/vs/${competitor}`,
    type: "article",
  });
}

export default async function CompetitorPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  if (!isCompetitor(competitor)) notFound();

  const d = COMPETITOR_DATA[competitor];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(
            buildBreadcrumbs(`/vs/${competitor}`, {
              [competitor]: `vs ${d.name}`,
            })
          ),
          articleSchema({
            title: d.tagline,
            description: d.intro.slice(0, 160),
            url: `${SITE_URL}/vs/${competitor}`,
            authorName: "DronaHost Editorial Team",
            datePublished: d.datePublished,
          }),
        ]}
      />

      {/* Hero */}
      <Section padding="hero">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          {d.tagline}
        </HeadLineText>
        <p className="mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {d.intro}
        </p>
      </Section>

      {/* Comparison table */}
      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold">
          DronaHost vs {d.name} — Side by Side
        </HeadLineText>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 text-left font-semibold text-slate-900 dark:text-slate-100 w-1/3">
                  Feature
                </th>
                <th className="py-3 text-left font-semibold text-primary w-1/3">
                  DronaHost
                </th>
                <th className="py-3 text-left font-semibold text-slate-900 dark:text-slate-100 w-1/3">
                  {d.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {d.table.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {row.feature}
                  </td>
                  <td
                    className={`py-3 font-medium ${
                      row.winner === "dronahost"
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {row.winner === "dronahost" && (
                      <span className="mr-1">&#10003;</span>
                    )}
                    {row.dronahost}
                  </td>
                  <td
                    className={`py-3 font-medium ${
                      row.winner === "competitor"
                        ? "text-green-600 dark:text-green-400"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {row.winner === "competitor" && (
                      <span className="mr-1">&#10003;</span>
                    )}
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Pros and cons */}
      <Section padding="lg" variant="inset">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <HeadLineText as="h2" fontSize="threeXl" fontWeight="bold">
              Why Choose DronaHost
            </HeadLineText>
            <ul className="mt-4 space-y-3">
              {d.dronahostPros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span className="mt-1 text-green-500 shrink-0">&#10003;</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <HeadLineText as="h2" fontSize="threeXl" fontWeight="bold">
              Why Choose {d.name}
            </HeadLineText>
            <ul className="mt-4 space-y-3">
              {d.competitorPros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span className="mt-1 text-blue-500 shrink-0">&bull;</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Verdict */}
      <Section padding="lg">
        <HeadLineText as="h2" fontSize="fourXl" fontWeight="bold">
          Our Verdict
        </HeadLineText>
        <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {d.verdict}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/pricing"
            className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            See DronaHost Plans
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-colors"
          >
            Talk to Sales
          </Link>
        </div>
      </Section>

      {/* Related comparisons */}
      <Section
        padding="lg"
        className="border-t border-slate-100 dark:border-slate-800"
      >
        <HeadLineText as="h2" fontSize="threeXl" fontWeight="bold">
          More Comparisons
        </HeadLineText>
        <div className="mt-6 flex flex-wrap gap-3">
          {VALID_COMPETITORS.filter((c) => c !== competitor).map((c) => (
            <Link
              key={c}
              href={`/vs/${c}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors dark:border-slate-700"
            >
              DronaHost vs {COMPETITOR_DATA[c].name}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Or explore our{" "}
          <Link href="/pricing" className="text-primary hover:underline">
            pricing plans
          </Link>{" "}
          and{" "}
          <Link href="/wordpress-hosting" className="text-primary hover:underline">
            WordPress hosting
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
