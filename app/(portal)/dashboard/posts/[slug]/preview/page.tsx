import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/blog/ArticleLayout";
import CenteredHero from "@/components/sections/CenteredHero";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";
import { readingMinutesOf, renderBuilderDoc } from "@/lib/builder/render";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { getPortalPostBySlug } from "@/lib/portal/posts";

export const metadata: Metadata = { title: BUILDER_TEXT.ui.previewTitle };

/**
 * The editor's preview: the saved version (draft or published) rendered with the public layout, for staff and admins
 * only. It sits under /dashboard, so it is never indexed and never cached.
 */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const actor = await requirePortal("portal.dashboard", `/dashboard/posts/${encodeURIComponent(slug)}`);
  const res = await getPortalPostBySlug(actor, slug);
  if (!res.ok) notFound();
  const post = res.data;
  const { body, toc, text, hasHero } = renderBuilderDoc(post.content, post.kind);
  const now = new Date().toISOString();

  if (post.kind === "page") {
    return (
      <main id="main-content" tabIndex={-1} className="look-luxe">
        {!hasHero && <CenteredHero title={post.title} description={post.excerpt} />}
        {body}
      </main>
    );
  }
  return (
    <main id="main-content" tabIndex={-1} className="look-luxe">
      <ArticleLayout
        post={{
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          html: "",
          body,
          toc,
          published: post.publishedAt ?? now,
          modified: post.updatedAt,
          category: null,
          author: { name: post.authorName || actor.name, bio: null, avatar: null },
          image: isSafeImageSrc(post.coverImage) ? { url: post.coverImage, alt: post.coverImageAlt, width: 1200, height: 630 } : null,
          readingMinutes: readingMinutesOf(text),
        }}
      />
    </main>
  );
}
