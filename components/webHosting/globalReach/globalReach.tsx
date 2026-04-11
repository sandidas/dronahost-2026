import HeadLineText from "@/components/HeadLineText/HeadLineText";
import GradientBackground from "@/components/gradient/gradient";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type GlobalReachProps = {
	globalReach: {
		tag: string;
		title: string;
		description: string;
		cta: {
			label: string;
			link: string;
		};
		image: {
			src: string;
			alt: string;
		};
	};
};

export default function GlobalReach({ globalReach }: GlobalReachProps) {
	return (
		<Section size="full" padding="none">
			<GradientBackground
				gradient="custom"
				customGradient="from-[#ce8642] via-[#c59b75] to-[#b4b7b2] dark:from-[#0a1230] dark:via-[#1b2347] dark:to-[#2b1f24]"
				variant="none"
				className="w-full"
				minHeight="580px"
			>
				<div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#ff8a2b]/24 via-transparent to-transparent dark:from-[#ff8a2b]/14" />

				<div className="relative z-2 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-2 md:px-10 lg:px-12">
					<div className="max-w-xl text-white">
						<span className="inline-flex items-center gap-3 bg-white/14 px-4 py-2 text-[15px] font-semibold tracking-wide text-white dark:bg-white/8">
							<span aria-hidden="true">🇮🇳</span>
							{globalReach.tag}
						</span>

						<HeadLineText
							as="h2"
							align="left"
							fontSize="fiveXl"
							fontWeight="bold"
							className="mt-4 text-white"
						>
							{globalReach.title}
						</HeadLineText>

						<p className="mt-5 text-[17px] leading-9 text-white/92">{globalReach.description}</p>

						<Link
							href={globalReach.cta.link}
							className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-[18px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.6)] dark:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.85)]"
						>
							{globalReach.cta.label}
						</Link>
					</div>

					<div className="relative hidden min-h-105 md:block">
						<Image
							src={globalReach.image.src}
							alt={globalReach.image.alt}
							width={740}
							height={740}
							className="absolute -right-52 top-1/2 h-auto w-[min(760px,58vw)] -translate-y-1/2"
							priority
						/>
					</div>
				</div>
			</GradientBackground>
		</Section>
	);
}
