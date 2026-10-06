"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TabItem = { id: string; label: string; content: ReactNode };

type TabsProps = { items: TabItem[]; label: string; defaultId?: string; className?: string };

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation). Arrow keys, Home and End move
 * between tabs; only the active tab is in the tab order. All panels stay in the HTML (hidden),
 * so the content is still crawlable. Direction-aware for RTL.
 */
export default function Tabs({ items, label, defaultId, className }: TabsProps) {
  const base = useId();
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (items.length === 0) return null;

  const move = (e: KeyboardEvent, index: number) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const next = e.key === (rtl ? "ArrowLeft" : "ArrowRight") ? index + 1 : e.key === (rtl ? "ArrowRight" : "ArrowLeft") ? index - 1 : e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const target = items[(next + items.length) % items.length];
    if (!target) return;
    setActive(target.id);
    refs.current[target.id]?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-border">
        {items.map((item, i) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => move(e, i)}
              className={cn(
                "-mb-px min-h-11 shrink-0 border-b-2 px-4 text-sm font-medium transition-colors",
                selected ? "border-action text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" id={`${base}-panel-${item.id}`} aria-labelledby={`${base}-tab-${item.id}`} hidden={item.id !== active} tabIndex={0} className="pt-6 focus-visible:outline-offset-4">
          {item.content}
        </div>
      ))}
    </div>
  );
}
