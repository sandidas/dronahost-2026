import { Newspaper } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";
import CategoryFilter from "@/components/blog/CategoryFilter";
import Pagination from "@/components/blog/Pagination";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import JsonLd from "@/components/sections/JsonLd";
import ResourceGrid from "@/components/sections/ResourceGrid";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_CTA } from "@/content/home";
import { BlogUnavailableError, listCategories, listPosts, type BlogCategory, type BlogPage } from "@/lib/blog";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

type SearchParams = Promise<{ page?: string; category?: string }>;

const toPage = (v?: string) => Math.max(1, Math.min(500, Number.parseInt(v ?? "1", 10) || 1));
const safeSlug = (v?: string) => (v && /^[a-z0-9-]{1,80}$/.test(v) ? v : undefined);

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const page = toPage(sp.page);
  const category = safeSlug(sp.category);
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (page > 1) q.set("page", String(page));
  return buildMetadata({
    title: page > 1 ? `Blog, page ${page}: Hosting, Performance and Web Design | DronaHost` : "Blog: Hosting, Performance and Web Design | DronaHost",
    description: "Practical guides on WordPress hosting, web performance, SEO and web design from the DronaHost team.",
    path: `/blog${q.size ? `?${q}` : ""}`,
  });
}

async function BlogList({ page, category }: { page: number; category?: string }) {
  let data: BlogPage = { posts: [], page, totalPages: 1 };
  let categories: BlogCategory[] = [];
  let unavailable = false;
  try {
    [data, categories] = await Promise.all([listPosts({ page, category }), listCategories().catch(() => [])]);
  } catch (e) {
    if (!(e instanceof BlogUnavailableError)) throw e;
    unavailable = true;
  }

  const posts = data.posts.map((p) => ({
    title: p.title,
    description: p.excerpt,
    href: `/blog/${p.slug}`,
    category: p.category?.name,
    readTime: `${p.readingMinutes} min read`,
    date: p.published.slice(0, 10),
  }));

  return (
    <>
      <div className="container-site">
        <CategoryFilter categories={categories} active={category} />
      </div>
      {posts.length > 0 ? (
        <>
          <ResourceGrid title={category ? "Articles in this category" : "Latest articles"} posts={posts} />
          <div className="container-site -mt-8 pb-16">
            <Pagination page={data.page} totalPages={data.totalPages} basePath="/blog" params={{ category }} />
          </div>
        </>
      ) : (
        <section aria-label="Articles" className="section-y">
          <div className="container-site">
            {unavailable ? (
              <EmptyState icon={Newspaper} title="Articles are unavailable right now" body="We could not load the blog just now. Please try again in a few minutes." action={{ label: "Contact the team", href: "/contact" }} />
            ) : (
              <EmptyState icon={Newspaper} title={category ? "No articles in this category yet" : "Articles are on the way"} body="We are preparing our first guides. In the meantime, ask us anything about your site." action={{ label: category ? "See all articles" : "Talk to our team", href: category ? "/blog" : "/contact" }} />
            )}
          </div>
        </section>
      )}
    </>
  );
}

function BlogListSkeleton() {
  return (
    <div className="container-site section-y" role="status" aria-label="Loading articles">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function BlogIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = toPage(sp.page);
  const category = safeSlug(sp.category);

  return (
    <>
      <JsonLd
        schema={[
          { "@context": "https://schema.org", "@type": "Blog", name: "DronaHost Blog", url: `${SITE_URL}/blog`, publisher: { "@type": "Organization", name: "DronaHost" } },
          breadcrumbSchema(buildBreadcrumbs("/blog")),
        ]}
      />
      <CenteredHero
        eyebrow="Blog"
        title="Practical notes on"
        titleAccent="hosting and the web"
        description="Guides on WordPress, performance, security and search, written by the people who run the servers."
        primaryCta={{ label: "Talk to our team", href: "/contact" }}
      />
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList page={page} category={category} />
      </Suspense>
      <CTABand {...HOME_CTA} />
    </>
  );
}
