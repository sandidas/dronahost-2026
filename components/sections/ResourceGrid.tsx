import { useId } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";

type ResourcePost = {
  category?: string;
  title: string;
  description?: string;
  readTime?: string;
  button?: string;
  image?: string;
  href?: string;
  publishedAt?: string;
};

type ResourceGridProps = {
  /** Heading level of the section title so each page keeps exactly one H1. Default "h2". */
  headingLevel?: "h2" | "h3";
  tagline?: string;
  title?: string;
  posts: ResourcePost[];
  columns?: 2 | 3;
  featured?: boolean;
  className?: string;
};

const colClass: Record<2 | 3, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function ResourceGrid({
  tagline,
  title,
  posts,
  columns = 3,
  featured = false,
  className,
  headingLevel = "h2",
}: ResourceGridProps) {
  const headingId = useId();
  const childLevel = headingLevel === "h2" ? "h3" : "h4";
  const [firstPost, ...restPosts] = posts;

  return (
    <Section aria-labelledby={headingId} size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title) && (
        <div className="mb-12 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as={headingLevel}
            id={headingId} fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
        </div>
      )}

      {/* Featured first post */}
      {featured && firstPost && (
        <div className="mb-12">
          <Card
            variant="resource"
            post={{
              category: firstPost.category,
              title: firstPost.title,
              description: firstPost.description,
              readTime: firstPost.readTime,
              button: firstPost.button ?? "Read article",
              image: firstPost.image,
              href: firstPost.href,
            }}
            showCategory={true}
            showDescription={true}
            showCTA={true}
            imageClassName="h-72"
          />
        </div>
      )}

      {/* Grid */}
      <div className={cn("grid gap-8", colClass[columns])}>
        {(featured ? restPosts : posts).map((post, index) => (
          <Card
            key={index}
            variant="resource"
            post={{
              category: post.category,
              title: post.title,
              description: post.description,
              readTime: post.readTime,
              button: post.button ?? "Read article",
              image: post.image,
              href: post.href,
            }}
            showCategory={true}
            showDescription={true}
            showCTA={true}
          />
        ))}
      </div>
    </Section>
  );
}
