import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { PostsView, toFilter } from "@/components/portal/PostsView";
import { POSTS_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: POSTS_TEXT.title };

export default async function OfficePostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const actor = await requirePortal("portal.office", "/office/posts");
  const { status } = await searchParams;
  return (
    <PortalShell base="/office" actor={actor}>
      <PostsView base="/office" actor={actor} filter={toFilter(status)} />
    </PortalShell>
  );
}
