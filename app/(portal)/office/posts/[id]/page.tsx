import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { PostEditorView } from "@/components/portal/PostEditorView";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: POST_FORM_TEXT.editTitle };

export default async function OfficeEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requirePortal("portal.office", `/office/posts/${encodeURIComponent(id)}`);
  return (
    <PortalShell base="/office" actor={actor}>
      <PostEditorView base="/office" actor={actor} id={id} />
    </PortalShell>
  );
}
