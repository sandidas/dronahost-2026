import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { can } from "@/lib/auth/permissions";
import { EMPTY_DOC } from "@/lib/editor/schema";
import { formatDateTime } from "@/lib/portal/format";
import { getPortalPost } from "@/lib/portal/posts";
import type { Actor } from "@/lib/portal/result";
import { storageConfigured } from "@/lib/storage/s3";
import { PortalError } from "./PortalError";
import { PostAdminControls } from "./PostAdminControls";
import { PostForm, type PostFormValues } from "./PostForm";
import { PORTAL_HOME } from "./PortalShell";

function BackLink() {
  return (
    <Link href={`${PORTAL_HOME}/posts`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-link">
      <ArrowLeft className="size-4" aria-hidden="true" />
      {POST_FORM_TEXT.back}
    </Link>
  );
}

const NEW_POST: PostFormValues = { id: null, title: "", slug: "", excerpt: "", coverImage: "", content: EMPTY_DOC, status: "draft", locked: false };

/** New-post page for both portals. */
export function NewPostView({ actor }: { actor: Actor }) {
  if (!can(actor.role, "post.create")) notFound();
  return (
    <>
      <BackLink />
      <h1 className="t-h2 mt-2 text-foreground">{POST_FORM_TEXT.newTitle}</h1>
      <div className="mt-8 max-w-4xl">
        <PostForm post={NEW_POST} canEdit isAdmin={can(actor.role, "post.publish")} uploadEnabled={storageConfigured()} />
      </div>
    </>
  );
}

/** Edit page for both portals. Admins also get the publishing panel; staff see locked posts read-only. */
export async function PostEditorView({ actor, id }: { actor: Actor; id: string }) {
  const res = await getPortalPost(actor, id);
  if (!res.ok) {
    return (
      <>
        <BackLink />
        <PortalError message={res.error} />
      </>
    );
  }
  const post = res.data;
  const isAdmin = can(actor.role, "post.publish");
  const publishedLine =
    post.publishedAt && post.publishedByName ? `${POST_FORM_TEXT.admin.publishedBy} ${post.publishedByName} ${POST_FORM_TEXT.admin.publishedOn} ${formatDateTime(post.publishedAt)}` : null;

  return (
    <>
      <BackLink />
      <h1 className="t-h2 mt-2 text-foreground">{post.canEdit ? POST_FORM_TEXT.editTitle : POST_FORM_TEXT.viewTitle}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <PostForm
          key={String(post.canEdit)}
         
          post={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, coverImage: post.coverImage, content: post.content, status: post.status, locked: post.locked }}
          canEdit={post.canEdit}
          isAdmin={isAdmin}
          uploadEnabled={storageConfigured()}
        />
        {isAdmin && (
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PostAdminControls id={post.id} slug={post.slug} status={post.status} locked={post.locked} publishedLine={publishedLine} />
          </aside>
        )}
      </div>
    </>
  );
}
