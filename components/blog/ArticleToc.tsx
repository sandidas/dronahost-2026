import type { TocItem } from "@/lib/blog/types";
import { cn } from "@/utils/cn";

/** Table of contents built on the server from the article's h2 and h3 headings. Hidden when there are fewer than three. */
export default function ArticleToc({ items }: { items: readonly TocItem[] }) {
  if (items.length < 3) return null;
  return (
    <nav aria-label="Table of contents" className="surface p-5">
      <p className="t-eyebrow">In this article</p>
      <ol className="mt-3 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i.id} className={cn(i.level === 3 && "ps-4")}>
            <a href={`#${i.id}`} className="block rounded py-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
