import page from "@/content/pages/managed-vps-hosting.json";
import JsonLd from "@/components/sections/JsonLd";
import { parsePage } from "@/lib/content/page";
import { passes } from "@/lib/content/refs";
import { renderPage } from "@/lib/content/render";
import type { SectionSpec } from "@/lib/content/schemas/sections";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

// Validated at build time: an invalid spec fails the build instead of shipping a broken page.
const spec = parsePage(page);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // No price in the title or description (decision 63).
  return buildMetadata({ locale, title: spec.seo.title, description: spec.seo.description, path: spec.path });
}

/** The FAQ items that render on the page, so the FAQPage schema matches the visible FAQ exactly. */
function visibleFaq(): Array<{ question: string; answer: string }> {
  const faq = (spec.sections as SectionSpec[]).find((s) => s.type === "FAQSection");
  if (!faq || faq.type !== "FAQSection" || !passes(faq)) return [];
  return faq.content.items.filter((i) => passes(i)).map((i) => ({ question: i.q, answer: i.a }));
}

/**
 * Fully managed VPS hosting, rendered from content/pages/managed-vps-hosting.json through the section registry
 * (docs/content-system.md), in the first /cloud-web-hosting layout. Copy is stand-in until the content pass.
 */
export default function ManagedVpsHostingPage() {
  const faq = visibleFaq();
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(buildBreadcrumbs(spec.path)),
          serviceSchema({ name: "Fully managed VPS hosting", description: spec.seo.description, url: `https://dronahost.com${spec.path}` }),
          ...(faq.length >= 3 ? [faqPageSchema(faq)] : []),
        ]}
      />
      {renderPage(spec)}
    </>
  );
}
