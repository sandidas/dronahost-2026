"use client";

import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";

function ToastButtons() {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="secondary" onClick={() => show("Your message has been sent.", "success")}>
        Success toast
      </Button>
      <Button type="button" variant="secondary" onClick={() => show("Settings saved.", "info")}>
        Info toast
      </Button>
      <Button type="button" variant="secondary" onClick={() => show("We could not save that. Please try again.", "error")}>
        Error toast
      </Button>
    </div>
  );
}

export function TabsDemo() {
  return (
    <Tabs
      label="Example tabs"
      items={[
        { id: "one", label: "Overview", content: <p className="text-muted-foreground">First panel. Arrow keys, Home and End move between tabs.</p> },
        { id: "two", label: "Details", content: <p className="text-muted-foreground">Second panel. Inactive panels stay in the HTML, hidden.</p> },
        { id: "three", label: "Support", content: <p className="text-muted-foreground">Third panel.</p> },
      ]}
    />
  );
}

export function TooltipDemo() {
  return (
    <Tooltip text="Extra context only. Anything essential belongs in the page text.">
      <Button type="button" variant="secondary">
        Hover or focus me
      </Button>
    </Tooltip>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  );
}
