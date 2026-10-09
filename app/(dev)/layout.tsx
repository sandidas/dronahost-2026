import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RootDocument from "@/components/layout/RootDocument";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

// Render per request so production returns a real HTTP 404 (a static prerender would
// answer 200 with the not-found UI).
export const dynamic = "force-dynamic";

/** Dev-only route group (/v2 showcase and design system). Not available in production. Not localized. */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  // E2E_SHOWCASE=1 lets the end-to-end tests open the showcase on a production build (playwright.config.ts). It is never set in production.
  if (process.env.NODE_ENV !== "development" && process.env.E2E_SHOWCASE !== "1") notFound();
  setRequestLocale(DEFAULT_LOCALE);
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
