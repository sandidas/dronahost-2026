import { ANNOUNCEMENT } from "@/content/announcement";
import AnnouncementBarClient from "./AnnouncementBarClient";

type AnnouncementBarProps = {
  /** Override the content registry (showcase only). */
  message?: string;
  link?: { label: string; href: string } | null;
  id?: string;
  /** Showcase only: render even when the registry is disabled. */
  forceEnabled?: boolean;
};

/**
 * Site-wide notice above the header. A server component: while the notice is disabled in
 * content/announcement.ts it renders nothing and ships no client JavaScript.
 */
export default function AnnouncementBar({ forceEnabled = false, ...props }: AnnouncementBarProps) {
  if (!ANNOUNCEMENT.enabled && !forceEnabled) return null;
  return <AnnouncementBarClient {...props} forceEnabled={forceEnabled} />;
}
