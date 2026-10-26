import { Cloud } from "lucide-react";
import { cn } from "@/utils/cn";

type NoteBandProps = {
  /** One plain line, already gated by the caller. */
  text: string;
  className?: string;
};

/** A thin full-width band with one line of text, for example the renewal and providers line under a banner (decision 80). */
export default function NoteBand({ text, className }: NoteBandProps) {
  return (
    <aside className={cn("border-y border-border bg-card", className)}>
      <p className="container-site flex items-center justify-center gap-3 py-5 text-center text-sm text-foreground sm:text-base">
        <Cloud aria-hidden="true" className="size-5 shrink-0 text-link" />
        {text}
      </p>
    </aside>
  );
}
