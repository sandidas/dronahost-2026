"use client";

import { BUILDER_TEXT } from "@/content/portal-strings";
import { DEVICE_WIDTH } from "./Canvas";
import { CanvasFrame } from "./CanvasFrame";
import { useBuilder } from "./store";

/**
 * The saved version rendered by the server exactly as visitors get it, at the same device widths as the canvas
 * (desktop, tablet, phone), scaled to fit. Reloads after every save.
 */
export function PreviewFrame() {
  const slug = useBuilder((s) => s.savedSlug);
  const version = useBuilder((s) => s.savedVersion);
  const device = useBuilder((s) => s.device);
  if (!slug) return <p className="m-auto p-6 text-sm text-muted-foreground">{BUILDER_TEXT.ui.previewSaveFirst}</p>;
  return <CanvasFrame width={DEVICE_WIDTH[device]} src={`/dashboard/posts/${slug}/preview?v=${version}`} />;
}
