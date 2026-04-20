import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import Link from "next/link";
type CtaBanner = {
	tagline: string;
	title: string;
	description: string;
	inputPlaceholder: string;
	button: {
		label: string;
		link: string;
	};
};

type CtaProps = {
	ctaBanner: CtaBanner;
};

export default function Cta({ ctaBanner }: CtaProps) {
	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="Blog call to action">
			<div className="rounded-[40px] border border-black/10 dark:border-white/20 px-6 sm:px-10 md:px-12 lg:px-16 py-16 sm:py-20 md:py-24 text-center">
				<div className="relative mx-auto max-w-3xl text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-900/85 dark:text-white/85">{ctaBanner.tagline}</p>

					<HeadLineText
						as="h2"
						align="center"
						fontSize="fiveXl"
						fontWeight="bold"
						className="mt-5 text-slate-900 dark:text-white"
					>
						{ctaBanner.title}
					</HeadLineText>

					<p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-800/85 dark:text-white/80">{ctaBanner.description}</p>

					<div className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
						<input
							type="email"
							placeholder={ctaBanner.inputPlaceholder}
							className="h-13 flex-1 rounded-xl border border-white/45 bg-white/25 px-5 text-base text-slate-900 outline-none placeholder:text-slate-700/60 focus:border-white/80 dark:border-white/25 dark:bg-white/8 dark:text-white dark:placeholder:text-white/55 dark:focus:border-white/45"
						/>
						<Link
							href={ctaBanner.button.link}
							className="inline-flex h-13 items-center justify-center rounded-xl bg-white px-7 text-base font-semibold text-[#112340] transition hover:bg-slate-100"
						>
							{ctaBanner.button.label}
						</Link>
					</div>

					<p className="mt-6 text-sm text-slate-700/55 dark:text-white/60">Zero spam. Pure signal. Unsubscribe at any time.</p>
				</div>
			</div>
		</Section>
        
	);
}
