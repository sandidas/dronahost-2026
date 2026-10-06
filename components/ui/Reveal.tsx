import type { CSSProperties, ElementType, ReactNode } from "react";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Stagger position (capped at 5). */
  index?: number;
};

/**
 * Server component: marks a block for the scroll reveal that `RevealObserver` runs once for the whole
 * page. Content is always in the HTML; the effect is a progressive enhancement and never applies above the fold.
 */
export default function Reveal({ children, as: Tag = "div", className, style, index = 0 }: RevealProps) {
  const r = reveal(index);
  return (
    <Tag {...{ "data-reveal": r["data-reveal"] }} style={{ ...r.style, ...style }} className={cn(className)}>
      {children}
    </Tag>
  );
}
