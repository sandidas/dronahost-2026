import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Approved by the owner 2026-10-08 (Tier A).
  return buildMetadata({ locale, title: "Pricing and Renewal Policy", description: "What you pay at signup and at renewal, how tax works, and where to find each price.", path: "/pricing-policy" });
}

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/pricing-policy"))]} />
      <LegalPage title="Pricing and Renewal Policy" path="/pricing-policy" updated="2026-10-26">
        {/* Owner 2026-10-10 (decision 50): the renewal price equals the signup price with no end date. */}
        <p>Your hosting price does not change when you renew. You pay the same price you paid at signup, with no end date.</p>

        <h2>Where to find prices</h2>
        <p>Every price is on the <Link href="/pricing" className="text-link underline underline-offset-4">pricing page</Link>, in US dollars for now. Each plan shows the signup price and the renewal price together.</p>

        <h2>Tax</h2>
        <p>Prices exclude tax. Customers in India pay GST at checkout. Customers elsewhere pay no tax.</p>

        {/* Owner 2026-10-26 (decision 82): approved wording, backs the no-hidden-fees claim. */}
        <h2>No hidden fees</h2>
        <p>We charge no setup fee. At checkout, we add only GST for customers in India and any domain or add-on you choose. Every add-on and its price is listed on the <Link href="/pricing" className="text-link underline underline-offset-4">pricing page</Link>.</p>

        <h2>Domains</h2>
        <p>Domain prices are shown at checkout. They are not covered by the renewal promise on this page.</p>
        <p>
          Related: <Link href="/refund-policy" className="text-link underline underline-offset-4">Refund policy</Link>
          {" · "}
          <Link href="/pricing" className="text-link underline underline-offset-4">Plans and pricing</Link>
          {" · "}
          <Link href="/contact" className="text-link underline underline-offset-4">Ask the team about this policy</Link>
        </p>
      </LegalPage>
    </>
  );
}
