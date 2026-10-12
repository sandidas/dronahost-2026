import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuilderPost from "@/components/blog/BuilderPost";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";
import { renderBuilderDoc } from "@/lib/builder/render";
import { getPortalPostBySlug } from "@/lib/portal/posts";
import "@/app/styles/rich-content.css";

export const metadata: Metadata = { title: BUILDER_TEXT.ui.previewTitle };

/**
 * The editor's preview: the saved version (draft or published) rendered as on the public site, for staff and admins
 * only. It sits under /dashboard, so it is never indexed and never cached.
 */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const actor = await requirePortal("portal.dashboard", `/dashboard/posts/${encodeURIComponent(slug)}`);
  const res = await getPortalPostBySlug(actor, slug);
  if (!res.ok) notFound();
  const post = res.data;
  const { body } = renderBuilderDoc(post.content, post.kind);
  return (
    <main id="main-content" tabIndex={-1} className="look-luxe">
      {post.kind === "post" ? <BuilderPost title={post.title}>{body}</BuilderPost> : body}
    </main>
  );
}
