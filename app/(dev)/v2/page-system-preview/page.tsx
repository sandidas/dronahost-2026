import type { Metadata } from "next";
import home from "@/tests/fixtures/home.page.json";
import { parsePage } from "@/lib/content/page";
import { defaultContext, type ResolveContext } from "@/lib/content/refs";
import { renderPage, visibleSections } from "@/lib/content/render";

export const metadata: Metadata = { title: "Page system preview", robots: { index: false, follow: false } };

/** Everything true: exercises every renderer adapter, as if all claims were published and prices confirmed. */
const everything: ResolveContext = { ...defaultContext, claimRenders: () => true, flag: () => true, predicate: () => false };

/**
 * Dev-only. Renders the home page spec (tests/fixtures/home.page.json) through the section registry, so the schema, the
 * resolvers and every renderer adapter run for real. `?mode=today` shows what would ship now (claims hidden, no gaps);
 * `?mode=all` forces every claim and flag on to check the adapters. This is not the home page.
 */
export default async function PageSystemPreview({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  const spec = parsePage(home);
  const ctx = mode === "all" ? everything : defaultContext;
  const shown = visibleSections(spec, ctx).map((s) => s.id).join(", ");
  return (
    <main id="main-content" tabIndex={-1} className="bg-background">
      <div className="container-site py-4 text-sm text-muted-foreground">
        Mode: <strong>{mode === "all" ? "all (forced on)" : "today"}</strong>. Sections after gating: {shown}
      </div>
      {renderPage(spec, ctx)}
    </main>
  );
}
