import type { Metadata } from "next";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import Analytics from "@/components/analytics/Analytics";
import CookieConsent from "@/components/consent/CookieConsent";
import { startingPriceLabel } from "@/lib/pricing";

/* ───────────────── FONTS ───────────────── */

// Body font — rounded, readable, strong at all weights
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Heading / display font — geometric, bold, premium at large sizes
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

// Monospace is used only for code samples, so it is not preloaded on every page.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/* ───────────────── METADATA ───────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com"),
  title: {
    default: "DronaHost — Managed WordPress & Cloud Hosting",
    template: "%s | DronaHost",
  },
  description: `Managed WordPress, VPS and cloud hosting for businesses in the US, UK, UAE and Europe${startingPriceLabel() ? `, from ${startingPriceLabel()}` : ""}.`,
  openGraph: {
    siteName: "DronaHost",
    locale: "en_US",
    type: "website",
  },
};

/* ───────────────── LAYOUT ───────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${manrope.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <CookieConsent />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
