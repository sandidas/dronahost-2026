import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default function ClientEndLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}