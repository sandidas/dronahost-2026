import Link from "next/link";

type DropDownMenuProps = {
	open: boolean;
};

function IconCircle({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300/90 text-slate-600 dark:border-slate-500 dark:text-slate-200">
			{children}
		</div>
	);
}

export default function DropDownMenu({ open }: DropDownMenuProps) {
	if (!open) return null;

	return (
		<div className="absolute right-0 top-full mt-3 w-96 sm:w-130 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] sm:p-6 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[0_30px_90px_-48px_rgba(2,6,23,0.95)]">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
				<Link
					href="/contact"
					className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
				>
					<IconCircle>
						<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
							<path d="M3 18V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" />
							<path d="m3 7 9 6 9-6" />
						</svg>
					</IconCircle>
					<p className="mb-2 text-3xl font-semibold leading-none">Contact Us</p>
					<p className="text-base text-slate-600 dark:text-slate-300">Contact us or schedule a meeting with a single click.</p>
				</Link>

				<Link
					href="/blog"
					className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
				>
					<IconCircle>
						<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
							<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
							<path d="M8 8h8M8 12h8M8 16h5" />
						</svg>
					</IconCircle>
					<p className="mb-2 text-3xl font-semibold leading-none">Blogs</p>
					<p className="text-base text-slate-600 dark:text-slate-300">Unleash your voice with captivating blogs where ideas come to life.</p>
				</Link>
			</div>
		</div>
	);
}
