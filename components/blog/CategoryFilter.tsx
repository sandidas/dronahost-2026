import { Link } from "@/i18n/link";
import type { BlogCategory } from "@/lib/blog/types";
import { cn } from "@/utils/cn";

/** Category links as real URLs (?category=slug): crawlable, no JavaScript, current one marked with aria-current. */
export default function CategoryFilter({ categories, active }: { categories: readonly BlogCategory[]; active?: string }) {
  if (categories.length === 0) return null;
  const items = [{ name: "All", slug: "", count: 0 }, ...categories];
  return (
    <nav aria-label="Filter articles by category" className="mt-10">
      <ul className="flex flex-wrap justify-center gap-2">
        {items.map((c) => {
          const current = (active ?? "") === c.slug;
          return (
            <li key={c.slug || "all"}>
              <Link
                href={c.slug ? `/blog?category=${c.slug}` : "/blog"}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors",
                  current ? "border-accent/50 bg-accent/15 text-foreground" : "border-border-strong text-muted-foreground hover:text-foreground",
                )}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
