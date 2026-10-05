"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

const STORAGE_KEY = "v2-sidebar-collapsed";

export default function ShowcaseLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    setReady(true);
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="flex pt-14">
      {/* Sticky sidebar column — stays visible while page scrolls */}
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] shrink-0 self-start relative">
        {/* overflow-clip clips width transition without breaking inner sticky/scroll */}
        <aside
          className={`h-full overflow-clip border-r border-slate-200 dark:border-slate-800 ${
            ready ? "transition-[width] duration-300 ease-in-out" : ""
          } ${collapsed ? "w-0" : "w-52"}`}
        >
          {sidebar}
        </aside>

        {/* Toggle button — vertically centered on the sidebar border */}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-8 py-6">
        {children}
      </main>
    </div>
  );
}
