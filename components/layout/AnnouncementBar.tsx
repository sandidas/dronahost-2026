import { ANNOUNCEMENTS_TEXT } from "@/content/portal-strings";
import { ANNOUNCEMENT } from "@/content/announcement";
import { getBannerAnnouncements } from "@/lib/portal/announcement-feed";
import AnnouncementBarClient from "./AnnouncementBarClient";

type AnnouncementBarProps = {
  /** Override the content registry (showcase only). */
  message?: string;
  link?: { label: string; href: string } | null;
  id?: string;
  /** Showcase only: render the given message even when nothing is active. */
  forceEnabled?: boolean;
};

/**
 * Site-wide notices above the header, on the public site and in both portals. A server component: the
 * active announcements an admin set in /dashboard/announcements (plus content/announcement.ts when it is
 * enabled) render in the server HTML; with none active it renders nothing and ships no client JavaScript.
 */
export default async function AnnouncementBar({ forceEnabled = false, ...props }: AnnouncementBarProps) {
  if (forceEnabled) return <AnnouncementBarClient {...props} />;

  type Item = { id: string; message: string; link: { label: string; href: string } | null };
  const items: Item[] = (await getBannerAnnouncements()).map((a) => ({
    id: `${a.id}-${a.version}`,
    message: a.message,
    link: a.linkUrl ? { label: ANNOUNCEMENTS_TEXT.linkLabel, href: a.linkUrl } : null,
  }));
  if (ANNOUNCEMENT.enabled && ANNOUNCEMENT.message) items.push({ id: ANNOUNCEMENT.id, message: ANNOUNCEMENT.message, link: ANNOUNCEMENT.link });
  if (items.length === 0) return null;

  return (
    <>
      {items.map((item) => (
        <AnnouncementBarClient key={item.id} {...item} />
      ))}
    </>
  );
}
