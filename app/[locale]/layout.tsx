import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import RootDocument from "@/components/layout/RootDocument";
import { LIVE_LOCALES, LOCALES, isLive } from "@/lib/i18n/config";
import { startingPriceLabel } from "@/lib/pricing";

/* ───────────────── METADATA ───────────────── */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const og = isLive(locale) ? LOCALES[locale].ogLocale : "en_US";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com"),
    title: {
      default: "DronaHost — Managed WordPress & Cloud Hosting",
      template: "%s | DronaHost",
    },
    description: `Managed WordPress, VPS and cloud hosting for businesses in the US, UK, UAE and Europe${startingPriceLabel() ? `, from ${startingPriceLabel()}` : ""}.`,
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

