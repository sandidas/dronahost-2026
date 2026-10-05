"use client";

import { useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

const STORAGE_KEY = "v2-sidebar-collapsed";
const EVENT = "v2-sidebar-change";

const subscribe = (notify: () => void) => {
  window.addEventListener(EVENT, notify);
  return () => window.removeEventListener(EVENT, notify);
};

export default function ShowcaseLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  // Sidebar state lives in localStorage; reading it through useSyncExternalStore avoids
  // setting state inside an effect and keeps server and first client render identical.
  const collapsed = useSyncExternalStore(subscribe, () => localStorage.getItem(STORAGE_KEY) === "true", () => false);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  function toggle() {
    localStorage.setItem(STORAGE_KEY, String(!collapsed));
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div className="flex pt-14">
      {/* Sticky sidebar column — stays visible while page scrolls */}
      <div className="relative sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 self-start md:block">
        {/* overflow-clip clips width transition without breaking inner sticky/scroll */}
        <aside
          className={`h-full overflow-clip border-r border-border ${
            ready ? "transition-[width] duration-300 ease-in-out" : ""
          } ${collapsed ? "w-0" : "w-52"}`}
        >
          {sidebar}
        </aside>

        {/* Toggle button — vertically centered on the sidebar border */}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute right-0 top-1/2 z-30 -translate-y-1/2 translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
