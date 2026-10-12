import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import RootDocument from "@/components/layout/RootDocument";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

// Every portal page depends on the signed-in person, so nothing here is prerendered or cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com"),
  title: { default: "Team portal", template: "%s | DronaHost team" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/** The team dashboard (/dashboard) and its sign-in pages. Not localized, never indexed. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale(DEFAULT_LOCALE);
  return <RootDocument locale={DEFAULT_LOCALE} tracking={false}>{children}</RootDocument>;
}
