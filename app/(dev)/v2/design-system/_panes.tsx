import { type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Theme = "light" | "dark";

/** Renders children inside a forced light or dark token scope. */
export function ThemePane({
  theme,
  children,
  className,
}: {
  theme: Theme;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        theme,
        "min-w-0 rounded-2xl border border-border bg-background p-4 text-foreground sm:p-8",
        className,
      )}
    >
      <p className="t-eyebrow mb-5">{theme === "dark" ? "Dark theme (default)" : "Light theme"}</p>
      {children}
    </div>
  );
}

/** Shows the same specimen in both themes, side by side on wide screens. */
export function BothThemes({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-6 xl:grid-cols-2", className)}>
      <ThemePane theme="dark">{children}</ThemePane>
      <ThemePane theme="light">{children}</ThemePane>
    </div>
  );
}

export function DsSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-border py-16">
      <h2 id={`${id}-h`} className="t-h2 text-foreground">
        {title}
      </h2>
      {intro && <p className="t-body mt-3 text-muted-foreground">{intro}</p>}
      <div className="mt-10 space-y-8">{children}</div>
    </section>
  );
}

export function SpecLabel({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{children}</p>;
}
