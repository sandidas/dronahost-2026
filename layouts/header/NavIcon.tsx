import { Cloud, Globe, Layers, Mail, Palette, Search, Server, TrendingUp, type LucideIcon } from "lucide-react";
import type { NavIcon as NavIconName } from "@/content/navigation";

const ICONS: Record<NavIconName, LucideIcon> = {
  server: Server,
  cloud: Cloud,
  layers: Layers,
  mail: Mail,
  globe: Globe,
  palette: Palette,
  search: Search,
  "trending-up": TrendingUp,
};

/** Decorative icon for a nav item. Always aria-hidden: the link text carries the meaning. */
export default function NavIcon({ name, className }: { name?: NavIconName; className?: string }) {
  if (!name) return null;
  const Icon = ICONS[name];
  return <Icon className={className ?? "size-5"} aria-hidden="true" strokeWidth={1.75} />;
}
