import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "30-Day Money-Back Guarantee Policy — DronaHost",
    description:
      "DronaHost offers a 30-day money-back guarantee on all shared, WordPress, and business hosting plans. Learn what is covered and how to request a refund.",
    path: "/refund-policy",
  });
}

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/refund-policy"))]} />
      {/* Owner answers 2026-10-08: 30 days from the order, hosting fee, add-ons and VPS covered, domains not, refund takes up to 30 days depending on the payment gateway. */}
      <LegalPage title="30-Day Money-Back Guarantee" path="/refund-policy" updated="2026-10-08">
        <p>
          If you are not happy with your hosting plan, ask for a refund within 30 days of your order and we will refund it.
        </p>

        <h2>What is covered</h2>
        <p>The guarantee covers your hosting plan, including VPS plans, and any add-ons you bought with it.</p>

        <h2>What is not covered</h2>
        <p>Domain registrations are not refundable.</p>

        <h2>How to ask for a refund</h2>
        <p>
          Open a support ticket from the contact page, or write to us by email. Say which plan you want refunded. We reply with the next steps.
        </p>

        <h2>How long a refund takes</h2>
        <p>
          How long a refund takes depends on your payment method. It can take up to 30 days to reach you.
        </p>

        <h2>Consumer rights</h2>
        <p>
          Some countries give consumers extra rights by law. This policy does not remove them.
        </p>
        <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-muted-foreground">
        <p>
          Related:{" "}
          <Link href="/terms" className="text-link underline underline-offset-4">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/pricing" className="text-link underline underline-offset-4">
            View Hosting Plans
          </Link>
          {" · "}
          <Link href="/contact" className="text-link underline underline-offset-4">
            Contact Support
          </Link>
        </p>
      </footer>
      </LegalPage>
    </>
  );
}
