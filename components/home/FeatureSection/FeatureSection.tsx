import ResourceCard, { type ResourcePost } from "@/components/Card/ResourceCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type FeatureCardItem = {
	id: number;
	title: string;
	description: string;
	image?: string;
	cta: {
		label: string;
		link: string;
	};
};

type FeatureSectionData = {
	tagline: string;
	title: string;
	features: FeatureCardItem[];
};

type FeatureSectionProps = {
	data: FeatureSectionData;
};

export default function FeatureSection({ data }: FeatureSectionProps) {
	const featurePreviewImages = [
		"/images/home/BoxyLayout1.svg",
		"/images/home/BoxyLayout2.svg",
		"/images/home/BoxyLayout3.svg",
	] as const;

	const previewCards: ResourcePost[] = data.features.slice(0, 3).map((feature, index) => ({
		category: "FEATURE",
		title: feature.title,
		description: feature.description,
		readTime: `${index + 4} min read`,
		button: feature.cta.label,
		image: feature.image ?? featurePreviewImages[index] ?? "/images/home/Background.svg",
		href: feature.cta.link,
	}));

	return (
		<Section
			id="features"
			size="xl"
			padding="xl"
			containerClassName="flex flex-col gap-16"
		>
			{/* Header */}
			<div className="flex flex-col items-center gap-4 text-center">
				<HeadLineText
					as="p"
					fontSize="sm"
					fontWeight="bold"
					fontColor="primary"
				>
					{data.tagline}
				</HeadLineText>

				<HeadLineText
					as="h2"
					fontSize="fiveXl"
					fontWeight="bold"
				>
					{data.title}
				</HeadLineText>
			</div>

			{/* Grid */}
			<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
				{previewCards.map((feature, index) => (
					<ResourceCard
						key={`${feature.title}-${index}`}
						post={feature}
						showCategory={false}
					/>
				))}
			</div>
		</Section>
	);
}