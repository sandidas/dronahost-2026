import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";

type PopularVideosProps = {
	popularVideos: {
		title: string;
		controls: {
			arrows: boolean;
		};
		videos: {
			id: number;
			type: string;
			title: string;
			subtitle: string;
			duration: string;
			image: string;
			cta: {
				label: string;
				link: string;
			};
		}[];
	};
};

export default function PopularVideos({ popularVideos }: PopularVideosProps) {
	return (
		<Section size="lg" padding="md" className="bg-[#f3f4f6] dark:bg-slate-950" aria-label="Popular videos section">
			<div className="mb-7 flex items-center justify-between border-b border-slate-300 pb-3 dark:border-slate-700">
				<HeadLineText as="h2" align="none" fontSize="fourXl" fontWeight="bold" className="text-slate-900 dark:text-slate-100">
					{popularVideos.title}
				</HeadLineText>

				{popularVideos.controls.arrows && (
					<div className="flex items-center gap-2">
						<button type="button" className="h-11 w-11 rounded-full border border-orange-500 text-orange-500 transition hover:bg-orange-500 hover:text-white" aria-label="Previous videos">
							<span className="text-xl leading-none">‹</span>
						</button>
						<button type="button" className="h-11 w-11 rounded-full border border-orange-500 text-orange-500 transition hover:bg-orange-500 hover:text-white" aria-label="Next videos">
							<span className="text-xl leading-none">›</span>
						</button>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{popularVideos.videos.map((video) => (
					<article key={video.id} className="group">
						<Link href={video.cta.link} className="block overflow-hidden rounded-3xl">
							<div className="relative h-52 overflow-hidden rounded-3xl">
								<Image src={video.image} alt={video.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />

								<div className="absolute inset-0 bg-linear-to-br from-black/35 via-black/10 to-transparent" />

								<span className="absolute left-4 top-4 rounded-md bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
									{video.type}
								</span>

								<span className="absolute bottom-4 right-4 rounded-md bg-black/45 px-2 py-1 text-sm font-semibold text-white">
									{video.duration}
								</span>

								<div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-orange-500 shadow-lg">
									<span className="ml-1 text-2xl leading-none">▶</span>
								</div>

								<p className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-4xl font-semibold text-white drop-shadow-sm">
									{video.title}
								</p>
							</div>
						</Link>

						<p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Video Tutorial</p>
						<p className="mt-2 text-3xl font-semibold leading-snug text-slate-800 dark:text-slate-100">{video.subtitle}</p>
					</article>
				))}
			</div>
		</Section>
	);
}
