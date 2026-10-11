"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";

export type NavItem = { href: string; label: string; exact?: boolean; secondary?: boolean };

/** Portal tabs. The current section is marked with aria-current. */
export function PortalNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="-mb-px flex gap-1 overflow-x-auto">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-sm font-semibold transition-colors",
              active ? "border-action text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              item.secondary && "ms-auto",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
