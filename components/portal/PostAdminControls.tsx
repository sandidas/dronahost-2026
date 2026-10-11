"use client";

import { Eye, Lock, LockOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Badge from "@/components/ui/Badge";
import Dialog from "@/components/ui/Dialog";
import { POST_FORM_TEXT, POSTS_TEXT } from "@/content/portal-strings";
import { deletePostAction, setLockedAction, setPublishedAction } from "@/lib/portal/actions/posts";
import type { Result } from "@/lib/portal/result";
import { errorClass, panelClass } from "./field-styles";

type Props = {
  id: string;
  slug: string;
  status: "draft" | "published";
  locked: boolean;
  publishedLine: string | null;
};

const T = POST_FORM_TEXT.admin;

/** Admin-only publishing panel: publish or unpublish, lock or unlock, delete (with confirmation). The server checks the role again. */
export function PostAdminControls({ id, slug, status, locked, publishedLine }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function run(op: () => Promise<Result<unknown>>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await op();
      if (!res.ok) return setError(res.error);
      if (after) after();
      else router.refresh();
    });
  }

  return (
    <section aria-labelledby="publishing-heading" className={panelClass}>
      <h2 id="publishing-heading" className="t-h4 text-foreground">
        {T.heading}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={status === "published" ? "success" : "neutral"}>{POSTS_TEXT.status[status]}</Badge>
        {locked && <Badge variant="warning">{POSTS_TEXT.lockedYes}</Badge>}
      </div>
      {publishedLine && <p className="mt-3 text-sm text-muted-foreground">{publishedLine}</p>}

      <div className="mt-5 grid gap-2">
        {status === "draft" ? (
          <button type="button" className="btn btn-primary btn-sm" disabled={pending} aria-busy={pending} onClick={() => run(() => setPublishedAction(id, true))}>
            {T.publish}
          </button>
        ) : (
          <button type="button" className="btn btn-secondary btn-sm" disabled={pending} aria-busy={pending} onClick={() => run(() => setPublishedAction(id, false))}>
            {T.unpublish}
          </button>
        )}
        <button type="button" className="btn btn-secondary btn-sm" disabled={pending} onClick={() => run(() => setLockedAction(id, !locked))}>
          {locked ? <LockOpen className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
          {locked ? T.unlock : T.lock}
        </button>
        {status === "published" && (
          <a href={`/blog/${slug}`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
            <Eye className="size-4" aria-hidden="true" />
            {T.viewLive}
          </a>
        )}
        <button type="button" className="btn btn-ghost btn-sm text-danger" disabled={pending} onClick={() => setConfirming(true)}>
          <Trash2 className="size-4" aria-hidden="true" />
          {T.delete}
        </button>
      </div>
      {status === "draft" && <p className="mt-4 text-sm text-muted-foreground">{T.publishNote}</p>}
      <p role="alert" className={error ? errorClass : "sr-only"}>
        {error ?? ""}
      </p>

      <Dialog open={confirming} onClose={() => setConfirming(false)} title={T.deleteTitle} description={T.deleteBody}>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
            {T.cancel}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={pending}
            aria-busy={pending}
            onClick={() =>
              run(
                () => deletePostAction(id),
                () => {
                  setConfirming(false);
                  router.push("/dashboard/posts");
                },
              )
            }
          >
            {T.deleteConfirm}
          </button>
        </div>
      </Dialog>
    </section>
  );
}
