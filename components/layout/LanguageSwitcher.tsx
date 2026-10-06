"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/link";
import { usePathname } from "@/i18n/navigation";
import { LIVE_LOCALES, LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/utils/cn";

/**
 * Explicit language and region links (no automatic redirect). Each is a crawlable link to the same
 * page in another locale. Renders nothing until more than one locale is live.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const current = useLocale() as Locale;
  const pathname = usePathname();
  if (LIVE_LOCALES.length < 2) return null;

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex flex-wrap items-center gap-2">
        {LIVE_LOCALES.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              hrefLang={LOCALES[locale].tag}
              lang={LOCALES[locale].tag}
              aria-current={locale === current ? "true" : undefined}
              title={LOCALES[locale].label}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold transition-colors",
                locale === current ? "border-accent/50 bg-accent/15 text-foreground" : "border-border-strong text-muted-foreground hover:text-foreground",
              )}
            >
              {LOCALES[locale].short}
              <span className="sr-only"> {LOCALES[locale].label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
