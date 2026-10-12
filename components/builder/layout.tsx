import type { ReactNode } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import type { Frame } from "@/lib/builder/blocks/frame";
import { BAND_CLASS, youtubeEmbedSrc } from "@/lib/builder/model";
import { cn } from "@/utils/cn";

/**
 * Page structure shared by the editor canvas and the public page. Blocks build from these, so spacing, widths and
 * backgrounds match exactly on both.
 */

const WIDTH: Record<Frame["width"], string> = { site: "container-site", narrow: "container-site max-w-3xl", full: "px-[var(--gutter)]" };
const PADDING: Record<Frame["padding"], string> = { normal: "section-y", none: "", small: "py-6 sm:py-8", large: "py-20 sm:py-28 lg:py-32" };
// `dark` switches the tokens to the dark theme (the same ink as the site's navy bands), so every colour pair stays checked.
const BACKGROUND: Record<Frame["background"], string> = { default: "", muted: "border-y border-border bg-muted", texture: BAND_CLASS, dark: "dark bg-background text-foreground" };

/**
 * A content block (text, two columns, image, video, code) as a band of the page: the width, spacing and background
 * chosen in the Block panel. `article` gives rich text the site's article typography, filling the chosen width.
 */
export function BlockShell({ frame, article = false, children }: { frame: Frame; article?: boolean; children: ReactNode }) {
  return (
    <section className={cn(PADDING[frame.padding], BACKGROUND[frame.background])}>
      <div className={WIDTH[frame.width]}>
        <div className={cn(article && "article max-w-none [&>:first-child]:mt-0")}>{children}</div>
      </div>
    </section>
  );
}

/** Sanitised rich text. `contents` keeps the article's spacing rules (`.article p`, `.article h2`) on the inner elements. */
export function Html({ html }: { html: string }) {
  return <div className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure>
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
