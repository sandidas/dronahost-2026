import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { cn } from "@/utils/cn";

type BreadcrumbsProps = {
  /** URL path, e.g. "/hosting/uk". Labels come from lib/seo/breadcrumbs. */
  path: string;
  /** Label overrides by path segment, e.g. { "my-post": "My post title" }. */
  overrides?: Record<string, string>;
  className?: string;
};

/**
 * Visible breadcrumb trail. Uses the same source as the BreadcrumbList JSON-LD, so the two
 * never disagree. The current page is plain text with aria-current. Items truncate on phones.
 */
export default function Breadcrumbs({ path, overrides, className }: BreadcrumbsProps) {
  const items = buildBreadcrumbs(path, overrides).map((i) => ({ name: i.name, href: i.url.replace(SITE_URL, "") || "/" }));
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={cn("truncate font-medium text-foreground", "max-w-[14rem] sm:max-w-sm")}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="rounded underline-offset-4 hover:text-foreground hover:underline">
                    {item.name}
                  </Link>
                  <ChevronRight className="size-3.5 shrink-0 rtl:rotate-180" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
