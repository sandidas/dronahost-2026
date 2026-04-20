import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Service Level Agreement — DronaHost Hosting SLA",
  description:
    "DronaHost SLA: 99.9% uptime guarantee for shared and WordPress hosting, 99.99% for cloud plans. Financial credits for downtime exceeding SLA thresholds.",
  path: "/sla",
});

export default function SlaPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/sla"))]} />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          Service Level Agreement
        </HeadLineText>
        <time
          dateTime="2025-01-01"
          className="mt-2 block text-sm text-slate-500 dark:text-slate-400"
        >
          Last updated: January 1, 2025
        </time>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
        <p>
          This Service Level Agreement (&quot;SLA&quot;) describes the uptime
          commitments DronaHost makes to customers and the remedies available
          when those commitments are not met.
        </p>

        <h2>Uptime Commitments</h2>
        <p>
          DronaHost guarantees the following monthly uptime percentages:
        </p>
        <ul>
          <li>
            Shared Hosting and WordPress Hosting:{" "}
            <strong>99.9% uptime</strong> (allows up to 43.8 minutes downtime
            per month)
          </li>
          <li>
            Business Hosting: <strong>99.9% uptime</strong>
          </li>
          <li>
            Cloud Hosting: <strong>99.99% uptime</strong> (allows up to 4.38
            minutes downtime per month)
          </li>
          <li>
            VPS Hosting: <strong>99.9% uptime</strong>
          </li>
        </ul>

        <h2>Downtime Definition</h2>
        <p>
          &quot;Downtime&quot; means the total accumulated minutes in a calendar
          month during which your service is completely unavailable, as measured
          by DronaHost&apos;s monitoring infrastructure. Downtime does not
          include scheduled maintenance windows (announced 72 hours in advance),
          issues caused by customer code or configuration, or third-party
          service failures.
        </p>

        <h2>SLA Credits</h2>
        <p>
          If uptime falls below the guaranteed threshold, you are eligible for
          service credits:
        </p>
        <ul>
          <li>99.5% – 99.9%: 5% credit of monthly fee</li>
          <li>99.0% – 99.5%: 10% credit of monthly fee</li>
          <li>Below 99.0%: 25% credit of monthly fee</li>
        </ul>
        <p>
          Credits are applied to your next invoice and are the sole financial
          remedy for SLA breaches.
        </p>

        <h2>How to Claim a Credit</h2>
        <p>
          To claim an SLA credit, open a support ticket within 30 days of the
          downtime event. Include the date, time, and duration of the outage. We
          will verify against our monitoring data and apply credits within 14
          days.
        </p>

        <h2>Scheduled Maintenance</h2>
        <p>
          Planned maintenance is performed during low-traffic windows and
          announced at least 72 hours in advance via email and our status page
          at status.dronahost.com.
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related:{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/security" className="text-primary hover:underline">
            Security Policy
          </Link>
          {" · "}
          <Link href="/contact" className="text-primary hover:underline">
            Open a Ticket
          </Link>
        </p>
      </footer>
    </Section>
  );
}
