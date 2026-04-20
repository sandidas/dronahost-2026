import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import Image from "next/image";
import Link from "next/link";

type ArticlesProps = {
	helpCategories: {
		id: number;
		icon: string;
		title: string;
		articles: string[];
		cta: {
			label: string;
			link: string;
		};
	}[];
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export default function Articles({ helpCategories }: ArticlesProps) {
	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="Support articles categories">
			<div className="grid grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-2 xl:grid-cols-3">
				{helpCategories.map((category, index) => (
					<Card variant="grid"
						key={category.id}
						index={index}
						total={helpCategories.length}
						columns={3}
						size="md"
						gridVariant="default"
							className=" border-primary bg-transparent"
					>
						<div className="mb-7 inline-flex h-15 w-15 items-center justify-center rounded-2xl bg-[#e8ebef]">
							<Image
								src={normalizePath(category.icon)}
								alt={category.title}
								width={55}
								height={55}
								
							/>
						</div>

						<HeadLineText as="h3" align="none" fontSize="xl" fontWeight="bold" className="text-primary">
							{category.title}
						</HeadLineText>

						<p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Top Articles</p>

						<ul className="mt-4 space-y-4 text-md leading-snug text-slate-700 dark:text-slate-200">
							{category.articles.map((article) => (
								<li key={article}>{article}</li>
							))}
						</ul>

						<Link
							href={category.cta.link}
							className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-primary text-xl font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-primary/90"
						>
							{category.cta.label}
						</Link>
					</Card>
				))}
			</div>
		</Section>
	);
}
