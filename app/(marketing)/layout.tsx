import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export default function ClientEndLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Header />
      {children}
      <Footer />
    </>
  );
}