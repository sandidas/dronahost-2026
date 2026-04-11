import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type IncludedFeatureItem = {
	title: string;
	description: string;
};

type IncludedEveryPlanProps = {
	includedFeatures: {
		title: string;
		items: IncludedFeatureItem[];
	};
};

const iconByIndex = ["✧", "✉", "✧", "✉", "✧"];

export default function IncludedEveryPlan({ includedFeatures }: IncludedEveryPlanProps) {
	const items = includedFeatures.items;

	return (
		<Section size="lg" className="bg-white dark:bg-slate-950" aria-label="Included with every plan section">
			<div className="mx-auto max-w-7xl">
				<div className="flex items-center gap-6">
					<HeadLineText
						as="h2"
						align="left"
						fontSize="fourXl"
						fontWeight="bold"
						className="text-slate-900 dark:text-slate-100"
					>
						{includedFeatures.title}
					</HeadLineText>

					<div className="hidden h-px flex-1 bg-linear-to-r from-orange-300 to-transparent dark:from-orange-500/80 md:block" />
				</div>

				{/* Grid */}
				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
					{items.map((item, index) => (
						<GridCard
							key={item.title}
							index={index}
							total={items.length}
							columns={3}
							size="lg"
							separatorTone="soft"
							className="bg-transparent"
						>
							<h3 className="flex items-center gap-3 text-[28px] font-semibold text-slate-900 dark:text-slate-100">
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-2xl text-slate-800 dark:text-slate-300">
									{iconByIndex[index] ?? "•"}
								</span>
								{item.title}
							</h3>

							<p className="mt-3 text-lg leading-[1.6] text-slate-600 dark:text-slate-300">
								{item.description}
							</p>
						</GridCard>
					))}
				</div>
			</div>
		</Section>
	);
}