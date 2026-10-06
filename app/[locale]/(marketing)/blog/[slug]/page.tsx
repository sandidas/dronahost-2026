import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/blog/ArticleLayout";
import JsonLd from "@/components/sections/JsonLd";
import ResourceGrid from "@/components/sections/ResourceGrid";
import { getPost, listSlugs, relatedPosts } from "@/lib/blog";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    return (await listSlugs()).map(({ slug }) => ({ slug }));
  } catch {
    // Source unreachable at build time: pages are generated on demand.
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const post = await getPost(slug);
    if (!post) return buildMetadata({ locale, title: "Post not found | DronaHost Blog", description: "The article you are looking for could not be found.", path: `/blog/${slug}`, noIndex: true });
    return buildMetadata({
      locale,
      title: `${post.title} | DronaHost Blog`,
      description: post.excerpt,
      path: `/blog/${slug}`,
      ogImage: post.image?.url,
      type: "article",
    });
  } catch {
    return buildMetadata({ locale, title: "DronaHost Blog", description: "Practical hosting, performance and web design guides.", path: `/blog/${slug}` });
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // A source outage throws to blog/[slug]/error.tsx; a missing post is a real 404.
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await relatedPosts(post);

  return (
    <>
      <JsonLd
        schema={[
          blogPostingSchema({
            title: post.title,
            description: post.excerpt,
            url: `${SITE_URL}/blog/${post.slug}`,
            imageUrl: post.image?.url ?? `${SITE_URL}/images/og/default.jpg`,
            authorName: post.author.name,
            datePublished: post.published,
            dateModified: post.modified,
          }),
          breadcrumbSchema(buildBreadcrumbs(`/blog/${post.slug}`, { [post.slug]: post.title })),
        ]}
      />
      <ArticleLayout post={post} />
      <ResourceGrid
        eyebrow="Keep reading"
        title="Related articles"
        headingLevel="h2"
        posts={related.map((p) => ({ title: p.title, description: p.excerpt, href: `/blog/${p.slug}`, category: p.category?.name, readTime: `${p.readingMinutes} min read`, date: p.published.slice(0, 10) }))}
      />
    </>
  );
}
