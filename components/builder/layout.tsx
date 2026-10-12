import type { ReactNode } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import type { BuilderDoc, ColumnsBlock, PostKind, SectionWidth } from "@/lib/builder/model";
import { youtubeEmbedSrc } from "@/lib/builder/model";
import { prepareSection } from "@/lib/builder/sections";
import { cn } from "@/utils/cn";
import { BAND_CLASS, BANDED } from "./SectionView";

/**
 * The page structure shared by the editor canvas and the public page: section shells, column grids, figures, video
 * frames and the alternating bands. Both sides build from these, so spacing, widths and backgrounds match exactly.
 */

const GRID: Record<ColumnsBlock["props"]["layout"], string> = {
  "1-1": "md:grid-cols-2",
  "2-1": "md:grid-cols-[2fr_1fr]",
  "1-2": "md:grid-cols-[1fr_2fr]",
  "1-1-1": "md:grid-cols-3",
};

/** A Section block. Pages: a full-width band with the site container. Posts: a run of article text in the post column. */
export function SectionShell({ kind, width, band, first, children }: { kind: PostKind; width: SectionWidth; band?: string; first?: boolean; children: ReactNode }) {
  if (kind === "post") return <div className={cn("article max-w-none [&>:first-child]:mt-0", !first && "mt-4")}>{children}</div>;
  return (
    <section className={cn("section-y", band)}>
      <div className="container-site">
        <div className={cn("article [&>:first-child]:mt-0", width === "text" ? "mx-auto" : "max-w-none")}>{children}</div>
      </div>
    </section>
  );
}

/** A full section (banner, FAQ, ...) inside a post's text column: spacing and padding fitted to the column. */
export const POST_SECTION_GAP = "builder-in-post my-10";

export function ColumnsGrid({ layout, children }: { layout: ColumnsBlock["props"]["layout"]; children: ReactNode }) {
  return <div className={cn("mt-8 grid gap-8", GRID[layout])}>{children}</div>;
}

export const COLUMN_CELL = "min-w-0 [&>:first-child]:mt-0";

export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="mt-8">
      {/* Staff images come from any https address or the site, so next/image (which needs known hosts) is not used. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-border" />
      {caption && <figcaption className="t-small mt-2 text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function VideoFrame({ id, title, inert }: { id: string; title: string; inert?: boolean }) {
  return (
    <div data-youtube-video="" className={inert ? "pointer-events-none" : undefined}>
      <iframe
        src={youtubeEmbedSrc(id)}
        title={title || EDITOR_TEXT.videoTitle}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        tabIndex={inert ? -1 : undefined}
      />
    </div>
  );
}

/**
 * Which root blocks get the muted band on a page: every second block that sits on the page background, counting only
 * blocks that show something. Banners and the hero keep their own backgrounds. Posts have no bands.
 */
export function pageBands(doc: BuilderDoc, kind: PostKind): Map<string, string> {
  const bands = new Map<string, string>();
  if (kind !== "page") return bands;
  let n = 0;
  for (const block of doc.blocks) {
    const type = block.type === "site" ? block.section.type : block.type;
    if (!BANDED.has(type)) continue;
    if (block.type === "site" && !prepareSection(block.section.type, block.section.content)) continue;
    if (n % 2 === 1) bands.set(block.id, BAND_CLASS);
    n += 1;
  }
  return bands;
}
