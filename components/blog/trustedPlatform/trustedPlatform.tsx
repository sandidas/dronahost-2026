import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type TrustedPlatformProps = {
	intro: {
		tagline: string;
		title: string;
	};
	features: {
		id: number;
		icon: string;
		title: string;
		description: string;
		cta: {
			label: string;
			link: string;
		};
	}[];
};

const iconWrapByPath: Record<string, string> = {
	"/images/blog/wordpress.svg": "bg-[#0f2f63]",
	"/images/blog/headless.svg": "bg-[#bcd7f8]",
	"/images/blog/security.svg": "bg-[#f7d8cb]",
	"/images/blog/cdn.svg": "bg-[#c8d8ff]",
};

export default function TrustedPlatform({ intro, features }: TrustedPlatformProps) {
	return (
		<Section size="lg" padding="md" className="bg-white dark:bg-slate-950" aria-label="Trusted hosting platform section">
            <HeadLineText as="p" align="left" fontSize="md" fontWeight="light" className=" text-slate-600 ">
                {intro.tagline}
            </HeadLineText>
			

			<HeadLineText
				as="h2"
				align="none"
				fontSize="fiveXl"
				fontWeight="bold"
				className="mt-3 max-w-xl leading-[1.05]! text-black dark:text-slate-100"
			>
				{intro.title}
			</HeadLineText>

			<div className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-2 xl:grid-cols-4">
				{features.map((feature, index) => {
					const iconWrap = iconWrapByPath[feature.icon] ?? "bg-[#e2e8f0]";

					return (
						<GridCard
							key={feature.id}
							index={index}
							total={features.length}
							columns={4}
							size="md"
							variant="ghost"
							separatorTone="soft"
							className="min-h-70 rounded-none bg-white dark:bg-slate-900"
						>
							<div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${iconWrap}`}>
								<Image
									src={feature.icon}
									alt={feature.title}
									width={50}
									height={50}
									className=""
								/>
							</div>
                            
							<HeadLineText as="p" fontSize="twoXl" fontWeight="bold" align="left" className="text-slate-800 dark:text-slate-100">
								{feature.title}
							</HeadLineText>

							<p className="mt-3 max-w-xs text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{feature.description}
							</p>

							<Link href={feature.cta.link} className="mt-6 inline-flex items-center gap-3 text-lg font-semibold text-primary transition hover:text-primary">
								{feature.cta.label}
								<span>→</span>
							</Link>
						</GridCard>
					);
				})}
			</div>
		</Section>
	);
}
