"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const HIDDEN_ON = ["/contact", "/consultation", "/migration"];

/**
 * Mobile-only action bar. Appears after the visitor has scrolled past the hero and hides when
 * the footer is in view or the page already is a form. Slides in with a CSS transition that
 * is removed under prefers-reduced-motion. Takes no space in the layout (fixed).
 */
export default function StickyMobileCTA({ label, href = "/contact" }: { label?: string; href?: string }) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const footer = document.querySelector("footer");
    const io = footer ? new IntersectionObserver(([e]) => setFooterVisible(Boolean(e?.isIntersecting))) : null;
    if (footer) io?.observe(footer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  const shown = pastHero && !footerVisible;

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className="sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur md:hidden"
      data-shown={shown}
    >
      <Button href={href} fullWidth>
        {label ?? t("talkToTeam")}
      </Button>
    </div>
  );
}
