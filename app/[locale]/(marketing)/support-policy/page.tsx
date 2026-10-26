import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Approved by the owner 2026-10-08 (Tier A).
  return buildMetadata({ locale, title: "Support Policy", description: "How to reach DronaHost support by live chat, support ticket or email, 24/7, and what to expect after you write.", path: "/support-policy" });
}

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/support-policy"))]} />
      <LegalPage title="Support Policy" path="/support-policy" updated="2026-10-26">
        {/* Owner 2026-10-26 (decision 84): live chat on the website and in the client area, 24/7, with ticket and email. */}
        <p>You can reach DronaHost support by live chat, support ticket or email, 24 hours a day, every day.</p>

        <h2>How to reach us</h2>
        <p>Start a live chat on our website or in the client area, open a ticket from the contact page, or write to us by email.</p>

        <h2>What happens after you write</h2>
        <p>In a live chat, we answer in the chat. For a ticket or an email, we reply by email. Each reply gives you the next step. A first reply is not always a fix. Some problems take longer to solve.</p>

        <h2>What to include</h2>
        <p>Tell us your account email, the plan, and what you see. Screenshots help.</p>
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
