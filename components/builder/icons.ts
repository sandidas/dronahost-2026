import { BadgePercent, CircleHelp, Columns3, Heading, Image, LayoutGrid, ListOrdered, Map as MapIcon, Megaphone, MessageCircleQuestion, MousePointerClick, PanelTop, Pilcrow, Rows3, Signpost, Split, Video, type LucideIcon } from "lucide-react";

/** Icons for the block names used in lib/builder/catalog.ts. */
export const BLOCK_ICONS: Record<string, LucideIcon> = {
  "rows-3": Rows3,
  "columns-3": Columns3,
  heading: Heading,
  pilcrow: Pilcrow,
  image: Image,
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
