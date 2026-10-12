"use client";

import { Loader2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { uploadImage } from "@/components/portal/editor/upload-image";
import { BUILDER_TEXT } from "@/content/portal-strings";
import { cn } from "@/utils/cn";

const M = BUILDER_TEXT.media;

export type MediaItem = { id: string; url: string; name: string; createdAt: string };

type Props = { open: boolean; onClose: () => void; onChoose: (url: string) => void };

/**
 * Images uploaded to storage (S3) by the team, newest first, with an upload button. Choosing one fills the image field
 * that opened the library, so a photo is uploaded once and used anywhere.
 */
export function MediaLibrary({ open, onClose, onChoose }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (before?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portal/media${before ? `?before=${encodeURIComponent(before)}` : ""}`, { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as { items?: MediaItem[]; next?: string | null; error?: string };
      if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error ?? M.loadFailed);
      setItems((prev) => (before ? [...prev, ...data.items!] : data.items!));
      setNext(data.next ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : M.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loads when the library opens.
    if (open) void load();
  }, [open, load]);

  return (
    <Dialog open={open} onClose={onClose} title={M.title} description={M.intro} className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <label className={cn("inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-action px-4 text-sm font-semibold text-action-foreground hover:bg-action-hover", busy && "opacity-60")}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
          {busy ? M.uploading : M.upload}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setBusy(true);
              setError(null);
              const res = await uploadImage(file);
              setBusy(false);
              if ("url" in res) {
                onChoose(res.url);
                onClose();
              } else setError(res.error);
            }}
          />
        </label>
        <span className="text-xs text-muted-foreground">{M.limits}</span>
      </div>
      {error && (
        <p className="mt-3 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="mt-5 max-h-[55vh] overflow-y-auto">
        {items.length === 0 && !loading && !error && <p className="py-8 text-center text-sm text-muted-foreground">{M.empty}</p>}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onChoose(item.url);
                  onClose();
                }}
                className="group block w-full overflow-hidden rounded-xl border border-border text-start hover:border-accent focus-visible:border-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" loading="lazy" className="aspect-[4/3] w-full bg-muted object-cover" />
                <span className="block truncate px-2 py-1.5 text-xs text-muted-foreground group-hover:text-foreground">{item.name || M.choose}</span>
              </button>
            </li>
          ))}
        </ul>
        {loading && (
          <div className="flex justify-center py-6" role="status">
            <Loader2 className="size-5 animate-spin text-subtle-foreground" aria-hidden="true" />
            <span className="sr-only">{M.loading}</span>
          </div>
        )}
        {next && !loading && (
          <div className="mt-4 flex justify-center">
            <button type="button" onClick={() => void load(next)} className="btn btn-ghost btn-sm">
              {M.loadMore}
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
