"use client";

import NextImage from "next/image";
import { useState } from "react";

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGMEYwIi8+PC9zdmc+";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  skeleton?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
};

export default function Image({
  src,
  alt,
  width = 600,
  height = 400,
  priority = false,
  skeleton = true,
  fill = false,
  sizes,
  className,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className="relative overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
        style={fill ? { width: "100%", height: "100%" } : { width: "100%", aspectRatio: `${width} / ${height}` }}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {alt && <span className="text-xs text-center px-4 line-clamp-2">{alt}</span>}
        </div>
      </div>
    );
  }

  const showSkeleton = skeleton && !priority && !isLoaded;

  return (
    <>
      <div className={fill ? "relative w-full h-full" : "relative overflow-hidden rounded-lg"}>
        {showSkeleton && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 animate-pulse rounded-lg" />
        )}
        <NextImage
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          className={`${className ?? (fill ? "object-cover" : "w-full h-auto")} transition-opacity duration-500 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
      <noscript>
        <NextImage
          className={className ?? "h-full w-full"}
          src={src}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          alt={alt}
        />
      </noscript>
    </>
  );
}
