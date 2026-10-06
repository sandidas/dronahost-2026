import home from "@/content/pages/home.json";
import JsonLd from "@/components/sections/JsonLd";
import { parsePage } from "@/lib/content/page";
import { renderPage } from "@/lib/content/render";
import { organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

// Validated at build time: an invalid spec fails the build instead of shipping a broken page.
const spec = parsePage(home);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // No `ogImage`: /og/home.jpg does not exist yet, so the default share image is used until it does.
  return buildMetadata({ locale, title: spec.seo.title, description: spec.seo.description, path: spec.path });
}

/**
 * Home page, rendered from content/pages/home.json through the section registry (docs/content-system.md). Sections whose
 * claims are not verified and published, or whose conditions are false, are left out with no empty gap. Server-rendered.
 */
export default function Home() {
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      {renderPage(spec)}
    </>
  );
}
