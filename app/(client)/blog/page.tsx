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
import blogData from "@/data/blog.json";

export default function BlogPage() {
	const { insightsSection, mediaHubSection, platformSupportSection, supportHubSection } = blogData;

	return (
		<>	<HeroSection insightsSection={insightsSection} />
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
