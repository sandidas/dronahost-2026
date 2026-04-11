import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type FeatureInsightProps = {
	featuredInsight: {
		tag: string;
		title: string;
		description: string;
		image: string;
		author: string;
		authorImage?: string;
		lead?: string;
		date: string;
		readTime: string;
	};
	trending: {
		title: string;
		posts: {
			id: number;
			tag: string;
			title: string;
			link: string;
			readTime: string;
		}[];
	};
	newsletter: {
		title: string;
		description: string;
		cta: {
			label: string;
			link: string;
		};
	};
};

export default function FeatureInsight({ featuredInsight, trending, newsletter }: FeatureInsightProps) {

	return (
		<Section
			size="lg"
            height="screen"
			padding="md"
			className="bg-[#f3f4f6] dark:bg-slate-950"
			aria-label="Featured insight and trending section"
		>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
				<div>
					<div className="mb-5 flex items-center justify-between">
						<HeadLineText as="h2" align="none" fontSize="threeXl" fontWeight="bold" className="text-slate-900 dark:text-slate-100">
							{featuredInsight.tag} 
						</HeadLineText>
						<Link href="/blog" className="text-xs font-semibold uppercase tracking-[0.2em] text-primary hover:text-primary">
							View All
						</Link>
					</div>

					<article className="rounded-3xl bg-transparent p-4 shadow-none">
						<div className="relative mb-5 overflow-hidden rounded-2xl">
							<Image
								src={featuredInsight.image}
								alt={featuredInsight.title}
								width={1200}
								height={650}
								className="h-auto w-full"
							/>

							<span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
								{featuredInsight.tag}
							</span>
						</div>

						<div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
							<span>{featuredInsight.date}</span>
							<span className="text-slate-300 dark:text-slate-600">•</span>
							<span>{featuredInsight.readTime}</span>
						</div>

						<HeadLineText as="h3" align="none" fontSize="fiveXl" fontWeight="bold" className="text-slate-900 dark:text-slate-100">
							{featuredInsight.title}
						</HeadLineText>

						<p className="mt-4 max-w-4xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
							{featuredInsight.description}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<Image
								src={featuredInsight.authorImage ?? "/images/blog/client.svg"}
								alt={featuredInsight.author}
								width={40}
								height={40}
								className="h-10 w-10 rounded-full object-cover"
							/>
							<p className="text-sm text-slate-600 dark:text-slate-300">
								<span className="font-semibold text-slate-800 dark:text-slate-100">{featuredInsight.author}</span>
								<span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
								<span>{featuredInsight.lead ?? "Lead DevOps Architect"}</span>
							</p>
						</div>
					</article>
				</div>

				<aside className="rounded-3xl bg-transparent p-5 dark:bg-slate-900/70">
					<HeadLineText as="h3" align="none" fontSize="twoXl" fontWeight="bold" className="text-slate-900 dark:text-slate-100">
						{trending.title}
					</HeadLineText>

					<div className="mt-6 space-y-6">
						{trending.posts.map((post, index) => (
							<Link key={post.id} href={post.link} className="group flex gap-3">
								<span className="text-4xl font-semibold leading-none text-slate-300 dark:text-slate-700">
									{String(index + 1).padStart(2, "0")}
								</span>

								<div>
									<p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-blue-500">{post.tag}</p>
									<p className="mt-1 text-2xl font-semibold leading-snug text-slate-800 transition group-hover:text-orange-500 dark:text-slate-100">
										{post.title}
									</p>
									<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.readTime}</p>
								</div>
							</Link>
						))}
					</div>

					<div className="mt-8 rounded-2xl bg-primary p-5 text-white">
						<p className="text-4xl font-semibold leading-none">{newsletter.title}</p>
						<p className="mt-3 text-sm leading-relaxed text-primary-light">{newsletter.description}</p>
						<Link
							href={newsletter.cta.link}
							className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
						>
							{newsletter.cta.label}
						</Link>
					</div>
				</aside>
			</div>
		</Section>
	);
}
