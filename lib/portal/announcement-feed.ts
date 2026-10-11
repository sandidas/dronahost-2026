import { unstable_cache } from "next/cache";
import { findActiveAnnouncements, type PublicAnnouncement } from "./announcements";
import { logError } from "./result";

export const ANNOUNCEMENTS_TAG = "announcements";

/**
 * Active announcements for the banner, cached for a minute (so start and end times apply within a minute)
 * and refreshed at once when an admin saves a change. A database outage hides the banner, never the page.
 */
export const getBannerAnnouncements = unstable_cache(
  async (): Promise<PublicAnnouncement[]> => {
    if (!process.env.MONGODB_URI) return [];
    try {
      return await findActiveAnnouncements();
    } catch (err) {
      logError("announcements.feed_failed", err);
      return [];
    }
  },
  ["announcements:active"],
  { tags: [ANNOUNCEMENTS_TAG], revalidate: 60 },
);
