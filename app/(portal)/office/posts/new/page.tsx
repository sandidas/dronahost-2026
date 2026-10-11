import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { NewPostView } from "@/components/portal/PostEditorView";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: POST_FORM_TEXT.newTitle };

export default async function OfficeNewPostPage() {
  const actor = await requirePortal("portal.office", "/office/posts/new");
  return (
    <PortalShell base="/office" actor={actor}>
      <NewPostView base="/office" actor={actor} />
    </PortalShell>
  );
}
