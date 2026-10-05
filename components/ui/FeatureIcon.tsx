import {
  Activity,
  Cloud,
  Code,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Layers,
  LifeBuoy,
  Lock,
  Mail,
  Palette,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

const ICONS = {
  activity: Activity,
  cloud: Cloud,
  code: Code,
  database: Database,
  "file-text": FileText,
  gauge: Gauge,
  "git-branch": GitBranch,
  globe: Globe,
  layers: Layers,
  "life-buoy": LifeBuoy,
  lock: Lock,
  mail: Mail,
  palette: Palette,
  "refresh-cw": RefreshCw,
  search: Search,
  server: Server,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
  users: Users,
  zap: Zap,
} satisfies Record<string, LucideIcon>;

export type FeatureIconName = keyof typeof ICONS;

type FeatureIconProps = {
  name: FeatureIconName;
  /** Tile size. md is 44px, the minimum comfortable touch/visual weight. */
  size?: "md" | "lg";
  className?: string;
};

/** Teal-tinted icon tile used by feature grids, bento tiles and menus. Decorative (aria-hidden). */
export default function FeatureIcon({ name, size = "md", className }: FeatureIconProps) {
  const Icon = ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/12 text-link",
        size === "md" ? "size-11" : "size-14",
        className,
      )}
    >
      <Icon className={size === "md" ? "size-5" : "size-6"} strokeWidth={1.75} />
    </span>
  );
}
