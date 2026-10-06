import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/link";
import { cn } from "@/utils/cn";

type PaginationProps = { page: number; totalPages: number; basePath: string; params?: Record<string, string | undefined> };

/** Previous / next with numbered pages. Plain links with ?page=, so every page is crawlable. */
export default function Pagination({ page, totalPages, basePath, params = {} }: PaginationProps) {
  if (totalPages <= 1) return null;
  const href = (n: number) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    if (n > 1) q.set("page", String(n));
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1);
  const link = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border-strong px-3 text-sm font-semibold";

  return (
    <nav aria-label="Pagination" className="mt-12">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className={cn(link, "gap-1 text-foreground")}>
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              Previous
            </Link>
          ) : null}
        </li>
        {pages.map((n, i) => (
          <li key={n} className="flex items-center gap-2">
            {i > 0 && n - pages[i - 1]! > 1 && <span aria-hidden="true">…</span>}
            <Link href={href(n)} aria-label={`Page ${n}`} aria-current={n === page ? "page" : undefined} className={cn(link, n === page ? "border-accent/50 bg-accent/15 text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {n}
            </Link>
          </li>
        ))}
        <li>
          {page < totalPages ? (
            <Link href={href(page + 1)} rel="next" className={cn(link, "gap-1 text-foreground")}>
              Next
              <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}
