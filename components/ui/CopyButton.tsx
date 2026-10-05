"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies text to the clipboard and confirms politely via an aria-live region. */
export default function CopyButton({ text, label = "Copy code" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: leave the button unchanged */
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-ghost btn-sm gap-2 !text-muted-foreground hover:!text-foreground">
      {copied ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span>{copied ? "Copied" : label}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
