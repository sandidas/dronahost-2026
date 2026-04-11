import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type DevelopmentHubProps = {
	developmentHub: {
		title: string;
		cta: {
			label: string;
			link: string;
		};
		topics: {
			id: number;
			category: string;
			title: string;
			description: string;
			image: string;
			link: string;
		}[];
		featuredGuide: {
			tag: string;
			title: string;
			description: string;
			image: string;
			cta: {
				label: string;
				link: string;
			};
		};
	};
};

export default function DevelopmentHub({ developmentHub }: DevelopmentHubProps) {
	return (
		<Section size="lg" padding="md" className="bg-white dark:bg-slate-950" aria-label="Development hub section">
			<div className="mb-7 flex items-center justify-between">
				<HeadLineText as="h2" align="none" fontSize="fiveXl" fontWeight="bold" className="text-[#0b2450] dark:text-slate-100">
					{developmentHub.title}
				</HeadLineText>

				<Link href={developmentHub.cta.link} className="text-sm font-semibold text-orange-500 transition hover:text-orange-600">
					{developmentHub.cta.label} <span className="ml-2">→</span>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
				<div className="space-y-4">
					{developmentHub.topics.map((topic) => (
						<Link key={topic.id} href={topic.link} className="block rounded-2xl bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:bg-slate-900">
							<article className="flex items-start gap-4">
								<div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-xl">
									<Image src={topic.image} alt={topic.title} fill sizes="88px" className="object-cover" />
								</div>

								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b06a48]">{topic.category}</p>
									<p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{topic.title}</p>
									<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{topic.description}</p>
								</div>
							</article>
						</Link>
					))}
				</div>

				<article className="relative overflow-hidden rounded-3xl">
					<Image
						src={developmentHub.featuredGuide.image}
						alt={developmentHub.featuredGuide.title}
						fill
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover"
					/>
					  <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/35 to-transparent" />

					<div className="relative z-1 flex h-full flex-col justify-end p-6 sm:p-8">
						<span className="mb-4 inline-flex w-fit rounded-lg bg-orange-700/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-50">
							{developmentHub.featuredGuide.tag}
						</span>

						<HeadLineText as="h3" align="none" fontSize="fiveXl" fontWeight="bold" className="text-white">
							{developmentHub.featuredGuide.title}
						</HeadLineText>

						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{developmentHub.featuredGuide.description}</p>

						<Link
							href={developmentHub.featuredGuide.cta.link}
							className="mt-6 inline-flex w-fit items-center gap-3 rounded-xl bg-orange-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-500"
						>
							{developmentHub.featuredGuide.cta.label}
							<span>→</span>
						</Link>
					</div>
				</article>
			</div>
		</Section>
	);
}
