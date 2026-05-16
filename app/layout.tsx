import type { Metadata } from "next";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ───────────────── METADATA ───────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com"),
  title: {
    default: "DronaHost — Managed WordPress & Cloud Hosting",
    template: "%s | DronaHost",
  },
  description: "High-performance WordPress, VPS, and cloud hosting for US, UK, and UAE businesses. LiteSpeed, NVMe, 24/7 support from $0.99/mo.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">

        {/* Theme Provider */}
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}