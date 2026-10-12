import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BuilderApp } from "@/components/builder/BuilderApp";
import { PortalError } from "@/components/portal/PortalError";
import { PortalShell } from "@/components/portal/PortalShell";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { requirePortal } from "@/lib/auth/session";
import { existingEditorInit, newEditorInit } from "@/lib/builder/editor-init";
import { FEATURE_LIBRARY } from "@/lib/content/features";
import { getPortalPost, getPortalPostBySlug } from "@/lib/portal/posts";

export const metadata: Metadata = { title: BUILDER_TEXT.ui.editorTitle };

const FEATURES = FEATURE_LIBRARY.map((f) => ({ id: f.id, title: f.tile.title }));

/**
 * One page for creating and editing posts and pages: /dashboard/posts/new (?kind=page for a page) and
 * /dashboard/posts/<slug>. Staff and admins; what each may change is decided on the server for every action.
 */
export default async function EditorPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ kind?: string }> }) {
  const { slug } = await params;
  const actor = await requirePortal("portal.dashboard", `/dashboard/posts/${encodeURIComponent(slug)}`);
  const actorName = actor.name || actor.email;

  if (slug === "new") {
    if (!can(actor.role, "post.create")) notFound();
    const kind = (await searchParams).kind === "page" ? "page" : "post";
    return <BuilderApp init={newEditorInit(actor, kind)} features={FEATURES} actorName={actorName} />;
  }

  const res = await getPortalPostBySlug(actor, slug);
  if (!res.ok) {
    // Links from before the editor used the post id: send them to the slug address.
    if (/^[a-f0-9]{24}$/.test(slug)) {
      const byId = await getPortalPost(actor, slug);
      if (byId.ok) redirect(`/dashboard/posts/${byId.data.slug}`);
    }
    return (
      <PortalShell actor={actor}>
        <PortalError message={res.error} />
      </PortalShell>
    );
  }
  return <BuilderApp init={existingEditorInit(actor, res.data)} features={FEATURES} actorName={actorName} />;
}
