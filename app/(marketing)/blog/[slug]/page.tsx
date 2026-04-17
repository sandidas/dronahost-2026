import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Post, type IPost } from "@/lib/models/post";
import { buildMetadata } from "@/lib/seo/metadata";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import JsonLd from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/utils";
import Section from "@/components/section/section";
import HeadLineText from "@/components/HeadLineText/HeadLineText";

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    await connectToDatabase();
    const posts = await Post.find(
      { status: "published", deletedAt: null },
      { slug: 1, _id: 0 }
    ).lean();
    return posts.map((p) => ({ slug: p.slug as string }));
  } catch {
    // If DB is unreachable at build time (e.g. CI), return empty — pages are
    // generated on-demand via ISR fallback.
    return [];
  }
}

// ISR: revalidate every hour so edits to published posts propagate without
// a full redeploy.
export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const post = await Post.findOne(
      { slug, status: "published", deletedAt: null },
      { title: 1, excerpt: 1, coverImage: 1, publishedAt: 1 }
    ).lean() as Pick<IPost, "title" | "excerpt" | "coverImage" | "publishedAt"> | null;

    if (!post) {
      return buildMetadata({
        title: "Post Not Found | DronaHost Blog",
        description: "The blog post you are looking for could not be found.",
        path: `/blog/${slug}`,
        noIndex: true,
      });
    }

    return buildMetadata({
      title: `${post.title} | DronaHost Blog`,
      description: post.excerpt,
      path: `/blog/${slug}`,
      ogImage: post.coverImage?.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`,
      type: "article",
    });
  } catch {
    return buildMetadata({
      title: "DronaHost Blog",
      description: "Practical hosting, performance, and web design guides.",
      path: `/blog/${slug}`,
    });
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectToDatabase();

  const post = await Post.findOne(
    { slug, status: "published", deletedAt: null }
  ).lean() as IPost | null;

  if (!post) {
    notFound();
  }

  const publishedDateIso = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const updatedDateIso = new Date(post.updatedAt).toISOString();
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const schemas = [
    blogPostingSchema({
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      imageUrl: post.coverImage?.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`,
      authorName: post.author.name,
      datePublished: publishedDateIso,
      dateModified: updatedDateIso,
    }),
    breadcrumbSchema(
      buildBreadcrumbs(`/blog/${post.slug}`, { [post.slug]: post.title })
    ),
  ];

  return (
    <>
      <JsonLd schema={schemas} />

      <Section as="article" size="sm" padding="lg">
        {/* ── Hero ── */}
        <Section
          id="blog-post-hero"
          size="lg"
          padding="md"
          className="bg-slate-50 dark:bg-[#0a0d14]"
        >
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-50">
                {post.title}
              </span>
            </nav>

            {/* Category */}
            <span className="mb-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
              {post.category}
            </span>

            {/* Title */}
            <HeadLineText as="h1" fontSize="fiveXl" fontWeight="bold" align="left" className="mt-6">
              {post.title}
            </HeadLineText>

            {/* Excerpt */}
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {post.excerpt}
            </p>

            {/* Author + date */}
            <div className="mt-6 flex items-center gap-4">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {post.author.name}
                </p>
                <time
                  dateTime={publishedDateIso}
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  {formatDate(publishedDateIso)}
                </time>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Cover image ── */}
        <div className="relative mx-auto max-w-5xl px-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── Body ── */}
        <Section size="lg" padding="md" className="bg-white dark:bg-black">
          <div className="mx-auto max-w-3xl">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content — rendered as HTML from the DB */}
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Related resources */}
            <aside className="mt-16 border-t border-slate-100 pt-8 dark:border-slate-800">
              <p className="mb-4 font-semibold">Related resources</p>
              <ul className="space-y-2">
                <li><Link href="/wordpress-hosting" className="text-primary hover:underline">WordPress Hosting Plans</Link></li>
                <li><Link href="/pricing" className="text-primary hover:underline">Compare all hosting plans</Link></li>
                <li><Link href="/blog" className="text-primary hover:underline">More articles</Link></li>
              </ul>
            </aside>
          </div>
        </Section>
      </Section>
    </>
  );
}
