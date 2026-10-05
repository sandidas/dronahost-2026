import CenteredHero from "@/components/sections/CenteredHero";

export default function BlogPostNotFound() {
  return (
    <CenteredHero
      eyebrow="404"
      title="That article"
      titleAccent="could not be found"
      description="It may have been removed or renamed. Browse the blog for the latest guides."
      primaryCta={{ label: "Back to the blog", href: "/blog" }}
      secondaryCta={{ label: "Go to the homepage", href: "/" }}
      headingLevel="h1"
    />
  );
}
