import type { ReactNode } from "react";
import { EDITOR_TEXT } from "@/content/portal-strings";
import type { RenderCtx } from "@/lib/builder/blocks/types";
import { youtubeEmbedSrc } from "@/lib/builder/model";
import { cn } from "@/utils/cn";

/**
 * Page structure shared by the editor canvas and the public page. Blocks build from these, so spacing, widths and
 * backgrounds match exactly on both.
 */

/** Text and media blocks: a band of the page (pages), or a run of the post's text column (posts). */
export function BlockShell({ ctx, width = "wide", article = false, children }: { ctx: RenderCtx; width?: "text" | "wide"; article?: boolean; children: ReactNode }) {
  if (ctx.kind === "post") return <div className={cn(article ? "article max-w-none [&>:first-child]:mt-0" : "my-8")}>{children}</div>;
  return (
    <section className={cn("section-y", ctx.band)}>
      <div className="container-site">
        <div className={cn(article && "article [&>:first-child]:mt-0", width === "text" ? "mx-auto max-w-3xl" : "max-w-none")}>{children}</div>
      </div>
    </section>
  );
}

/** A full section (hero, banner, FAQ, ...) inside a post's text column: spacing and padding fitted to the column. */
export function SectionFrame({ ctx, children }: { ctx: RenderCtx; children: ReactNode }) {
  return ctx.kind === "post" ? <div className="builder-in-post my-10">{children}</div> : <>{children}</>;
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
