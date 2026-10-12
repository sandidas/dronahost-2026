"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { GALLERY_TEXT } from "@/content/portal-strings";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type GalleryImage = { src: string; alt: string; caption?: string };

type GalleryProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  images: readonly GalleryImage[];
  /** grid = even tiles cropped to one shape · masonry = each picture at its own height, in columns. */
  layout?: "grid" | "masonry";
  /** Columns at large widths (two on tablets, one or two on phones). */
  columns?: 2 | 3 | 4 | 5;
  /** Tile shape in the grid layout. */
  aspect?: "square" | "landscape" | "portrait";
  gap?: "small" | "medium" | "large";
  /** Clicking a picture opens it full size, with previous and next. */
  lightbox?: boolean;
  /** Links and the lightbox do nothing (the page builder canvas). */
  inert?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const GRID_COLS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-2 lg:grid-cols-4", 5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" } as const;
const MASONRY_COLS = { 2: "sm:columns-2", 3: "sm:columns-2 lg:columns-3", 4: "columns-2 lg:columns-4", 5: "columns-2 md:columns-3 lg:columns-5" } as const;
const GAP = { small: { grid: "gap-2", col: "gap-2", item: "mb-2" }, medium: { grid: "gap-4", col: "gap-4", item: "mb-4" }, large: { grid: "gap-6", col: "gap-6", item: "mb-6" } } as const;
const ASPECT = { square: "aspect-square", landscape: "aspect-[4/3]", portrait: "aspect-[3/4]" } as const;

/**
 * A photo gallery: a grid of even tiles or a masonry of pictures at their own heights, with an optional caption under
 * each and an optional lightbox. The pictures are plain links to the full image, so they work without JavaScript and
 * are crawlable; the lightbox takes over the click when JavaScript runs.
 */
export default function Gallery({ eyebrow, title, description, images, layout = "grid", columns = 3, aspect = "square", gap = "medium", lightbox = true, inert = false, headingLevel = "h2", className }: GalleryProps) {
  const headingId = useId();
  const [open, setOpen] = useState<number | null>(null);
  if (images.length === 0) return null;
  const masonry = layout === "masonry";
  const g = GAP[gap];
  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} className="mb-10" />}
        <ul className={masonry ? cn("columns-1", MASONRY_COLS[columns], g.col) : cn("grid grid-cols-1", GRID_COLS[columns], g.grid)}>
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`} className={cn(masonry && cn("break-inside-avoid", g.item))}>
              <figure>
                <a
                  href={img.src}
                  tabIndex={inert ? -1 : undefined}
                  onClick={(e) => {
                    if (inert) return e.preventDefault();
                    if (!lightbox) return;
                    e.preventDefault();
                    setOpen(i);
                  }}
                  className="group block overflow-hidden rounded-xl border border-border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="sr-only">{GALLERY_TEXT.open}</span>
                  {/* Staff images come from any https address or the site, so next/image (which needs known hosts) is not used. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className={cn("w-full transition-transform duration-300 motion-safe:group-hover:scale-[1.03]", masonry ? "h-auto" : cn("h-full object-cover", ASPECT[aspect]))}
                  />
                </a>
                {img.caption && <figcaption className="t-small mt-2 text-muted-foreground">{img.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </div>
      {lightbox && !inert && open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}

/** The full-size view: native <dialog> (focus trap, Escape, focus return), arrow keys for previous and next. */
function Lightbox({ images, index, onIndex, onClose }: { images: readonly GalleryImage[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const img = images[index];
  const step = useCallback((d: number) => onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);
  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);
  if (!img) return null;
  const many = images.length > 1;
  const control = "inline-flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-md hover:bg-muted";
  return (
    <dialog
      ref={ref}
      aria-label={GALLERY_TEXT.position(index + 1, images.length)}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-black/80"
    >
      <figure className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} className="max-h-[80vh] max-w-[92vw] rounded-xl object-contain" />
        <figcaption className="mt-3 max-w-2xl text-center text-sm text-card-foreground">
          <span className="rounded-lg bg-card px-3 py-1.5">{img.caption ? `${img.caption} · ${GALLERY_TEXT.position(index + 1, images.length)}` : GALLERY_TEXT.position(index + 1, images.length)}</span>
        </figcaption>
      </figure>
      <div className="fixed end-4 top-4 flex gap-2">
        <button type="button" className={control} onClick={() => ref.current?.close()}>
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">{GALLERY_TEXT.close}</span>
        </button>
      </div>
      {many && (
        <>
          <button type="button" className={cn(control, "fixed start-4 top-1/2 -translate-y-1/2")} onClick={() => step(-1)}>
            <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
            <span className="sr-only">{GALLERY_TEXT.previous}</span>
          </button>
          <button type="button" className={cn(control, "fixed end-4 top-1/2 -translate-y-1/2")} onClick={() => step(1)}>
            <ChevronRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            <span className="sr-only">{GALLERY_TEXT.next}</span>
          </button>
        </>
      )}
    </dialog>
  );
}
