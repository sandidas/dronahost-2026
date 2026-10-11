"use client";

import { X } from "lucide-react";
import { Link } from "@/i18n/link";
import { useState, useSyncExternalStore } from "react";
import { ANNOUNCEMENTS_TEXT } from "@/content/portal-strings";

type AnnouncementBarProps = {
  /** Plain text. Rendered as a text node, never as HTML. */
  message?: string;
  link?: { label: string; href: string } | null;
  /** Dismissal key. Changes whenever the message is edited, so an edited notice shows again. */
  id?: string;
};

const subscribe = () => () => {};
const linkClass = "font-semibold text-link underline underline-offset-4 hover:text-accent-hover";

/**
 * Client part of the announcement bar (dismissal state). Use <AnnouncementBar /> instead.
 *
 * Dismissal is remembered per message id in localStorage; the bar is in the server HTML so it never
 * shifts layout for visitors who have not dismissed it.
 */
export default function AnnouncementBarClient({ message = "", link = null, id = "none" }: AnnouncementBarProps) {
  const [closed, setClosed] = useState(false);
  const dismissed = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(`dh-announcement-${id}`) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );

  if (!message || closed || dismissed) return null;
  const external = link ? /^https?:\/\//.test(link.href) : false;

  return (
    <div role="region" aria-label={ANNOUNCEMENTS_TEXT.region} className="border-b border-border bg-inverse-surface text-inverse-foreground">
      <div className="container-site flex min-h-11 items-center justify-center gap-3 py-2 text-center text-sm">
        <p>
          {message}
          {link && (
            <>
              {" "}
              {external ? (
                <a href={link.href} rel="noopener noreferrer" className={linkClass}>
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              )}
            </>
          )}
        </p>
        <button
          type="button"
          aria-label={ANNOUNCEMENTS_TEXT.dismiss}
          onClick={() => {
            try {
              localStorage.setItem(`dh-announcement-${id}`, "1");
            } catch {
              /* storage unavailable: dismiss for this view only */
            }
            setClosed(true);
          }}
          className="btn btn-ghost !min-h-11 size-11 shrink-0 !px-0"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
