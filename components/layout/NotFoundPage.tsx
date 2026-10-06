import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/link";
import Footer from "@/layouts/footer/footer";
import Header from "@/layouts/header/header";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/** Branded 404 with the site header and footer. Server-rendered, so it works without JavaScript. */
export default async function NotFoundPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: "notFound" });
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="container-site section-y text-center">
        <p className="t-eyebrow">404</p>
        <h1 className="t-h1 mt-3 text-foreground">{t("title")}</h1>
        <p className="t-lead mx-auto mt-4">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            {t("home")}
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-lg">
            {t("contact")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
