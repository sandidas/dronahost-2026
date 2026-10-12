import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BuilderApp } from "@/components/builder/BuilderApp";
import { PortalError } from "@/components/portal/PortalError";
import { PortalShell } from "@/components/portal/PortalShell";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";
import { existingEditorInit } from "@/lib/builder/editor-init";
import { getPortalPost, getPortalPostBySlug } from "@/lib/portal/posts";

export const metadata: Metadata = { title: BUILDER_TEXT.ui.editorTitle };

/**
 * The editor for posts and pages alike, at /dashboard/posts/<slug>. Every record opened here already exists: "New post"
 * in the list saves an empty draft first. Staff and admins; what each may change is decided on the server for every action.
 */
export default async function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const actor = await requirePortal("portal.dashboard", `/dashboard/posts/${encodeURIComponent(slug)}`);
  const actorName = actor.name || actor.email;

  // The old "new post" address: drafts are now created from the list.
  if (slug === "new") redirect("/dashboard/posts");

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
  return <BuilderApp init={existingEditorInit(actor, res.data)} actorName={actorName} />;
}
