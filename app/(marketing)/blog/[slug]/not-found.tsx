import Link from "next/link";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";

export default function BlogPostNotFound() {
  return (
    <Section size="lg" padding="lg" className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-xl text-center">
        <span className="mb-4 inline-block text-6xl font-black text-primary">404</span>
        <HeadLineText as="h1" fontSize="fourXl" fontWeight="bold" className="mt-2">
          Post Not Found
        </HeadLineText>
        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
          The blog post you are looking for has been removed, renamed, or never existed.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary/90 transition-colors"
          >
            ← Back to Blog
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors dark:border-slate-700 dark:text-slate-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Section>
  );
}
