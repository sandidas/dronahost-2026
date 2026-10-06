import type { LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  body: string;
  action?: { label: string; href: string };
  /** Heading level for the title. Default "h2". */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Calm empty state: what is missing, why, and one next step (content-writing-rules §6). */
export default function EmptyState({ icon: Icon, title, body, action, headingLevel = "h2", className }: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div className={cn("surface mx-auto max-w-xl p-8 text-center sm:p-10", className)}>
      {Icon && (
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-link">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <Heading className="t-h4 text-foreground">{title}</Heading>
      <p className="t-small mt-2 text-muted-foreground">{body}</p>
      {action && (
        <div className="mt-6">
          <Button href={action.href} variant="secondary">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
