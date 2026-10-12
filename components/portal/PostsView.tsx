import { FileText, Lock, LockOpen, Plus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POSTS_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { can } from "@/lib/auth/permissions";
import { formatDateTime } from "@/lib/portal/format";
import { listPortalPosts, type PostRow } from "@/lib/portal/posts";
import type { Actor, Result } from "@/lib/portal/result";
import { cn } from "@/utils/cn";
import { PortalError } from "./PortalError";
import type { PortalBase } from "./PortalShell";

type Filter = "all" | "draft" | "published";
const FILTERS: Filter[] = ["all", "draft", "published"];

export const toFilter = (v: unknown): Filter => (v === "draft" || v === "published" ? v : "all");

function StatusFilter({ base, current }: { base: PortalBase; current: Filter }) {
  return (
    <nav aria-label={POSTS_TEXT.filterLabel} className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={f === "all" ? `${base}/posts` : `${base}/posts?status=${f}`}
          aria-current={current === f ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold",
            current === f ? "border-accent bg-accent/12 text-foreground" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {POSTS_TEXT.filters[f]}
        </Link>
      ))}
    </nav>
  );
}

function PostTable({ base, rows, actor }: { base: PortalBase; rows: PostRow[]; actor: Actor }) {
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow className="border-border text-muted-foreground">
          <TableHead>{POSTS_TEXT.columns.title}</TableHead>
          <TableHead>{POSTS_TEXT.columns.status}</TableHead>
          <TableHead>{POSTS_TEXT.columns.locked}</TableHead>
          <TableHead>{POSTS_TEXT.columns.author}</TableHead>
          <TableHead>{POSTS_TEXT.columns.updated}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((p) => {
          const editable = can(actor.role, "post.edit", { locked: p.locked });
          return (
            <TableRow key={p.id} className="border-border">
              <TableCell className="min-w-56">
                <Link href={`${base}/posts/${p.id}`} className="font-semibold text-link underline-offset-4 hover:underline">
                  {p.title}
                </Link>
                <span className="sr-only"> ({editable ? POSTS_TEXT.edit : POSTS_TEXT.view})</span>
                <span className="block text-xs text-subtle-foreground">/blog/{p.slug}</span>
              </TableCell>
              <TableCell>
                <Badge variant={p.status === "published" ? "success" : "neutral"}>{POSTS_TEXT.status[p.status]}</Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  {p.locked ? <Lock className="size-4 text-warning" aria-hidden="true" /> : <LockOpen className="size-4" aria-hidden="true" />}
                  {p.locked ? POSTS_TEXT.lockedYes : POSTS_TEXT.lockedNo}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{p.authorName || POSTS_TEXT.untitledAuthor}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(p.updatedAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/** Post list shared by /dashboard/posts and /office/posts. */
export async function PostsView({ base, actor, filter }: { base: PortalBase; actor: Actor; filter: Filter }) {
  const res = await listPortalPosts(actor, { status: filter === "all" ? undefined : filter });
  return <PostsList base={base} actor={actor} filter={filter} res={res} />;
}

/** The list itself, given the loaded rows (also rendered with sample rows on /v2). */
export function PostsList({ base, actor, filter, res }: { base: PortalBase; actor: Actor; filter: Filter; res: Result<PostRow[]> }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="t-h2 text-foreground">{POSTS_TEXT.title}</h1>
        {can(actor.role, "post.create") && (
          <Button href={`${base}/posts/new`} size="sm" leadingIcon={<Plus className="size-4" aria-hidden="true" />}>
            {POSTS_TEXT.newPost}
          </Button>
        )}
      </div>
      <div className="mt-6">
        <StatusFilter base={base} current={filter} />
      </div>
      {!res.ok ? (
        <PortalError message={res.error} />
      ) : res.data.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={FileText}
          title={POSTS_TEXT.empty.title}
          body={filter === "all" ? POSTS_TEXT.empty.body : POSTS_TEXT.empty.filtered}
          action={filter === "all" && can(actor.role, "post.create") ? { label: POSTS_TEXT.newPost, href: `${base}/posts/new` } : undefined}
        />
      ) : (
        <PostTable base={base} rows={res.data} actor={actor} />
      )}
    </>
  );
}
