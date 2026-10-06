import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Analytics from "@/components/analytics/Analytics";
import CookieConsent from "@/components/consent/CookieConsent";
import { geistMono, manrope, sora } from "@/app/fonts";
import { ThemeProvider } from "@/app/providers";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import "@/app/globals.css";

/**
 * The <html> and <body> shell shared by the localized site and the dev showcase.
 * `dark` is server-rendered so the first paint is already the default theme.
 */
export default async function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [messages, t] = await Promise.all([getMessages({ locale }), getTranslations({ locale, namespace: "common" })]);
  const { tag, dir } = LOCALES[locale];
  return (
    <html lang={tag} dir={dir} suppressHydrationWarning className={`dark ${manrope.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            {t("skipToContent")}
          </a>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
            <CookieConsent />
          </ThemeProvider>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
