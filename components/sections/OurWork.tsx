import { useId } from "react";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  image: string;
  link: string;
};

type OurWorkProps = {
  /** Heading level of the section title so each page keeps exactly one H1. Default "h2". */
  headingLevel?: "h2" | "h3";
  data: {
    title: string;
    description: string;
    projects: Project[];
  };
};

export default function OurWork({ data, headingLevel = "h2" }: OurWorkProps) {
  const headingId = useId();
  const childLevel = headingLevel === "h2" ? "h3" : "h4";
  const { title, description, projects } = data;

  return (
    <Section aria-labelledby={headingId} padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Heading */}
        <div className="max-w-3xl space-y-4">
          <HeadLineText
            as={headingLevel}
            id={headingId}
            fontSize="fourXl"
            fontWeight="bold"
            align="left"
            className="text-black dark:text-white"
          >
            {title}
          </HeadLineText>
        <HeadLineText
            as="p"
            fontSize="md"
            fontWeight="medium"
            align="left"
            className="text-gray-600 dark:text-gray-300"
          >
            {description}
          </HeadLineText>
        </div>
        
        {/* Projects Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.link}
              className="group relative rounded-2xl overflow-hidden "
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              {/* Title */}
              {/* <div className="absolute inset-0 flex items-end justify-center pb-6">
                <h3 className="text-white font-semibold text-lg tracking-widest uppercase">
                  {project.title}
                </h3>
              </div> */}
            </Link>
          ))}
        </div>

      </div>
    </Section>
  );
}