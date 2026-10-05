import Link from "next/link";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="container-site section-y text-center">
        <p className="t-eyebrow">404</p>
        <h1 className="t-h1 mt-3 text-foreground">This page could not be found</h1>
        <p className="t-lead mx-auto mt-4">The link may be out of date, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            Go to the homepage
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            Contact the team
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
