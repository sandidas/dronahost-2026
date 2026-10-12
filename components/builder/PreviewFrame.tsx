"use client";

import { BUILDER_TEXT } from "@/content/portal-strings";
import { cn } from "@/utils/cn";
import { useBuilder, type Device } from "./store";

const WIDTH: Record<Device, string> = { desktop: "w-full", tablet: "w-[768px]", phone: "w-[390px]" };

/**
 * The saved version rendered by the server exactly as visitors get it, in a frame at the chosen width, so the site's
 * own breakpoints apply (resizing a div would not trigger them). Reloads after every save.
 */
export function PreviewFrame() {
  const slug = useBuilder((s) => s.savedSlug);
  const version = useBuilder((s) => s.savedVersion);
  const device = useBuilder((s) => s.device);
  if (!slug) return <p className="m-auto p-6 text-sm text-muted-foreground">{BUILDER_TEXT.ui.previewSaveFirst}</p>;
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center overflow-auto bg-muted/50 p-3 sm:p-6">
      <p className="mb-3 text-xs text-muted-foreground">{BUILDER_TEXT.ui.previewNote}</p>
      <iframe
        key={`${slug}-${version}`}
        src={`/dashboard/posts/${slug}/preview?v=${version}`}
        title={BUILDER_TEXT.ui.actions.preview}
        className={cn("max-w-full flex-1 rounded-xl border border-border bg-background shadow-sm", WIDTH[device])}
      />
    </div>
  );
}
