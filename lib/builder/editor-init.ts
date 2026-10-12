import type { BuilderInit } from "@/components/builder/store";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { formatDateTime } from "@/lib/portal/format";
import type { PostDetail } from "@/lib/portal/posts";
import type { Actor } from "@/lib/portal/result";
import { storageConfigured } from "@/lib/storage/s3";

const flags = (actor: Actor) => ({ isAdmin: can(actor.role, "post.publish"), uploadEnabled: storageConfigured() && can(actor.role, "media.upload") });

export function existingEditorInit(actor: Actor, post: PostDetail): BuilderInit {
  return {
    postId: post.id,
    kind: post.kind,
    status: post.status,
    locked: post.locked,
    canEdit: post.canEdit,
    ...flags(actor),
    meta: { title: post.title, slug: post.slug, excerpt: post.excerpt, coverImage: post.coverImage, coverImageAlt: post.coverImageAlt, seo: post.seo },
    doc: post.content,
    dates: { published: post.publishedAt ?? post.updatedAt, modified: post.updatedAt },
    publishedLine: post.publishedAt && post.publishedByName ? `${POST_FORM_TEXT.admin.publishedBy} ${post.publishedByName} ${POST_FORM_TEXT.admin.publishedOn} ${formatDateTime(post.publishedAt)}` : null,
  };
}
