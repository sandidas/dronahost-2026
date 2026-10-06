"use client";

import { useTranslations } from "next-intl";
import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

/** Footer link that reopens the cookie preferences dialog. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("consent");
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      {t("settings")}
    </button>
  );
}
