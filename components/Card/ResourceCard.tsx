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
	index?: number;
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
	showCategory = true,
}: ResourceCardProps) => {
	return (
		<article className={cn("group w-full", className)}>
			<div className={cn("relative h-[220px] overflow-hidden rounded-xl", imageClassName)}>
				<div
					className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
					style={{ backgroundImage: `url('${post.image}')` }}
				/>

				{showCategory ? (
					<p className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
						{post.category}
					</p>
				) : null}
			</div>

			<div className={cn("mt-5", contentClassName)}>
				<HeadLineText
					as="h3"
					fontSize="xl"
					fontWeight="bold"
					align="none"
					className="text-left transition group-hover:text-primary"
				>
					{post.title}
				</HeadLineText>

				<p className="mt-2 line-clamp-3 text-left text-sm text-muted-foreground">{post.description}</p>

				<div className="mt-4 flex items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">{post.readTime}</p>

					<Link href={post.href ?? "#"} className="group/link">
						<span className="flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover/link:gap-2">
							{post.button}
							<span className="transition group-hover/link:translate-x-1" aria-hidden="true">
								→
							</span>
						</span>
					</Link>
				</div>
			</div>
		</article>
	);
};

export default ResourceCard;
