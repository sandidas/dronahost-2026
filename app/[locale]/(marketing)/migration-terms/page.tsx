import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Approved by the owner 2026-10-08 (Tier A).
  return buildMetadata({
    locale,
    title: "Free Migration Terms",
    description: "What free migration to DronaHost includes: one website per hosting package, and up to 10 websites on a VPS.",
    path: "/migration-terms",
  });
}

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/migration-terms"))]} />
      <LegalPage title="Free Migration Terms" path="/migration-terms" updated="2026-10-08">
        <p>We move your existing website to DronaHost at no cost. Migration is free on every hosting package.</p>

        <h2>How many websites</h2>
        <ul>
          <li>Each hosting package includes the free migration of one website.</li>
          <li>A VPS includes the free migration of up to 10 websites.</li>
        </ul>

        <h2>How to ask</h2>
        <p>
          Send your current host details on the <Link href="/migration" className="text-link underline underline-offset-4">migration page</Link>. We reply by email with the next steps.
        </p>

        <p>
          Related: <Link href="/migration" className="text-link underline underline-offset-4">Website migration</Link>
          {" · "}
          <Link href="/refund-policy" className="text-link underline underline-offset-4">Refund policy</Link>
          {" · "}
          <Link href="/contact" className="text-link underline underline-offset-4">Ask the team about this policy</Link>
        </p>
      </LegalPage>
    </>
  );
}
