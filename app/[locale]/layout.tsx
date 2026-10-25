import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RootDocument from "@/components/layout/RootDocument";
import { LIVE_LOCALES, LOCALES, isLive } from "@/lib/i18n/config";

/* ───────────────── METADATA ───────────────── */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const og = isLive(locale) ? LOCALES[locale].ogLocale : "en_US";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com"),
    title: {
      default: "DronaHost: Managed WordPress Hosting and Web Services",
      template: "%s | DronaHost",
    },
    // No price here: prices appear only on /pricing (decision 58).
    description: "DronaHost is a managed WordPress hosting and web services company for businesses worldwide.",
    openGraph: { siteName: "DronaHost", locale: og, type: "website" },
  };
}

/** Only live locales are prerendered; the others are 404 until FEATURES.localeVariants is on. */
export function generateStaticParams() {
  return LIVE_LOCALES.map((locale) => ({ locale }));
}


export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLive(locale)) notFound();
  setRequestLocale(locale);
  return <RootDocument locale={locale}>{children}</RootDocument>;
}

