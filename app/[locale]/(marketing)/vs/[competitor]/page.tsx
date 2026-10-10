import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComparisonTable from "@/components/sections/ComparisonTable";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import JsonLd from "@/components/sections/JsonLd";
import SectionHeader from "@/components/sections/SectionHeader";
import type { CompetitorData } from "@/data/vs/types";
import bluehost from "@/data/vs/bluehost";
import cloudways from "@/data/vs/cloudways";
import hostinger from "@/data/vs/hostinger";
import kinsta from "@/data/vs/kinsta";
import siteground from "@/data/vs/siteground";
import wpEngine from "@/data/vs/wp-engine";
import { Link } from "@/i18n/link";
import { FEATURES } from "@/lib/flags";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { comparisonFaq, comparisonRows, competitorStrengths, dronahostStrengths, fill, formatReviewDate, priceInPlainTerms } from "@/lib/vs/compare";
import pricing from "@/data/pricing.json";

/**
 * /vs/[competitor]. Closed while FEATURES.comparisonPages is off. Template: content-engine/plans/02-commercial-investigation.md.
 * DronaHost's side is built from pricing.json and verified claims (lib/vs/compare.ts), never typed. Competitor facts come from
 * data/vs/*.ts, each with a source and a date. No made-up author: the page names the company and the date it was reviewed.
 */
const COMPETITOR_DATA: Record<string, CompetitorData> = {
  siteground,
  kinsta,
  "wp-engine": wpEngine,
  bluehost,
  hostinger,
  cloudways,
};

export function generateStaticParams(): { competitor: string }[] {
  if (!FEATURES.comparisonPages) return [];
  return Object.keys(COMPETITOR_DATA).map((competitor) => ({ competitor }));
}

const planName = (id: string): string => pricing.plans.find((p) => p.id === id)?.name ?? id;

export async function generateMetadata({ params }: { params: Promise<{ competitor: string; locale: string }> }): Promise<Metadata> {
  const { competitor, locale } = await params;
  const d = COMPETITOR_DATA[competitor];
  if (!FEATURES.comparisonPages || !d) return { robots: { index: false, follow: false } };
  return buildMetadata({
    locale,
    title: `DronaHost vs ${d.name}`,
    description: `Compare DronaHost and ${d.name} on price, support, backups and migration, with the source and date for every ${d.name} fact.`,
    path: `/vs/${competitor}`,
  });
}

export default async function CompetitorPage({ params }: { params: Promise<{ competitor: string }> }) {
  const { competitor } = await params;
  const d = COMPETITOR_DATA[competitor];
  if (!FEATURES.comparisonPages || !d) notFound();

  const rows = comparisonRows(d);
  const theirs = competitorStrengths(d);
  const ours = dronahostStrengths(d);
  const sources = [d.plan.source, ...Object.values(d.facts).map((f) => f.source)].filter((s, i, all) => all.findIndex((x) => x.url === s.url) === i);
  const faqs = comparisonFaq(d);
  const priceLines = priceInPlainTerms(d);
  const dh = planName(d.dronahostPlanId);
  const answer = `${d.name} lists ${d.facts.price?.value ?? "its entry plan"} for its ${d.plan.name} plan. DronaHost shows the signup price and the renewal price together on every plan. This page compares the entry plans on what each company states publicly, using the pages linked below, as read on ${formatReviewDate(d.reviewedOn)}. Prices and terms change, so check the source before you decide.`;

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs(`/vs/${competitor}`, { [competitor]: `vs ${d.name}` })), faqPageSchema(faqs)]} />

      <CenteredHero
        eyebrow="Comparison"
        title={`DronaHost vs ${d.name}`}
        description={answer}
        primaryCta={{ label: "See WordPress hosting plans", href: "/pricing" }}
        secondaryCta={{ label: "Talk to our team", href: "/contact" }}
        note={`Reviewed on ${formatReviewDate(d.reviewedOn)}`}
      />

      {rows.length > 0 && (
        <ComparisonTable
          eyebrow="Side by side"
          title={`${dh} (DronaHost) and ${d.plan.name} (${d.name})`}
          description={d.productNote}
          caption={`DronaHost ${dh} compared with ${d.name} ${d.plan.name}`}
          rowHeader="What we compare"
          columns={[
            { key: "dronahost", label: "DronaHost", sublabel: dh },
            { key: "competitor", label: d.name, sublabel: d.plan.name },
          ]}
          groups={[{ rows }]}
        />
      )}

      <section aria-labelledby="stronger" className="section-y">
        <div className="container-site">
          <SectionHeader id="stronger" title={`Where ${d.name} is stronger`} />
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3">
            {theirs.map((s) => (
              <li key={s.label} className="surface p-5">
                <p className="t-small font-semibold text-foreground">{s.label}</p>
                <p className="t-body mt-1 text-muted-foreground">{s.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {ours.length > 0 && (
        <section aria-labelledby="ours" className="section-y">
          <div className="container-site">
            <SectionHeader id="ours" title="Where DronaHost is stronger" />
            <ul className="mx-auto mt-10 grid max-w-3xl gap-3">
              {ours.map((t) => (
                <li key={t} className="surface t-body p-5 text-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="choose" className="section-y">
        <div className="container-site">
          <SectionHeader id="choose" title="Which one should you choose?" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="surface p-6">
              <h3 className="t-h4 text-foreground">{d.name}</h3>
              <p className="t-body mt-2 text-muted-foreground">{fill(d.chooseCompetitor, d)}</p>
            </div>
            <div className="surface p-6">
              <h3 className="t-h4 text-foreground">DronaHost</h3>
              <p className="t-body mt-2 text-muted-foreground">{d.chooseDronahost}</p>
            </div>
          </div>
          <p className="t-body mx-auto mt-8 max-w-3xl text-center text-muted-foreground">
            Thinking about moving from {d.name}? Send us your current host details on the <Link href="/migration" className="text-link underline">migration page</Link>, or look at the{" "}
            <Link href="/wordpress-hosting" className="text-link underline">WordPress hosting plans</Link>.
          </p>
        </div>
      </section>

      {priceLines.length > 0 && (
        <section aria-labelledby="price" className="section-y">
          <div className="container-site">
            <SectionHeader id="price" title="Price, in plain terms" />
            <div className="t-body mx-auto mt-10 max-w-3xl space-y-3 text-muted-foreground">
              {priceLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection title={`Questions about DronaHost and ${d.name}`} items={faqs} />

      <section aria-labelledby="sources" className="section-y">
        <div className="container-site">
          <SectionHeader id="sources" title="Sources" description={`Every ${d.name} fact on this page comes from the pages below, as shown to a visitor in the United States.`} />
          <ul className="t-small mx-auto mt-8 max-w-3xl space-y-2 text-muted-foreground">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener noreferrer nofollow" className="text-link underline">
                  {s.url}
                </a>{" "}
                (read on {formatReviewDate(s.retrieved)})
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand
        title="Ready to see which plan fits?"
        primaryCta={{ label: "See WordPress hosting plans", href: "/pricing" }}
        secondaryCta={{ label: "Talk to our team", href: "/contact" }}
      />
    </>
  );
}
