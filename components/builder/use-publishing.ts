"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BUILDER_TEXT, POST_FORM_TEXT } from "@/content/portal-strings";
import { deletePostAction, savePostAction, setLockedAction, setPublishedAction } from "@/lib/portal/actions/posts";
import { formatDateTime } from "@/lib/portal/format";
import { useBuilderApi } from "./store";

const editorPath = (slug: string) => `/dashboard/posts/${slug}`;

/**
 * Save, publish, lock and delete for the builder. Every action is a server action that checks permissions again;
 * these functions only keep the editor's state in step with the result.
 */
export function usePublishing(actorName: string) {
  const api = useBuilderApi();
  const router = useRouter();

  const save = useCallback(async (): Promise<boolean> => {
    const s = api.getState();
    if (!s.canEdit) return false;
    if (s.saveState === "saving") return false;
    s.saving();
    const res = await savePostAction(s.postId, { kind: s.kind, ...s.meta, content: JSON.stringify(s.doc) });
    if (!res.ok) {
      api.getState().failed(res.error, res.fieldErrors);
      return false;
    }
    api.getState().saved({ postId: res.data.id, slug: res.data.slug });
    // Keep the address in step with the slug without reloading the editor (and losing undo history).
    if (window.location.pathname !== editorPath(res.data.slug)) window.history.replaceState(null, "", editorPath(res.data.slug));
    return true;
  }, [api]);

  /** Saves what is unsaved first, then publishes. Problems come back per block and are marked on the canvas. */
  const setPublished = useCallback(
    async (publish: boolean) => {
      const s = api.getState();
      if (s.saveState !== "saved" && !(await save())) return;
      const id = api.getState().postId;
      if (!id) return;
      const res = await setPublishedAction(id, publish);
      if (!res.ok) {
        const problems: Record<string, string[]> = {};
        for (const [blockId, text] of Object.entries(res.fieldErrors ?? {})) problems[blockId] = text.split("\n");
        const first = Object.keys(problems).find((k) => k !== "page");
        api.getState().set({ problems, message: { kind: "error", text: res.error } });
        if (first) api.getState().select(first);
        return;
      }
      const line = publish ? `${POST_FORM_TEXT.admin.publishedBy} ${actorName} ${POST_FORM_TEXT.admin.publishedOn} ${formatDateTime(new Date().toISOString())}` : undefined;
      api.getState().statusChanged(res.data.status, publish ? true : api.getState().locked, line);
      api.getState().set({ message: { kind: "ok", text: publish ? BUILDER_TEXT.ui.published : BUILDER_TEXT.ui.unpublished } });
    },
    [api, save, actorName],
  );

  const setLocked = useCallback(
    async (locked: boolean) => {
      const id = api.getState().postId;
      if (!id) return;
      const res = await setLockedAction(id, locked);
      if (!res.ok) return api.getState().set({ message: { kind: "error", text: res.error } });
      api.getState().statusChanged(api.getState().status, locked);
    },
    [api],
  );

  const remove = useCallback(async () => {
    const id = api.getState().postId;
    if (!id) return;
    const res = await deletePostAction(id);
    if (!res.ok) return api.getState().set({ message: { kind: "error", text: res.error } });
    router.push("/dashboard/posts");
  }, [api, router]);

  return { save, setPublished, setLocked, remove };
}
