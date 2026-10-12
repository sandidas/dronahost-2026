import { BadgePercent, CircleHelp, Image, Images, LayoutGrid, ListOrdered, Map as MapIcon, Megaphone, MessageCircleQuestion, MousePointerClick, PanelTop, Pilcrow, Signpost, Split, Video, type LucideIcon } from "lucide-react";

/** Icons for the names used by the block definitions (lib/builder/blocks). */
export const BLOCK_ICONS: Record<string, LucideIcon> = {
  pilcrow: Pilcrow,
  image: Image,
  images: Images,
  video: Video,
  "panel-top": PanelTop,
  "layout-grid": LayoutGrid,
  "list-ordered": ListOrdered,
  "circle-help": CircleHelp,
  megaphone: Megaphone,
  split: Split,
  signpost: Signpost,
  "badge-percent": BadgePercent,
  map: MapIcon,
  "mouse-pointer-click": MousePointerClick,
  "message-circle-question": MessageCircleQuestion,
};
