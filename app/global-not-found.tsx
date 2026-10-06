import type { Metadata } from "next";
import NotFoundPage from "@/components/layout/NotFoundPage";
import RootDocument from "@/components/layout/RootDocument";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "Page not found | DronaHost", robots: { index: false, follow: false } };

/** App-wide 404 (unmatched URLs and notFound() calls). Rendered in the default locale. */
export default function GlobalNotFound() {
  return (
    <RootDocument locale={DEFAULT_LOCALE}>
      <NotFoundPage />
    </RootDocument>
  );
}
