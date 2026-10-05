"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ANNOUNCEMENT } from "@/content/announcement";

type AnnouncementBarProps = {
  /** Override the content registry (showcase only). */
  message?: string;
  link?: { label: string; href: string } | null;
  id?: string;
  /** Showcase only: render even when the registry is disabled. */
  forceEnabled?: boolean;
};

const subscribe = () => () => {};

/**
 * Client part of the announcement bar (dismissal state). Use <AnnouncementBar /> instead.
 *
 * Site-wide notice above the header. Renders nothing unless enabled in
 * content/announcement.ts, so no unverified offer can appear. Dismissal is remembered
 * per message id in localStorage; the bar is in the server HTML so it never shifts layout
 * for visitors who have not dismissed it.
 */
export default function AnnouncementBarClient({
  message = ANNOUNCEMENT.message,
  link = ANNOUNCEMENT.link,
  id = ANNOUNCEMENT.id,
  forceEnabled = false,
}: AnnouncementBarProps) {
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

  if ((!ANNOUNCEMENT.enabled && !forceEnabled) || !message || closed || dismissed) return null;

  return (
    <div role="region" aria-label="Announcement" className="border-b border-border bg-inverse-surface text-inverse-foreground">
      <div className="container-site flex min-h-11 items-center justify-center gap-3 py-2 text-center text-sm">
        <p>
          {message}
          {link && (
            <>
              {" "}
              <Link href={link.href} className="font-semibold text-link underline underline-offset-4 hover:text-accent-hover">
                {link.label}
              </Link>
            </>
          )}
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
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
