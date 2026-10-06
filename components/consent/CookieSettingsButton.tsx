"use client";

import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

/** Footer link that reopens the cookie preferences dialog. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}
