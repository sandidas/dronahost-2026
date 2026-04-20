import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Terms of Service — DronaHost",
  description:
    "DronaHost Terms of Service. The legal agreement governing your use of DronaHost hosting services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/terms"))]} />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          Terms of Service
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
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of DronaHost services. By using our services, you agree to these
          Terms.
        </p>

        <h2>Acceptable Use</h2>
        <p>
          You may use our services only for lawful purposes. You may not use our
          services to distribute malware, conduct phishing attacks, send
          unsolicited email (spam), host illegal content, or violate the rights
          of others.
        </p>

        <h2>Account Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials. You are responsible for all activity that occurs
          under your account. Notify us immediately at security@dronahost.com of
          any unauthorised use.
        </p>

        <h2>Payment and Billing</h2>
        <p>
          Services are billed in advance on a monthly or annual basis. All fees
          are exclusive of taxes. Failure to pay may result in service
          suspension. We reserve the right to change pricing with 30 days
          advance notice.
        </p>

        <h2>Service Level Agreement</h2>
        <p>
          Our uptime commitments are detailed in our{" "}
          <Link href="/sla" className="text-primary hover:underline">
            Service Level Agreement
          </Link>
          . Credits for downtime are the sole remedy for service outages.
        </p>

        <h2>Termination</h2>
        <p>
          Either party may terminate these Terms at any time. We may suspend or
          terminate your account immediately for violations of these Terms. Upon
          termination, your right to use the services ceases immediately.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, DronaHost shall not be liable
          for indirect, incidental, special, consequential, or punitive damages.
          Our total liability shall not exceed the amounts paid by you in the 12
          months preceding the claim.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of England and Wales for UK/EU
          customers, and the laws of Delaware, USA for US customers.
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related policies:{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/refund-policy" className="text-primary hover:underline">
            Refund Policy
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
