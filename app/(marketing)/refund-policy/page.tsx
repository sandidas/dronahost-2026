import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "30-Day Money-Back Guarantee Policy — DronaHost",
  description:
    "DronaHost offers a 30-day money-back guarantee on all shared, WordPress, and business hosting plans. Learn what is covered and how to request a refund.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/refund-policy"))]} />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          30-Day Money-Back Guarantee
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
          DronaHost offers a 30-day money-back guarantee on eligible hosting
          plans. If you are not satisfied within the first 30 days, we will
          refund your payment — no questions asked.
        </p>

        <h2>Covered Plans</h2>
        <p>
          The 30-day money-back guarantee applies to: Shared Hosting, WordPress
          Hosting, Business Hosting, and Cloud Hosting plans. The guarantee
          covers the hosting fee only and applies to first-time purchases.
        </p>

        <h2>Not Covered</h2>
        <p>
          The following are not eligible for refunds: domain registrations, SSL
          certificates, migrations performed by our team, VPS Hosting (covered
          by a separate 7-day guarantee), and any add-on services.
        </p>

        <h2>How to Request a Refund</h2>
        <p>
          To request a refund within the 30-day window, open a support ticket at
          support@dronahost.com or through your account dashboard. Include your
          account email and reason for cancellation. Refunds are processed within
          5–10 business days to the original payment method.
        </p>

        <h2>After 30 Days</h2>
        <p>
          After the 30-day guarantee period, services are non-refundable unless
          required by applicable law (for example, under UK/EU consumer
          protection regulations where applicable).
        </p>

        <h2>Consumer Rights (UK and EU)</h2>
        <p>
          UK and EU consumers may have additional rights under consumer
          protection legislation. The 30-day guarantee is in addition to — and
          does not affect — any statutory rights you may have.
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related:{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/pricing" className="text-primary hover:underline">
            View Hosting Plans
          </Link>
          {" · "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </footer>
    </Section>
  );
}
