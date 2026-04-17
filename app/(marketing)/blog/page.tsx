import AiAssistance from "@/components/blog/AiAssistance/aiAssistance";
import AllBlogs from "@/components/blog/AllBlogs/AllBlogs";
import Articles from "@/components/blog/Articles/articles";
import HeroSection from "@/components/blog/blogheroSection/HeroSection";
import Cta from "@/components/blog/CTA/cta";
import DevelopmentHub from "@/components/blog/developmentHub/developmentHub";
import FeatureInsight from "@/components/blog/FeatureInsight/FeatureInsight";
import PopularVideos from "@/components/blog/popularVideos/popularVideos";
import Support from "@/components/blog/support/support";
import TrustedPlatform from "@/components/blog/trustedPlatform/trustedPlatform";
import JsonLd from "@/components/seo/JsonLd";
import blogData from "@/data/blog.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

export const metadata = buildMetadata({
  title: "Hosting & Web Design Blog — Tips & Guides | DronaHost",
  description: "Practical guides on WordPress hosting, web performance, SEO, and web design for US, UK, and UAE businesses. Written by hosting engineers and designers.",
  path: "/blog",
});

export default function BlogPage() {
	const { insightsSection, mediaHubSection, platformSupportSection, supportHubSection } = blogData;

	const blogSchema: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "DronaHost Blog",
		url: "https://dronahost.com/blog",
		description: "Hosting, web performance, SEO, and web design guides.",
		publisher: { "@type": "Organization", name: "DronaHost" },
	};

	return (
		<>
			<JsonLd schema={[blogSchema, breadcrumbSchema(buildBreadcrumbs("/blog"))]} />
			<HeroSection insightsSection={insightsSection} />
			<AllBlogs insightsSection={insightsSection} />
			<FeatureInsight
				featuredInsight={insightsSection.featuredInsight}
				trending={insightsSection.trending}
				newsletter={insightsSection.newsletter}
			/>
			<Cta ctaBanner={insightsSection.ctaBanner} />
			<PopularVideos popularVideos={mediaHubSection.popularVideos} />
			<DevelopmentHub developmentHub={mediaHubSection.developmentHub} />
			<TrustedPlatform intro={platformSupportSection.intro} features={platformSupportSection.features} />
			<AiAssistance support={platformSupportSection.support} />
			<Articles helpCategories={supportHubSection.helpCategories} />
			<Support supportHighlight={supportHubSection.supportHighlight} />
		</>
	);
}
