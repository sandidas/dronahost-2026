"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Default "div". */
  as?: ElementType;
  className?: string;
};

/**
 * Fades and lifts content in once when it first scrolls into view.
 *
 * Content is fully rendered on the server (crawlable, visible without JS).
 * Only elements that start below the fold are hidden after hydration, and only
 * opacity and transform change, so there is no layout shift. Honours
 * `prefers-reduced-motion`.
 */
export default function Reveal({ children, as: Tag = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already in view

    el.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.remove("reveal-pending");
        el.classList.add("reveal-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
