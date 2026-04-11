import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type ComparisonRow = {
	feature: string;
	values: string[];
};

type WhyBetterProps = {
	comparison: {
		title: string;
		description: string;
		columns: string[];
		rows: ComparisonRow[];
		cta: {
			label: string;
			link: string;
		};
	};
};

export default function WhyBetter({ comparison }: WhyBetterProps) {
	const competitorColumns = comparison.columns.slice(1);

	return (
		<Section size="lg" padding="md" height="screen" className="bg-white dark:bg-slate-950" aria-label="Comparison table section">
			<div className="mx-auto max-w-7xl">
				<HeadLineText
					as="h2"
					align="center"
					fontSize="fourXl"
					fontWeight="bold"
					className="text-slate-900 dark:text-slate-100"
				>
					{comparison.title}
				</HeadLineText>

				<p className="mx-auto mt-3 max-w-3xl text-center text-[22px] leading-9 text-slate-500 dark:text-slate-300">
					{comparison.description}
				</p>

				<div className="mt-10 overflow-x-auto">
					<table className="w-full min-w-245 border-separate border-spacing-0 rounded-2xl border border-slate-200 bg-white text-left dark:border-slate-700 dark:bg-slate-900">
						<thead>
							<tr>
								<th className="border-b border-slate-200 px-6 py-5 text-[20px] font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
									{comparison.columns[0]}
								</th>
								<th className="border border-orange-300 bg-orange-50 px-6 py-5 text-center text-[20px] font-semibold text-primary dark:border-orange-500/70 dark:bg-orange-950/20">
									<div className="flex flex-col items-center">
										<span>{competitorColumns[0]}</span>
										<span className="mt-1 text-[12px] font-medium text-slate-500 dark:text-slate-300">Your Hosting, Our Opportunity</span>
									</div>
								</th>
								{competitorColumns.slice(1).map((column) => (
									<th
										key={column}
										className="border-b border-l border-slate-200 px-6 py-5 text-center text-[20px] font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-300"
									>
										{column}
									</th>
								))}
							</tr>
						</thead>

						<tbody>
							{comparison.rows.map((row) => (
								<tr key={row.feature}>
									<td className="border-b border-slate-200 px-6 py-5 text-[19px] font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
										{row.feature}
									</td>
									<td className="border-b border-l border-r border-orange-300 bg-orange-50 px-6 py-5 text-center text-xl font-bold text-orange-600 dark:border-orange-500/70 dark:bg-orange-950/20">
										{row.values[0]}
									</td>
									{row.values.slice(1).map((value, index) => (
										<td
											key={`${row.feature}-${index}`}
											className="border-b border-l border-slate-200 px-6 py-5 text-center text-[18px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-300"
										>
											{value}
										</td>
									))}
								</tr>
							))}

							<tr>
								<td className="px-6 py-5" />
								<td className="border-l border-r border-orange-300 bg-orange-50 px-6 py-5 dark:border-orange-500/70 dark:bg-orange-950/20">
									<Link
										href={comparison.cta.link}
										className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-[18px] font-semibold text-white"
									>
										{comparison.cta.label}
									</Link>
								</td>
								<td className="px-6 py-5" />
								<td className="px-6 py-5" />
								<td className="px-6 py-5" />
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</Section>
	);
}
