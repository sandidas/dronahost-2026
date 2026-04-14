import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  image: string;
  link: string;
};

type OurWorkProps = {
  data: {
    title: string;
    description: string;
    projects: Project[];
  };
};

export default function OurWork({ data }: OurWorkProps) {
  const { title, description, projects } = data;

  return (
    <Section padding="lg" className="bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Heading */}
        <div className="max-w-3xl space-y-4">
          <HeadLineText
            as="h2"
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