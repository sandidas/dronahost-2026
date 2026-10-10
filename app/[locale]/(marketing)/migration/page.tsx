import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/sections/JsonLd";
import MigrationForm from "@/components/forms/MigrationForm";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Website Migration Request",
    description: "Ask DronaHost to move your website. Tell us where it lives today and we will copy it across and let you review it before you switch your domain.",
    path: "/migration",
  });
}

export default function Page() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/migration"))]} />
      <div className="container-site section-y">
        <Breadcrumbs path="/migration" />
        <div className="mx-auto mt-8 max-w-2xl">
          <p className="t-eyebrow">Website migration</p>
          <h1 className="t-h1 mt-3 text-foreground">Move your site to DronaHost</h1>
          <p className="t-lead mt-4">Tell us where your site lives today. We copy it across and you review the result before your domain changes. Your current host stays live until you switch.</p>
          <div className="mt-10">
            <MigrationForm />
          </div>
        </div>
      </div>
    </>
  );
}
