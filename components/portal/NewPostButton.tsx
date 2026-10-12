"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { POSTS_TEXT } from "@/content/portal-strings";
import { createDraftAction } from "@/lib/portal/actions/posts";

/**
 * The one "New post" button (`editorBase` is /dashboard/posts, passed in so this client file never imports the
 * server-only portal shell): it saves an empty draft first, then opens it in the editor at /dashboard/posts/<slug>.
 * Posts and pages share the editor; the Page tab decides where it prints.
 */
export function NewPostButton({ editorBase }: { editorBase: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        size="sm"
        loading={busy}
        leadingIcon={<Plus className="size-4" aria-hidden="true" />}
        onClick={async () => {
          setBusy(true);
          setError("");
          const res = await createDraftAction().catch(() => null);
          if (res?.ok) return router.push(`${editorBase}/${res.data.slug}`);
          setError(res && !res.ok ? res.error : POSTS_TEXT.createFailed);
          setBusy(false);
        }}
      >
        {POSTS_TEXT.newPost}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
