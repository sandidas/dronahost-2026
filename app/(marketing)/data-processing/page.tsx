import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Data Processing Agreement — GDPR DPA | DronaHost",
  description:
    "DronaHost GDPR Data Processing Agreement. Required for EU and UK businesses using DronaHost services. Download the DPA or request a signed copy.",
  path: "/data-processing",
});

export default function DataProcessingPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd
        schema={[breadcrumbSchema(buildBreadcrumbs("/data-processing"))]}
      />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          Data Processing Agreement
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
          This Data Processing Agreement (&quot;DPA&quot;) forms part of the
          agreement between DronaHost and you (the &quot;Controller&quot;) for
          the provision of hosting services. This DPA is required under Article
          28 of the GDPR for businesses processing EU personal data using
          DronaHost infrastructure.
        </p>

        <h2>Definitions</h2>
        <p>
          &quot;Controller&quot; means the entity that determines the purposes
          and means of processing personal data. &quot;Processor&quot; means
          DronaHost, which processes data on behalf of the Controller.
          &quot;Personal Data&quot; has the meaning given in the GDPR.
        </p>

        <h2>Scope of Processing</h2>
        <p>
          DronaHost processes personal data solely on your documented
          instructions for the purpose of providing the contracted hosting
          services. DronaHost will not process personal data for any other
          purpose unless required by applicable law.
        </p>

        <h2>Sub-processors</h2>
        <p>
          DronaHost uses the following sub-processors to deliver its services:
          data centre providers in the UK, EU, US, and UAE; payment processors;
          and monitoring and security services. A current list of sub-processors
          is available on request via legal@dronahost.com.
        </p>

        <h2>Data Subject Rights</h2>
        <p>
          DronaHost will assist you in responding to data subject requests
          (access, erasure, portability, restriction) within the timeframes
          required by applicable data protection law.
        </p>

        <h2>Security Measures</h2>
        <p>
          DronaHost implements the technical and organisational security measures
          described in our{" "}
          <Link href="/security" className="text-primary hover:underline">
            Security Policy
          </Link>
          , including encryption at rest and in transit, access controls, and
          regular security audits.
        </p>

        <h2>Data Breach Notification</h2>
        <p>
          DronaHost will notify you without undue delay (and within 72 hours
          where feasible) of any personal data breach affecting your data, with
          sufficient information for you to meet your own notification
          obligations.
        </p>

        <h2>Download the DPA</h2>
        <p>
          A signed copy of the DPA is available for download below, or you may
          request a countersigned version via legal@dronahost.com.
        </p>
        <p>
          <a
            href="/documents/dronahost-dpa.pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-colors"
          >
            Download DPA (PDF)
          </a>
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related:{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/security" className="text-primary hover:underline">
            Security Policy
          </Link>
          {" · "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Legal
          </Link>
        </p>
      </footer>
    </Section>
  );
}
