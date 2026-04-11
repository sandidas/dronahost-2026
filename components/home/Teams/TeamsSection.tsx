import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type TeamsSectionProps = {
	data: {
		trustSection: {
			rating: {
				label: string;
				value: number;
				platform: string;
				reviews: string;
			};
			title: {
				text: string;
				highlight: string;
			};
			logos: {
				name: string;
				src: string;
			}[];
		};
	};
};

export default function TeamsSection({ data }: TeamsSectionProps) {
	const { trustSection } = data;
	const titleParts = trustSection.title.text.split(trustSection.title.highlight);

	return (
		<Section size="xl" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="Trust logos section">
			<div className="mx-auto max-w-5xl text-center">
				<div className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
					<span className="font-semibold text-slate-800 dark:text-slate-100">{trustSection.rating.label}</span>
					<div className="flex items-center gap-1" aria-label={`${trustSection.rating.value} stars`}>
						{Array.from({ length: trustSection.rating.value }).map((_, idx) => (
							<span key={idx} className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-emerald-500 text-xs text-white">
								★
							</span>
						))}
					</div>
					<span>{trustSection.rating.reviews} on</span>
					<span className="font-semibold text-slate-800 dark:text-slate-100">{trustSection.rating.platform}</span>
				</div>

				<HeadLineText as="h2" align="center" fontSize="sixXl" fontWeight="bold" className="text-[#121b39] dark:text-slate-100">
					{titleParts[0]}
					<span className="text-orange-500">{trustSection.title.highlight}</span>
					{titleParts[1]}
				</HeadLineText>

				<div className="mt-10 grid grid-cols-2 gap-50 sm:grid-cols-3 lg:grid-cols-5">
					{trustSection.logos.map((logo, index) => (
						<div key={`${logo.name}-${index}`} className="flex items-center justify-center gap-3 text-slate-400 grayscale dark:text-slate-500">
							<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-current/20 text-xl">✦</span>
							<span className="text-4xl font-semibold">{logo.name}</span>
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}
