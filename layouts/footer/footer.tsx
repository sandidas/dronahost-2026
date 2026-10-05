import footerData from "@/data/footer.json";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

type FooterLink = {
	label: string;
	link: string;
};

type FooterColumn = {
	title: string;
	links: FooterLink[];
};

type FooterSocial = {
	platform: string;
	link: string;
};

const SOCIAL_LABELS: Record<string, string> = {
	twitter: "X",
	github: "GH",
	instagram: "IG",
	youtube: "YT",
	facebook: "FB",
};

export default function Footer() {
	const { footer } = footerData;

	return (
		<footer className="site-footer" aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				DronaHost site footer
			</h2>
			<div className="footer-shell">
				<section className="footer-top">
					<div className="footer-brand" aria-label="Brand block">
						<Link href="/" className="inline-block" aria-label="DronaHost home">
							<Logo size="lg" />
						</Link>
					</div>

					<div className="footer-columns">
						{(footer.columns as FooterColumn[]).map((column) => (
							<nav key={column.title} className="footer-column" aria-label={column.title}>
								<h3>{column.title}</h3>
								<ul>
									{column.links.map((item) => (
										<li key={item.label}>
											<Link href={item.link}>{item.label}</Link>
										</li>
									))}
								</ul>
							</nav>
						))}
					</div>
				</section>

				<section className="footer-bottom">
					<div className="footer-copy">
						<p className="footer-copyright">{footer.bottom.copyright}</p>
						<p className="footer-description">{footer.bottom.description}</p>
					</div>

					<ul className="footer-socials" aria-label="Social media links">
						{(footer.bottom.socials as FooterSocial[]).map((social) => (
							<li key={social.platform}>
								<Link href={social.link} target="_blank" rel="noreferrer noopener" aria-label={social.platform}>
									{SOCIAL_LABELS[social.platform] ?? social.platform.slice(0, 2).toUpperCase()}
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>
		</footer>
	);
}
