"use client";

import { useEffect, useRef } from "react";

const PARTS = /^(\D*)(\d+(?:\.\d+)?)(.*)$/;

/**
 * Counts a stat up once when it first scrolls into view (1.2s). The server HTML already holds the
 * final value, so crawlers, no-JS visitors and reduced-motion users see it unchanged. Values with
 * no number, and four-digit years, are left alone. Only use it for verified figures.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = PARTS.exec(value);
    if (!el || !m) return;
    const [, prefix = "", digits = "", suffix = ""] = m;
    const target = Number(digits);
    if (/^(19|20)\d{2}$/.test(digits)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it
    const decimals = digits.includes(".") ? (digits.split(".")[1]?.length ?? 0) : 0;
    const show = (n: number) => {
      el.textContent = `${prefix}${n.toFixed(decimals)}${suffix}`;
    };
    show(0);

    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1200, 1);
        show(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
        else el.textContent = value;
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
