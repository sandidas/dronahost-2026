import type { ReactNode } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageToc from "./PageToc";

type LegalPageProps = {
  title: string;
  /** URL path for the breadcrumb trail, e.g. "/terms". */
  path: string;
  /** ISO date (YYYY-MM-DD) of the last review. Shown spelled out, never ambiguous. */
  updated?: string;
  intro?: string;
  children: ReactNode;
};

const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/** Shared layout for policy pages: breadcrumbs, one H1, last-updated line, sticky TOC and the .article body. */
export default function LegalPage({ title, path, updated, intro, children }: LegalPageProps) {
  return (
    <div className="container-site section-y">
      <Breadcrumbs path={path} />
      <header className="mt-6 max-w-3xl">
        <h1 className="t-h1 text-foreground">{title}</h1>
        {updated && (
          <p className="t-small mt-3 text-muted-foreground">
            Last updated: <time dateTime={updated}>{longDate(updated)}</time>
          </p>
        )}
        {intro && <p className="t-lead mt-4">{intro}</p>}
      </header>
      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        <aside className="order-first lg:sticky lg:top-24 lg:self-start">
          <PageToc />
        </aside>
        <article className="article max-w-3xl">{children}</article>
      </div>
    </div>
  );
}
