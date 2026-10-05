/**
 * Announcement bar content.
 *
 * Disabled by default: no promotion, outage notice or offer is live, and nothing
 * should be invented. Set `enabled: true` and fill `message` for a genuine notice.
 * Bump `id` for each new message so a previous dismissal does not hide it.
 */
export const ANNOUNCEMENT = {
  enabled: false,
  id: "none",
  message: "",
  link: null as { label: string; href: string } | null,
};
