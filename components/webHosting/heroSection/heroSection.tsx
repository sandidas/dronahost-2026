import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
type HeroCategory = {
	label: string;
	active?: boolean;
};

type HeroFilter = {
	label: string;
	type: string;
	options: string[];
};

type WebHostingHeroSectionProps = {
	heroData: {
		title: string;
		subtitle: string;
		categories: HeroCategory[];
		filters: HeroFilter[];
	};
};

export default function WebHostingHeroSection({ heroData }: WebHostingHeroSectionProps) {
	return (
	<GradientBackground
        gradient="custom"
        customGradient="from-slate-100 via-slate-200 to-slate-300 dark:from-[#0a0d14] dark:via-[#171a24] dark:to-[#2a2342]"
        gradientAngle={112}
        variant="none"
        shape="none"
        grid="none"
        noise="subtle"
        blobs={[
          { color: "blue", size: "lg", effect: "float", position: "top-left", opacity: 12, blur: "xl" },
          { color: "orange", size: "lg", effect: "drift", position: "top-right", opacity: 30, blur: "xl" },
        ]}
        glowSpots={[
          { color: "#1d4ed8", position: "top-left", size: "xl", opacity: 8 },
          { color: "#312e81", position: "bottom-right", size: "lg", opacity: 10 },
        ]}
		>
		<Section
			height="screen"
			hAlign="center"
			className="text-slate-900 dark:text-slate-100"
		>

			<div className="relative z-2 mx-auto flex w-full max-w-4xl flex-col items-center">
				<HeadLineText
					as="h1"
					align="center"
					fontSize="sixXl"
					fontWeight="bold"
					className="text-slate-900 dark:text-slate-100"
				>
					{heroData.title}
				</HeadLineText>

				<p className="mt-3 text-center text-[18px] text-slate-600 dark:text-slate-300">
					{heroData.subtitle}
				</p>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					{heroData.categories.map((category) => (
						<button
							key={category.label}
							type="button"
							className={
								category.active
									? "rounded-full bg-primary px-6 py-3 text-[16px] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(251,146,60,0.8)]"
									: "rounded-full border border-slate-300 bg-white px-6 py-3 text-[16px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-200"
							}
						>
							{category.label}
						</button>
					))}
				</div>

				<div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
					{heroData.filters.map((filter) => (
						<label
							key={filter.label}
							className="flex flex-col gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-300"
						>
							{filter.label}
							<select
								defaultValue=""
								className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-[14px] text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
							>
								<option value="" disabled>
									Select
								</option>
								{filter.options.map((option) => (
									<option key={option} value={option.toLowerCase().replace(/\s+/g, "-")}>
										{option}
									</option>
								))}
							</select>
						</label>
					))}
				</div>
			</div>
		</Section>
        </GradientBackground>
	);
}
