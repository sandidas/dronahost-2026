import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Plan = {
	id: number;
	name: string;
	tagline: string;
	discount: string;
	price: string;
	originalPrice: string;
	duration: string;
	cta: {
		label: string;
		link: string;
	};
	highlight?: boolean;
	renewal: string;
	features: string[];
};

type PricingSectionProps = {
	plans: Plan[];
};

export default function PricingSection({ plans }: PricingSectionProps) {
	return (
		<Section size="lg" padding="md" className="bg-white dark:bg-slate-950">
			<div className="mx-auto max-w-7xl">
				<HeadLineText
					as="h2"
					align="center"
					fontSize="fourXl"
					fontWeight="bold"
					className="text-slate-900 dark:text-slate-100"
				>
					Pick The Perfect Plan
				</HeadLineText>

				<p className="mx-auto mt-3 max-w-2xl text-center text-[16px] text-slate-600 dark:text-slate-300">
					Transparent pricing, premium performance, and everything you need to launch with confidence.
				</p>

				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
					{plans.map((plan, index) => (
						<GridCard
							key={plan.id}
							index={index}
							total={plans.length}
							columns={4}
							size="md"
							className={[
								plan.highlight
									? "border-primary bg-white dark:bg-slate-900 shadow-[0_18px_40px_-24px_rgba(251,146,60,0.6)]"
									: "bg-white dark:bg-slate-900",
							].join(" ")}
						>
							{/* Header */}
							<div className="mb-4 flex items-start justify-between gap-3 w-full">
								<div>
									<h3 className="text-[24px] font-bold text-slate-900 dark:text-slate-100">
										{plan.name}
									</h3>
									<p className="mt-1 text-[14px] text-slate-600 dark:text-slate-300">
										{plan.tagline}
									</p>
								</div>

								<span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
									{plan.discount}
								</span>
							</div>

							{/* Price */}
							<div className="mb-4 flex items-end gap-2">
								<span className="text-[34px] font-bold text-slate-900 dark:text-slate-100">
									{plan.price}
								</span>
								<span className="text-[14px] text-slate-500 line-through dark:text-slate-400">
									{plan.originalPrice}
								</span>
								<span className="text-[14px] font-semibold text-slate-600 dark:text-slate-300">
									{plan.duration}
								</span>
							</div>

							{/* CTA */}
							<Link
								href={plan.cta.link}
								className={[
									"inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold transition",
									plan.highlight
										? "bg-primary text-white hover:brightness-95"
										: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
								].join(" ")}
							>
								{plan.cta.label}
							</Link>

							<p className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
								{plan.renewal}
							</p>

							{/* Features */}
							<ul className="mt-5 space-y-2">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="flex items-start gap-2 text-[14px] text-slate-700 dark:text-slate-200"
									>
										<span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
											✓
										</span>
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</GridCard>
					))}
				</div>
			</div>
		</Section>
	);
}