import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Security & Data Protection — DronaHost",
  description:
    "How DronaHost secures your hosting environment: DDoS protection, firewalls, automated patching, encryption at rest and in transit, and vulnerability management.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/security"))]} />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          Security &amp; Data Protection
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
          Security is a core part of DronaHost&apos;s infrastructure. This page
          describes the technical and organisational measures we use to protect
          your data and hosting environment.
        </p>

        <h2>Network Security</h2>
        <p>
          All DronaHost infrastructure is protected by enterprise-grade DDoS
          mitigation, network firewalls, and intrusion detection systems (IDS).
          Traffic is monitored 24/7 and suspicious patterns trigger automatic
          rate limiting.
        </p>

        <h2>Encryption</h2>
        <p>
          All data in transit is encrypted using TLS 1.2 or higher. Data at
          rest is encrypted using AES-256. Free wildcard SSL certificates are
          included on all plans via Let&apos;s Encrypt and are auto-renewed 30
          days before expiry.
        </p>

        <h2>Automated Patching</h2>
        <p>
          Operating system and server software security patches are applied
          automatically within 24 hours of release for critical vulnerabilities.
          Non-critical patches are applied within 7 days during scheduled
          maintenance windows.
        </p>

        <h2>Access Controls</h2>
        <p>
          Production systems require multi-factor authentication for all
          administrative access. Access is granted on a least-privilege basis.
          All administrative actions are logged and retained for 90 days for
          audit purposes.
        </p>

        <h2>Vulnerability Management</h2>
        <p>
          We conduct quarterly vulnerability scans of our infrastructure and
          annual penetration testing by an independent third party. Critical
          findings are remediated within 72 hours.
        </p>

        <h2>Incident Response</h2>
        <p>
          In the event of a security incident affecting customer data, we will
          notify affected customers within 72 hours as required by GDPR and UK
          GDPR. Notifications include the nature of the incident, data affected,
          and steps being taken.
        </p>

        <h2>Responsible Disclosure</h2>
        <p>
          We welcome responsible disclosure of security vulnerabilities. Report
          issues to security@dronahost.com. We commit to acknowledging reports
          within 48 hours and providing updates on remediation progress.
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related:{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/data-processing" className="text-primary hover:underline">
            Data Processing Agreement
          </Link>
          {" · "}
          <Link href="/sla" className="text-primary hover:underline">
            SLA
          </Link>
        </p>
      </footer>
    </Section>
  );
}
