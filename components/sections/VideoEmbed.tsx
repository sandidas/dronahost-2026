import { Captions } from "lucide-react";
import { useId } from "react";
import { UI } from "@/content/strings";
import { Link } from "@/i18n/link";
import { SITE_URL } from "@/lib/seo/config";
import { reveal } from "@/lib/motion";
import JsonLd from "./JsonLd";
import SectionHeader from "./SectionHeader";
import VideoFacade from "./VideoFacade";

export type VideoEmbedVideo = {
  youtubeId: string;
  title: string;
  summary: string;
  uploadDate: string;
  duration: string;
  credit?: string;
  poster?: { src: string; alt: string };
  transcriptHref?: string;
};

type VideoEmbedProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  video: VideoEmbedVideo;
  headingLevel?: "h2" | "h3";
};

/**
 * One real video with captions (content rules section 7, CP3), loaded on click from youtube-nocookie.com. Server-rendered
 * heading, credit, privacy line and VideoObject JSON-LD; only the player is a client component (VideoFacade).
 */
export default function VideoEmbed({ eyebrow, title, description, video, headingLevel = "h2" }: VideoEmbedProps) {
  const headingId = useId();
  const t = UI.video;
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.summary,
    uploadDate: video.uploadDate,
    duration: video.duration,
    thumbnailUrl: video.poster ? `${SITE_URL}${video.poster.src}` : `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
  };
  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="center" />
        <figure {...reveal()} className="mx-auto mt-10 max-w-4xl">
          <div className="surface relative aspect-video overflow-hidden !rounded-[1.75rem] shadow-xl">
            <VideoFacade youtubeId={video.youtubeId} title={video.title} playLabel={t.play(video.title)} poster={video.poster} />
          </div>
          <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{video.title}</span>
            <span className="inline-flex items-center gap-1">
              <Captions aria-hidden="true" className="size-4 text-link" strokeWidth={1.8} />
              {t.captions}
            </span>
            {video.credit && <span>{t.credit(video.credit)}</span>}
            {video.transcriptHref && (
              <Link href={video.transcriptHref} className="text-link underline underline-offset-4">
                {t.transcript}
              </Link>
            )}
            <span className="basis-full text-center text-subtle-foreground">{t.privacy}</span>
          </figcaption>
        </figure>
      </div>
      <JsonLd schema={schema} />
    </section>
  );
}
