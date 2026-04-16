import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

/* ───────────────── FONTS ───────────────── */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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