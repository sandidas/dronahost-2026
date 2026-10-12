"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BUILDER_TEXT } from "@/content/portal-strings";
import type { SiteBlock } from "@/lib/builder/model";
import { previewSiteBlockAction } from "@/lib/portal/actions/builder";
import { useBuilder } from "./store";

const T = BUILDER_TEXT.ui.block;

type Preview = { node: ReactNode; problems: string[] };

/**
 * A site section on the canvas: rendered on the server by the real section component (so it looks exactly as it will
 * live), refreshed shortly after each change. Until the section is complete it shows what is still missing. The
 * rendered section is inert: its links and buttons do nothing in the editor, and a click selects the block.
 */
export function SiteBlockView({ block }: { block: SiteBlock }) {
  const kind = useBuilder((s) => s.kind);
  const json = JSON.stringify(block);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    let current = true;
    const timer = setTimeout(async () => {
      setPending(true);
      const res = await previewSiteBlockAction(kind, json).catch(() => ({ ok: false as const, problems: [BUILDER_TEXT.ui.save.error] }));
      if (!current) return;
      setPreview(res.ok ? { node: res.node, problems: [] } : { node: null, problems: res.problems });
      setPending(false);
    }, 450);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [kind, json]);

  return (
    <div className="relative">
      {preview?.node ? (
        <div inert className="pointer-events-none select-none">
          {preview.node}
        </div>
      ) : preview && !pending ? (
        <div className="m-4 rounded-xl border border-dashed border-warning/60 bg-warning-surface p-5 text-sm">
          {preview.problems.length > 0 ? (
            <>
              <p className="flex items-center gap-2 font-semibold text-warning">
                <TriangleAlert className="size-4" aria-hidden="true" />
                {T.needs}
              </p>
              <ul className="mt-2 list-disc space-y-1 ps-6 text-foreground">
                {preview.problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-foreground">{T.hiddenOnSite}</p>
          )}
        </div>
      ) : null}
      {pending && (
        <div className={preview ? "absolute end-3 top-3" : "flex min-h-32 items-center justify-center"} role="status">
          <Loader2 className="size-5 animate-spin text-subtle-foreground" aria-hidden="true" />
          <span className="sr-only">{T.checking}</span>
        </div>
      )}
    </div>
  );
}
