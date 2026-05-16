"use client";

import { useEffect, useRef, useState } from "react";

interface HomeHeroBannerVideoProps {
  /** YouTube video ID — the part after watch?v= */
  videoId: string;
}

function buildEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay:       "1",
    mute:           "1",
    loop:           "1",
    playlist:       videoId,
    controls:       "0",
    rel:            "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb:      "1",
    fs:             "0",
    playsinline:    "1",
    start:          "0",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

// SSR renders an empty container + overlay divs only.
// iframe src is set client-side via IntersectionObserver.
export default function HomeHeroBannerVideo({ videoId }: HomeHeroBannerVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !embedUrl) {
          setEmbedUrl(buildEmbedUrl(videoId));
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoId, embedUrl]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
    >
      {embedUrl && (
        <iframe
          src={embedUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          title="Background video"
          className="pointer-events-none absolute border-0"
          style={{
            top:       "50%",
            left:      "50%",
            width:     "100vw",
            height:    "56.25vw",
            minHeight: "100%",
            minWidth:  "177.78vh",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Light-mode overlay — frosted cream with subtle indigo wash */}
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(247,250,252,0.88) 0%, rgba(247,250,252,0.55) 35%, transparent 62%)",
            "linear-gradient(to top,    rgba(247,250,252,0.82) 0%, rgba(247,250,252,0.45) 35%, transparent 62%)",
            "linear-gradient(135deg,    rgba(238,242,255,0.68) 0%, rgba(248,250,252,0.52) 100%)",
          ].join(", "),
        }}
      />

      {/* Dark-mode overlay — cinematic vignette with deep indigo brand wash */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: [
            "linear-gradient(to bottom, rgba(2,6,23,0.78) 0%, transparent 38%)",
            "linear-gradient(to top,    rgba(2,6,23,0.78) 0%, transparent 38%)",
            "linear-gradient(135deg,    rgba(11,9,49,0.72) 0%, rgba(2,6,23,0.48) 100%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
