import { setRequestLocale } from "next-intl/server";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import GlobalSupport from "@/components/layout/GlobalSupport";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default async function ClientEndLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <AnnouncementBar />
      <Header />
      {/* look-luxe: the Home look on every marketing page (app/styles/look-luxe.css). */}
      <main id="main-content" tabIndex={-1} className="look-luxe">
        {children}
        {/* Support band before the footer on every page (content/sections/support-band.json). */}
        <GlobalSupport />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}