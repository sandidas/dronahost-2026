"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mounted once in the root document. Arms every `[data-reveal]` element that starts below the fold
 * and adds `.is-in` the first time it scrolls into view, then stops observing it. Anything already on
 * screen at mount is never animated, and nothing is armed when reduced motion is on or JS fails,
 * so the server HTML is always fully visible.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("reveal-armed");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
