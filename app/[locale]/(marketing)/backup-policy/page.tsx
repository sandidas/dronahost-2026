import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Approved by the owner 2026-10-08 (Tier A).
  return buildMetadata({ locale, title: "Backup Policy", description: "How often DronaHost backs up your site and how often we back up your site.", path: "/backup-policy" });
}

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/backup-policy"))]} />
      <LegalPage title="Backup Policy" path="/backup-policy" updated="2026-10-08">
        <p>We back up your site once a day. Each new backup replaces the old one, which is deleted.</p>

        <h2>Need more copies?</h2>
        <p>Add the off-server backup to your plan. It keeps backups away from your hosting server. See the add-ons on the <Link href="/pricing" className="text-link underline underline-offset-4">pricing page</Link>.</p>

        <h2>Restoring a backup</h2>
        <p>Open a support ticket or write to us by email and ask us to restore the latest backup.</p>
        <p>
          Related: <Link href="/refund-policy" className="text-link underline underline-offset-4">Refund policy</Link>
          {" · "}
          <Link href="/pricing" className="text-link underline underline-offset-4">Plans and pricing</Link>
          {" · "}
          <Link href="/contact" className="text-link underline underline-offset-4">Contact us</Link>
        </p>
      </LegalPage>
    </>
  );
}
