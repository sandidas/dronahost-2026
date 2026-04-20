import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Privacy Policy — DronaHost",
  description:
    "DronaHost Privacy Policy. How we collect, use, and protect your personal data in compliance with GDPR, UK GDPR, and CCPA.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section as="article" size="sm" padding="lg">
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/privacy"))]} />

      <header className="mb-8">
        <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left">
          Privacy Policy
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
          DronaHost (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates
          dronahost.com. This Privacy Policy explains how we collect, use,
          disclose, and protect your information when you use our services.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly, such as name, email
          address, billing information, and any content you submit. We also
          collect usage data automatically, including IP addresses, browser
          type, pages visited, and referring URLs.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide and improve our services, process
          payments, send transactional emails, and comply with legal
          obligations. We do not sell your personal data to third parties.
        </p>

        <h2>Legal Basis for Processing (GDPR/UK GDPR)</h2>
        <p>
          For customers in the EU and UK, we process personal data on the
          following legal bases: contract performance (to deliver services you
          have purchased), legitimate interests (to improve our services and
          prevent fraud), and consent (for marketing communications).
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your personal data for as long as necessary to provide our
          services and comply with legal obligations. Account data is retained
          for 7 years after account closure for tax and legal compliance
          purposes.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct,
          delete, or port your personal data. EU/UK residents have rights under
          GDPR/UK GDPR. California residents have rights under CCPA. To
          exercise your rights, contact us at privacy@dronahost.com.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for session management and optional analytics
          cookies. You can manage cookie preferences in your browser settings.
          We do not use third-party advertising cookies.
        </p>

        <h2>Data Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries outside the
          EU/UK. When we transfer data internationally, we use appropriate
          safeguards including Standard Contractual Clauses.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy-related questions, contact our Data Protection Officer at
          privacy@dronahost.com or write to DronaHost, Data Protection Officer,
          [Address].
        </p>
      </div>

      <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-slate-500">
        <p>
          Related policies:{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/data-processing" className="text-primary hover:underline">
            Data Processing Agreement
          </Link>
          {" · "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Us
          </Link>
        </p>
      </footer>
    </Section>
  );
}
