import { setRequestLocale } from "next-intl/server";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
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
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}