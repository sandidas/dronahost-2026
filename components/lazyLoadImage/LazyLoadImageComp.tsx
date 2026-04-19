"use client";

import Image from "next/image";
import React, { useState } from "react";
import PlaceHolderImage from "@/public/images/placeholder-sandipan-das.webp";

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjcyNzI3Ii8+PC9zdmc+";

interface IProps {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

const LazyLoadImageComp: React.FC<IProps> = ({
  src,
  alt,
  className = "w-full h-auto",
  width = 600,
  height = 400,
  priority = false,
  fill = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ── error / missing src fallback ───────────────────────────────────────────
  if (hasError || !src) {
    if (fill) {
      return (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-zinc-400 dark:text-zinc-600">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      );
    }
    return (
      <div
        className="relative overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center"
        style={{ width: "100%", aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label={alt}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-zinc-400 dark:text-zinc-600">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  // ── fill mode: image stretches to cover its positioned parent ──────────────
  if (fill) {
    return (
      <>
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 33vw, (max-width: 1280px) 20vw, 14vw"
          className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      </>
    );
  }

  // ── standard fixed-size mode ───────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden rounded-lg">
      {!loaded && (
        <div
          className="absolute inset-0 bg-zinc-200 dark:bg-zinc-900 animate-pulse rounded-lg"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
      />
    </div>
  );
};

export default LazyLoadImageComp;
