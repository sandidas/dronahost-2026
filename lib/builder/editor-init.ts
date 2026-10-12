import type { BuilderInit } from "@/components/builder/store";
import { POST_FORM_TEXT } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { formatDateTime } from "@/lib/portal/format";
import type { PostDetail } from "@/lib/portal/posts";
import type { Actor } from "@/lib/portal/result";
import { storageConfigured } from "@/lib/storage/s3";
import { entryByType } from "./catalog";
import { EMPTY_BUILDER_DOC, type BuilderDoc, type PostKind, type RootBlock } from "./model";

/** A new post starts with one section holding an empty text block; a new page starts empty. */
function starterDoc(kind: PostKind): BuilderDoc {
  if (kind === "page") return EMPTY_BUILDER_DOC;
  const section = entryByType("section")!.create() as Extract<RootBlock, { type: "section" }>;
  section.children.push(entryByType("richtext")!.create() as never);
  return { version: 1, blocks: [section] };
}

const flags = (actor: Actor) => ({ isAdmin: can(actor.role, "post.publish"), uploadEnabled: storageConfigured() && can(actor.role, "media.upload") });

export function newEditorInit(actor: Actor, kind: PostKind): BuilderInit {
  return {
    postId: null,
    kind,
    status: "draft",
    locked: false,
    canEdit: can(actor.role, "post.create"),
    ...flags(actor),
    meta: { title: "", slug: "", excerpt: "", coverImage: "" },
    doc: starterDoc(kind),
    publishedLine: null,
  };
}

export function existingEditorInit(actor: Actor, post: PostDetail): BuilderInit {
  return {
    postId: post.id,
    kind: post.kind,
    status: post.status,
    locked: post.locked,
    canEdit: post.canEdit,
    ...flags(actor),
    meta: { title: post.title, slug: post.slug, excerpt: post.excerpt, coverImage: post.coverImage },
    doc: post.content,
    publishedLine: post.publishedAt && post.publishedByName ? `${POST_FORM_TEXT.admin.publishedBy} ${post.publishedByName} ${POST_FORM_TEXT.admin.publishedOn} ${formatDateTime(post.publishedAt)}` : null,
  };
}
