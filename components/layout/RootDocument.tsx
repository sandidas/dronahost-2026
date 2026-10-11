import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import Analytics from "@/components/analytics/Analytics";
import RevealObserver from "@/components/motion/RevealObserver";
import CookieConsent from "@/components/consent/CookieConsent";
import { geistMono, manrope, sora } from "@/app/fonts";
import { ThemeProvider } from "@/app/providers";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import "@/app/globals.css";

/**
 * The <html> and <body> shell shared by the localized site and the dev showcase.
 * `dark` is server-rendered so the first paint is already the default theme.
 */
export default async function RootDocument({
  locale,
  children,
  tracking = true,
}: {
  locale: Locale;
  children: React.ReactNode;
  /** false for the team portals: no analytics, so no consent banner (they set only the strictly necessary sign-in cookie). */
  tracking?: boolean;
}) {
  const [messages, t] = await Promise.all([getMessages({ locale }), getTranslations({ locale, namespace: "common" })]);
  const { tag, dir } = LOCALES[locale];
  return (
    <html lang={tag} dir={dir} suppressHydrationWarning className={`dark ${manrope.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main-content" className="skip-link">
            {t("skipToContent")}
          </a>
          {/* Dark is the fallback (server-rendered `.dark`, no-JS, unknown preference). With enableSystem, defaultTheme must be
            "system" for a light-preferring system to get light; next-themes only reads the system when the theme is "system".
            The toggle stores an explicit choice, which then wins. The script runs before first paint, so there is no flash. */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            {tracking && <CookieConsent />}
            <RevealObserver />
          </ThemeProvider>
          {tracking && <Analytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
