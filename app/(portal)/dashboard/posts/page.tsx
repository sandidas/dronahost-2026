import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";
import { PostsView, toFilter } from "@/components/portal/PostsView";
import { POSTS_TEXT } from "@/content/portal-strings";
import { requirePortal } from "@/lib/auth/session";

export const metadata: Metadata = { title: POSTS_TEXT.title };

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const actor = await requirePortal("portal.dashboard", "/dashboard/posts");
  const { status } = await searchParams;
  return (
    <PortalShell base="/dashboard" actor={actor}>
      <PostsView base="/dashboard" actor={actor} filter={toFilter(status)} />
    </PortalShell>
  );
}
