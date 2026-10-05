"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/utils/cn";

const subscribe = () => () => {};

type ThemeToggleProps = {
  /** Show the text label beside the icon (used in the mobile drawer). */
  showLabel?: boolean;
  className?: string;
};

/**
 * Switches between the dark (default) and light themes.
 * Icons swap with CSS, so the first paint is correct without waiting for hydration;
 * only the accessible name needs the resolved theme.
 */
export default function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const next = resolvedTheme === "light" ? "dark" : "light";
  const label = mounted ? `Switch to ${next} theme` : "Switch theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      className={cn(
        "btn btn-ghost gap-2 !px-0 sm:!px-0",
        showLabel ? "!w-full justify-start !px-3" : "size-11 !min-h-11 shrink-0",
        className,
      )}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      {showLabel && <span suppressHydrationWarning>{mounted ? `${next === "light" ? "Light" : "Dark"} theme` : "Theme"}</span>}
    </button>
  );
}
