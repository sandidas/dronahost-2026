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
 * The editor for posts and pages alike, at /dashboard/posts/<id>: the database id, which never changes, while the
 * slug can. Every record opened here already exists ("New post" in the list saves an empty draft first). An old link
 * by slug is sent on to the id address. Staff and admins; what each may change is decided on the server for every action.
 */
export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requirePortal("portal.dashboard", `/dashboard/posts/${encodeURIComponent(id)}`);
  const actorName = actor.name || actor.email;

  // The old "new post" address: drafts are now created from the list.
  if (id === "new") redirect("/dashboard/posts");

  const res = await getPortalPost(actor, id);
  if (!res.ok) {
    // Links from when the editor used the slug: send them to the id address.
    const bySlug = await getPortalPostBySlug(actor, id);
    if (bySlug.ok) redirect(`/dashboard/posts/${bySlug.data.id}`);
    return (
      <PortalShell actor={actor}>
        <PortalError message={res.error} />
      </PortalShell>
    );
  }
  return <BuilderApp init={existingEditorInit(actor, res.data)} actorName={actorName} />;
}
