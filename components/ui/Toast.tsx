"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "success" | "info" | "error";
type ToastItem = { id: number; message: string; tone: Tone };
type ToastApi = { show: (message: string, tone?: Tone) => void };

const ToastContext = createContext<ToastApi | null>(null);
const DURATION_MS = 6000;
const ICONS = { success: CheckCircle2, info: Info, error: TriangleAlert } as const;

/** Access the toast API. Falls back to a no-op outside the provider so a missing provider never crashes a page. */
export function useToast(): ToastApi {
  return useContext(ToastContext) ?? { show: () => undefined };
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = ICONS[item.tone];
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onDismiss]);
  return (
    <li className={cn("toast flex items-start gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-lg", item.tone === "error" ? "border-destructive" : "border-border-strong")}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", item.tone === "error" ? "text-destructive" : item.tone === "success" ? "text-secondary" : "text-muted-foreground")} aria-hidden="true" />
      <p className="t-small flex-1 text-foreground">{item.message}</p>
      <button type="button" onClick={() => onDismiss(item.id)} aria-label="Dismiss" className="-m-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground">
        <X className="size-4" aria-hidden="true" />
      </button>
    </li>
  );
}

/**
 * Toast region. Messages are announced through a polite live region (assertive for errors) and
 * auto-dismiss after 6s. The timer is not paused on hover, so keep messages non-critical: anything the
 * visitor must act on belongs inline next to the control.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const show = useCallback((message: string, tone: Tone = "info") => {
    const id = nextId.current++;
    setItems((list) => [...list.slice(-2), { id, message, tone }]);
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ul
        role="region"
        aria-label="Notifications"
        aria-live={items.some((t) => t.tone === "error") ? "assertive" : "polite"}
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:end-4 sm:items-end [&>li]:pointer-events-auto [&>li]:w-full [&>li]:max-w-sm"
      >
        {items.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </ul>
    </ToastContext.Provider>
  );
}
