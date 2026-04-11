import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";

type SupportProps = {
	supportHighlight: {
		title: string;
		description: string;
		media: {
			imagePrimary: string;
		};
		stats: {
			id: number;
			icon: string;
			title: string;
			description: string;
		}[];
	};
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export default function Support({ supportHighlight }: SupportProps) {
	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="Support highlight section">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
				<div className="relative mx-auto w-full max-w-md lg:max-w-lg">
					<Image
						src={supportHighlight.media.imagePrimary}
						alt="Support team"
						width={620}
						height={640}
						className="h-auto w-full"
					/>
				</div>

				<div>
					<HeadLineText as="h2" align="none" fontSize="fiveXl" fontWeight="bold" className="text-slate-900 dark:text-slate-100 max-w-xl">
						{supportHighlight.title}
					</HeadLineText>

					<p className="mt-5 max-w-xl text-xl leading-relaxed text-slate-600 dark:text-slate-300">{supportHighlight.description}</p>

					<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
						{supportHighlight.stats.map((stat) => (
							<article key={stat.id} className="rounded-2xl border border-orange-300 bg-white p-5 dark:border-orange-400/70 dark:bg-slate-900">
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
									<Image
										src={normalizePath(stat.icon)}
										alt={stat.title}
										width={50}
										height={50}
										
									/>
								</div>
								<p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.title}</p>
								<p className="mt-2 text-md leading-relaxed text-slate-600 dark:text-slate-300">{stat.description}</p>
							</article>
						))}
					</div>
				</div>
			</div>
		</Section>
	);
}
