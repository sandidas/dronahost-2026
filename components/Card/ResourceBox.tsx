import { cn } from "@/utils/cn";
import {
  BarChart3,
  Code,
  Database,
  Globe,
  Layout,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import HeadLineText from "../HeadLineText/HeadLineText";

type Props = {
  icon?: string;
  title: string;
  description: string;
  tech: string[];
  bgColor?: string;
};

export default function ResourceBox({
  icon,
  title,
  description,
  tech,
  bgColor,
}: Props) {

  const iconMap: Record<string, React.ReactNode> = {
    "web-design": <Globe className="w-6 h-6" />,
    "full-stack": <Code className="w-6 h-6" />,
    "UI/UX": <Layout className="w-6 h-6" />,
    dashboard: <BarChart3 className="w-6 h-6" />,
    database: <Database className="w-6 h-6" />,
    ecommerce: <ShoppingCart className="w-6 h-6" />,
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col gap-4",
        "border border-black/5 dark:border-white/10",
        "shadow-sm transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",

        bgColor
      )}
    >
      {/* Icon */}
      <div className="text-primary">
        {icon ? iconMap[icon] : null}
      </div>

      {/* Title */}
      <HeadLineText
        as="h3"
        fontSize="md"
        fontWeight="bold"
        align="left"
        className="text-foreground dark:text-white"
      >
        {title}
      </HeadLineText>

      {/* Description */}
      <HeadLineText
        as="p"
        fontSize="sm"
        fontWeight="light"
        align="left"
        className="text-muted-foreground leading-relaxed"
      >
        {description}
      </HeadLineText>

      {/* Tech */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {tech.map((t, i) => (
          <div
            key={i}
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 border border-black/5 dark:border-white/10 rounded-md"
          >
            <Image
              src={`/${t}`}
              alt="tech"
              width={24}
              height={24}
            />
          </div>
        ))}
      </div>
    </div>
  );
}