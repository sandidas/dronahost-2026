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
import { connectToDatabase } from "@/lib/mongodb";
import { Post } from "@/lib/models/post";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Hosting & Web Design Blog — Tips & Guides | DronaHost",
  description: "Practical guides on WordPress hosting, web performance, SEO, and web design for US, UK, and UAE businesses. Written by hosting engineers and designers.",
  path: "/blog",
});

type LeanPost = {
  _id: unknown;
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  author: { name: string; bio: string; avatar: string };
  publishedAt: Date | null;
  createdAt: Date;
};

export default async function BlogPage() {
  const { insightsSection, mediaHubSection, platformSupportSection, supportHubSection } = blogData;

  // Fetch published DB posts and merge into the static featuredPosts list
  let dbFeaturedPosts: typeof insightsSection.featuredPosts = [];
  try {
    await connectToDatabase();
    const rawPosts = await Post.find(
      { status: "published", deletedAt: null },
      { slug: 1, title: 1, category: 1, coverImage: 1, author: 1, publishedAt: 1, createdAt: 1 }
    )
      .sort({ publishedAt: -1 })
      .limit(12)
      .lean() as LeanPost[];

    dbFeaturedPosts = rawPosts.map((p, i) => ({
      id: 100_000 + i, // avoid collision with static IDs
      category: p.category,
      title: p.title,
      image: p.coverImage,
      author: p.author.name,
      date: formatDate(
        (p.publishedAt ?? p.createdAt).toISOString()
      ),
      slug: p.slug,
    }));
  } catch {
    // DB unreachable — fall back to static posts only
  }

  const mergedInsightsSection = {
    ...insightsSection,
    featuredPosts: [...dbFeaturedPosts, ...insightsSection.featuredPosts],
  };

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
      <HeroSection insightsSection={mergedInsightsSection} />
      <AllBlogs insightsSection={mergedInsightsSection} />
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
