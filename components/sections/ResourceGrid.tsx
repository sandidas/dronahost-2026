import Link from "next/link";
import { useId } from "react";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

export type ResourcePost = {
  title: string;
  description?: string;
  href: string;
  category?: string;
  /** e.g. "6 min read". */
  readTime?: string;
  /** ISO date (YYYY-MM-DD), shown as "15 January 2026". */
  date?: string;
};

type ResourceGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** 1 to 12 posts. */
  posts: readonly ResourcePost[];
  columns?: 2 | 3;
  headingLevel?: "h2" | "h3";
  className?: string;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/**
 * Blog / resource cards. Each card is an <article> whose title is the (crawlable) link.
 * No image is required: a typographic header keeps cards consistent and avoids broken
 * image boxes when a post has no artwork.
 */
export default function ResourceGrid({ eyebrow, title, description, posts, columns = 3, headingLevel = "h2", className }: ResourceGridProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <ul className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", title && "mt-12 sm:mt-14")}>
          {posts.map((post) => (
            <li key={post.href} className="flex">
              <article className="surface surface-interactive relative flex w-full flex-col overflow-hidden">
                <div aria-hidden="true" className="relative flex h-28 items-end border-b border-border bg-muted/60 p-5">
                  <div className="bg-grid absolute inset-0 opacity-60" />
                  {post.category && (
                    <span className="relative rounded-full border border-accent/30 bg-accent/12 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-link">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Item className="t-h4 text-foreground">
                    <Link href={post.href} className="after:absolute after:inset-0 after:content-[''] hover:underline">
                      {post.title}
                    </Link>
                  </Item>
                  {post.description && <p className="t-small mt-2 flex-1 text-muted-foreground">{post.description}</p>}
                  {(post.date || post.readTime) && (
                    <p className="mt-4 text-xs text-subtle-foreground">
                      {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
                      {post.date && post.readTime && " · "}
                      {post.readTime}
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
