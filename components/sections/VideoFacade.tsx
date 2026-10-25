"use client";

import { Play } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";

type VideoFacadeProps = {
  youtubeId: string;
  title: string;
  playLabel: string;
  poster?: { src: string; alt: string };
};

/**
 * Click-to-load player. Before play it is a button with a local still (or a drawn panel): no request reaches YouTube, no
 * third-party cookie is set and the video costs nothing on LCP. On play it swaps in the privacy-enhanced embed.
 */
export default function VideoFacade({ youtubeId, title, playLabel, poster }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&cc_load_policy=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={playLabel} className="group absolute inset-0 flex size-full items-center justify-center bg-[radial-gradient(closest-side_at_30%_30%,var(--glow-teal),transparent),radial-gradient(closest-side_at_75%_75%,var(--glow-orange),transparent)] bg-muted focus-visible:outline-2 focus-visible:outline-offset-2">
      {poster && <NextImage src={poster.src} alt={poster.alt} fill sizes="(min-width: 1024px) 60rem, 100vw" className="object-cover" />}
      <span aria-hidden="true" className="relative grid size-20 place-items-center rounded-full bg-action text-action-foreground shadow-xl transition-transform group-hover:scale-105 motion-reduce:transition-none">
        <Play className="ms-1 size-8" strokeWidth={2} fill="currentColor" />
      </span>
    </button>
  );
}
