import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

type AiAssistanceProps = {
	support: {
		title: string;
		searchCard: {
			icon: string;
			title: string;
			aiHint: {
				label: string;
				text: string;
			};
			input: {
				placeholder: string;
			};
			cta: {
				icon: string;
				label: string;
				action: string;
			};
			note: string;
		};
	};
};

export default function AiAssistance({ support }: AiAssistanceProps) {
	const { searchCard } = support;

	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="AI assistance support section">
			<HeadLineText
				as="h2"
				align="center"
				fontSize="fiveXl"
				fontWeight="bold"
				className="mx-auto max-w-2xl text-black dark:text-slate-100"
			>
				{support.title}
			</HeadLineText>

			<div className="mx-auto mt-8 max-w-5xl rounded-4xl bg-white p-8 shadow-sm dark:bg-slate-900">
				<div className="mx-auto h-16 w-16 rounded-2xl bg-[#f4ece4] text-primary relative">
					<svg viewBox="0 0 24 24" className="absolute inset-0 m-auto h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
						<circle cx="11" cy="11" r="7" />
						<path d="m20 20-3-3" />
					</svg>
				</div>

				<HeadLineText as="h3" align="center" fontSize="fourXl" fontWeight="bold" className="mt-6 text-slate-800 dark:text-slate-100">
					{searchCard.title}
				</HeadLineText>

				<div className="mt-6 rounded-2xl bg-[#f6ece6] px-6 py-5 dark:bg-slate-800">
					<div className="flex gap-4">
						<div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe6d6] text-primary">
							<span className="text-sm font-semibold">{searchCard.aiHint.label}</span>
						</div>

						<p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{searchCard.aiHint.text}</p>
					</div>
				</div>

				<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
					<div className="flex items-center gap-3">
						<input
							type="text"
							placeholder={searchCard.input.placeholder}
							className="h-13 flex-1 rounded-xl border-0 bg-transparent px-4 text-lg text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
						/>
						<button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90" aria-label={searchCard.cta.label}>
							<span className="text-2xl leading-none">→</span>
						</button>
					</div>
				</div>

				<div className="mt-6 flex items-start gap-3 px-2 text-sm text-slate-500 dark:text-slate-400">
					<svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
						<path d="M12 9v4" />
						<path d="M12 17h.01" />
						<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
					</svg>
					<p>{searchCard.note}</p>
				</div>
			</div>
		</Section>
	);
}
