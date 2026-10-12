import { FileText, Lock, LockOpen } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { POSTS_TEXT } from "@/content/portal-strings";
import { Link } from "@/i18n/link";
import { can } from "@/lib/auth/permissions";
import { formatDateTime } from "@/lib/portal/format";
import { listPortalPosts, type PostRow } from "@/lib/portal/posts";
import type { Actor, Result } from "@/lib/portal/result";
import { cn } from "@/utils/cn";
import { NewPostButton } from "./NewPostButton";
import { PortalError } from "./PortalError";
import { PORTAL_HOME } from "./PortalShell";

type Status = "all" | "draft" | "published";
type Kind = "all" | "post" | "page";
export type ListFilter = { status: Status; kind: Kind };
const STATUSES: Status[] = ["all", "draft", "published"];
const KINDS: Kind[] = ["all", "post", "page"];

export const toFilter = (params: { status?: unknown; kind?: unknown }): ListFilter => ({
  status: params.status === "draft" || params.status === "published" ? params.status : "all",
  kind: params.kind === "post" || params.kind === "page" ? params.kind : "all",
});

const listHref = (f: ListFilter) => {
  const q = new URLSearchParams();
  if (f.kind !== "all") q.set("kind", f.kind);
  if (f.status !== "all") q.set("status", f.status);
  const query = q.toString();
  return `${PORTAL_HOME}/posts${query ? `?${query}` : ""}`;
};

const pill = (active: boolean) =>
  cn("inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold", active ? "border-accent bg-accent/12 text-foreground" : "border-border text-muted-foreground hover:text-foreground");

function Filters({ current }: { current: ListFilter }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      <nav aria-label={POSTS_TEXT.kindFilterLabel} className="flex flex-wrap gap-2">
        {KINDS.map((kind) => (
          <Link key={kind} href={listHref({ ...current, kind })} aria-current={current.kind === kind ? "page" : undefined} className={pill(current.kind === kind)}>
            {POSTS_TEXT.kinds[kind]}
          </Link>
        ))}
      </nav>
      <nav aria-label={POSTS_TEXT.filterLabel} className="flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <Link key={status} href={listHref({ ...current, status })} aria-current={current.status === status ? "page" : undefined} className={pill(current.status === status)}>
            {POSTS_TEXT.filters[status]}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function PostTable({ rows, actor }: { rows: PostRow[]; actor: Actor }) {
  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow className="border-border text-muted-foreground">
          <TableHead>{POSTS_TEXT.columns.title}</TableHead>
          <TableHead>{POSTS_TEXT.columns.kind}</TableHead>
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
                <Link href={`${PORTAL_HOME}/posts/${p.slug}`} className="font-semibold text-link underline-offset-4 hover:underline">
                  {p.title || POSTS_TEXT.untitled}
                </Link>
                <span className="sr-only"> ({editable ? POSTS_TEXT.edit : POSTS_TEXT.view})</span>
                <span className="block text-xs text-subtle-foreground">{p.kind === "page" ? `/${p.slug}` : `/blog/${p.slug}`}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">{POSTS_TEXT.kinds[p.kind]}</TableCell>
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

/** Posts and pages in one list, filtered by kind and status. */
export async function PostsView({ actor, filter }: { actor: Actor; filter: ListFilter }) {
  const res = await listPortalPosts(actor, { status: filter.status === "all" ? undefined : filter.status, kind: filter.kind === "all" ? undefined : filter.kind });
  return <PostsList actor={actor} filter={filter} res={res} />;
}

/** The list itself, given the loaded rows (also rendered with sample rows on /v2). */
export function PostsList({ actor, filter, res }: { actor: Actor; filter: ListFilter; res: Result<PostRow[]> }) {
  const canCreate = can(actor.role, "post.create");
  const unfiltered = filter.status === "all" && filter.kind === "all";
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="t-h2 text-foreground">{POSTS_TEXT.title}</h1>
        {canCreate && <NewPostButton editorBase={`${PORTAL_HOME}/posts`} />}
      </div>
      <div className="mt-6">
        <Filters current={filter} />
      </div>
      {!res.ok ? (
        <PortalError message={res.error} />
      ) : res.data.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={FileText}
          title={POSTS_TEXT.empty.title}
          body={unfiltered ? POSTS_TEXT.empty.body : POSTS_TEXT.empty.filtered}
        />
      ) : (
        <PostTable rows={res.data} actor={actor} />
      )}
    </>
  );
}
