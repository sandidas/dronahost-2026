"use client";

import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { useState } from "react";

type FAQSectionProps = {
	data: {
		faqSection: {
			tagline: string;
			title: string;
			categories: {
				label: string;
				active: boolean;
			}[];
			content: {
				title: string;
				description: string;
				highlightBox: {
					text: string;
				};
				additionalInfo: string[];
			};
			faqs: {
				id: number;
				question: string;
				answer: string;
				isOpen: boolean;
			}[];
		};
	};
};

export default function FAQSection({ data }: FAQSectionProps) {
	const { faqSection } = data;
	const [activeId, setActiveId] = useState<number | null>(null);

	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="FAQ section">
			<p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{faqSection.tagline}</p>

			<HeadLineText as="h2" align="none" fontSize="fiveXl" fontWeight="bold" className="mt-3 text-[#0f1736] dark:text-slate-100">
				{faqSection.title}
			</HeadLineText>

			<div className="mt-8 flex flex-wrap gap-3">
				{faqSection.categories.map((category) => (
					<button
						key={category.label}
						type="button"
						className={[
							"rounded-full px-5 py-2 text-sm font-medium transition",
							category.active
								? "bg-primary text-white"
								: "bg-[#f8e8e1] text-primary hover:bg-orange-100 dark:bg-slate-800 dark:text-orange-300 dark:hover:bg-slate-700",
						].join(" ")}
					>
						{category.label}
					</button>
				))}
			</div>

			<div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.12fr]">
				<article className="border-b border-r-0 border-slate-200 pb-4 lg:border-b-0 lg:border-r lg:pr-12 dark:border-slate-800">
					<HeadLineText as="h3" align="none" fontSize="fourXl" fontWeight="bold" className="text-[#111b3b] dark:text-slate-100">
						{faqSection.content.title}
					</HeadLineText>

					<p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300">{faqSection.content.description}</p>

					<div className="mt-6 max-w-md rounded-2xl bg-[#f5e6df] p-5 text-base leading-relaxed text-[#2f4b87] dark:bg-slate-800 dark:text-slate-200">
						{faqSection.content.highlightBox.text}
					</div>

					{faqSection.content.additionalInfo.map((paragraph) => (
						<p key={paragraph.slice(0, 28)} className="mt-5 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{paragraph}
						</p>
					))}
				</article>

				<div>
					<p className="mb-4 text-3xl font-medium text-black dark:text-slate-100">Frequently asked questions</p>

					<div className="space-y-3">
						{faqSection.faqs.map((faq) => {
							const isOpen = activeId === faq.id;

							return (
								<div key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
									<button
										type="button"
										onClick={() => setActiveId(isOpen ? null : faq.id)}
										className="flex w-full items-center justify-between gap-4 text-left"
									>
										<span className="text-base font-medium text-[#1b233f] dark:text-slate-100">{faq.question}</span>
										<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
											{isOpen ? "-" : "+"}
										</span>
									</button>

									{isOpen && faq.answer && <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Section>
	);
}
