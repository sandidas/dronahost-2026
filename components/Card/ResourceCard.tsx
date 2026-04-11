import HeadLineText from "@/components/HeadLineText/HeadLineText";
import { cn } from "@/utils/cn";
import Link from "next/link";

export interface ResourcePost {
  category: string;
  title: string;
  description: string;
  readTime: string;
  button: string;
  image: string;
  href?: string;
}

export interface ResourceCardProps {
  post: ResourcePost;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  showCategory?: boolean;
  showDescription?: boolean;
  showCTA?: boolean;
}

const ResourceCard = ({
  post,
  className,
  imageClassName,
  contentClassName,
  showCategory = false,
  showDescription = true,
  showCTA = true,
}: ResourceCardProps) => {
  return (
    <article className={cn("w-full", className)}>
      
      {/* Image */}
      <div
        className={cn(
          "relative h-50 mb-6 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800",
          imageClassName
        )}
      >
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className={cn(contentClassName)}>
        {showCategory && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
              {post.category}
            </span>
            <span className="text-xs font-medium text-orange-500 dark:text-orange-300">{post.readTime}</span>
          </div>
        )}

        <HeadLineText
          as="h3"
          fontSize="twoXl"
          fontWeight="bold"
          align="none"
          className="text-left"
        >
          {post.title}
        </HeadLineText>

        {showDescription && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {post.description}
          </p>
        )}

        {/* CTA */}
        {showCTA && (
          <Link
            href={post.href ?? "#"}
            className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:gap-2 transition-all"
          >
            {post.button}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}
      </div>
    </article>
  );
};

export default ResourceCard;