import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { NewPostView } from "@/components/portal/PostEditorView";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: POST_FORM_TEXT.newTitle };

export default async function AdminNewPostPage() {
  const actor = await requirePortal("portal.dashboard", "/dashboard/posts/new");
  return (
    <PortalShell actor={actor}>
      <NewPostView actor={actor} />
    </PortalShell>
  );
}
