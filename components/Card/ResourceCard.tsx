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
}

const ResourceCard = ({
  post,
  className,
  imageClassName,
  contentClassName,
  showCategory = false,
}: ResourceCardProps) => {
  return (
    <article className={cn("w-full", className)}>
      
      {/* Image */}
      <div
        className={cn(
          "relative h-[200px] mb-6 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800",
          imageClassName
        )}
      >
        <img
          src={post.image}
          alt={post.title}
          className="max-h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className={cn(contentClassName)}>
        <HeadLineText
          as="h3"
          fontSize="twoXl"
          fontWeight="bold"
          align="none"
          className="text-left"
        >
          {post.title}
        </HeadLineText>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {post.description}
        </p>

        {/* CTA */}
        <Link
          href={post.href ?? "#"}
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:gap-2 transition-all"
        >
          {post.button}
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
};

export default ResourceCard;