"use client";

import GridCard from "@/components/Card/GridCard";
import ResourceCard from "@/components/Card/ResourceCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import { useMemo, useState } from "react";

type InsightsSectionProps = {
  search: {
    placeholder: string;
  };
  filters: {
    label: string;
    active: boolean;
  }[];
  featuredPosts: {
    id: number;
    category: string;
    title: string;
    image: string;
    author: string;
    date: string;
  }[];
};

type AllBlogsProps = {
  insightsSection: InsightsSectionProps;
};

export default function AllBlogs({ insightsSection }: AllBlogsProps) {

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = useMemo(
    () => ["All", ...insightsSection.filters.map((f) => f.label)],
    [insightsSection.filters]
  );

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return insightsSection.featuredPosts.filter((post) => {
      const byFilter =
        activeFilter === "All" ||
        post.category.toLowerCase() === activeFilter.toLowerCase();

      const bySearch =
        query.length === 0 ||
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      return byFilter && bySearch;
    });
  }, [activeFilter, insightsSection.featuredPosts, searchQuery]);

  return (
    <Section
      size="lg"
      padding="md"
      className="bg-transparent dark:bg-black"
      aria-label="All blogs section"
    >
      {/* FILTER + SEARCH */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  rounded-full px-5 py-2 text-xs font-semibold transition
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-orange-500/25"
                      : "bg-white text-slate-600 hover:text-primary dark:bg-slate-900 dark:text-slate-300"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="w-full max-w-xs lg:w-80">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={insightsSection.search.placeholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-black"
          />
        </div>
      </div>

      {/* BLOG GRID */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

          {filteredPosts.map((post, index) => (
            <GridCard
              key={post.id}
              index={index}
              total={filteredPosts.length}
              columns={3}
              size="md"
              variant="ghost"
            >
              <ResourceCard
                post={{
                  category: post.category,
                  title: post.title,
                  description: `By ${post.author}`,
                  readTime: post.date,
                  button: "Read More",
                  image: post.image,
                  href: "/blog",
                }}
                showCategory
                showDescription={false}
                showCTA={false}
                imageClassName="h-65 mb-5 overflow-hidden rounded-xl"
                contentClassName="px-1 pb-2"
              />
            </GridCard>
          ))}

        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-black">
          <HeadLineText
            as="h3"
            fontSize="threeXl"
            fontWeight="bold"
            className="text-slate-800 dark:text-slate-100"
          >
            No Posts Found
          </HeadLineText>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Try a different filter or change your search keyword.
          </p>
        </div>
      )}
    </Section>
  );
}