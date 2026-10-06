"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Modal built on the native <dialog>: focus trap, Escape to close, inert background and focus
 * return come from the browser. Backdrop click closes it. Fades in with CSS only.
 */
export default function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn("dialog m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border-strong bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/60", className)}
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="t-h4 text-foreground">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-m-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {description && (
          <p id={descId} className="t-small mt-2 text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
