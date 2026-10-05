import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import JsonLd from "@/components/sections/JsonLd";
import ResourceGrid, { type ResourcePost } from "@/components/sections/ResourceGrid";
import { HOME_CTA } from "@/content/home";
import { Post } from "@/lib/models/post";
import { connectToDatabase } from "@/lib/mongodb";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Blog: Hosting, Performance and Web Design | DronaHost",
  description: "Practical guides on WordPress hosting, web performance, SEO and web design from the DronaHost team.",
  path: "/blog",
});

type LeanPost = { slug: string; title: string; excerpt: string; category: string; publishedAt: Date | null; createdAt: Date };

async function loadPosts(): Promise<ResourcePost[]> {
  try {
    await connectToDatabase();
    const rows = (await Post.find({ status: "published", deletedAt: null }, { slug: 1, title: 1, excerpt: 1, category: 1, publishedAt: 1, createdAt: 1 })
      .sort({ publishedAt: -1 })
      .limit(24)
      .lean()) as unknown as LeanPost[];
    return rows.map((p) => ({
      title: p.title,
      description: p.excerpt,
      href: `/blog/${p.slug}`,
      category: p.category,
      date: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
    }));
  } catch {
    // Database unreachable: render the empty state instead of failing the page.
    return [];
  }
}

export default async function BlogPage() {
  const posts = await loadPosts();
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
      {posts.length > 0 ? (
        <ResourceGrid title="Latest articles" posts={posts} />
      ) : (
        <section aria-labelledby="blog-empty" className="section-y">
          <div className="container-site text-center">
            <h2 id="blog-empty" className="t-h3 text-foreground">
              Articles are on the way
            </h2>
            <p className="t-body mx-auto mt-3 text-muted-foreground">We are preparing our first guides. In the meantime, ask us anything about your site.</p>
          </div>
        </section>
      )}
      <CTABand {...HOME_CTA} />
    </>
  );
}
