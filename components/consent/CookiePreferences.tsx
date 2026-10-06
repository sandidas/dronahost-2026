"use client";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { ACCEPT_ALL, REJECT_ALL, type ConsentChoices } from "@/lib/consent";
import { cn } from "@/utils/cn";

const CATEGORIES: { key: keyof ConsentChoices; title: string; body: string }[] = [
  { key: "preferences", title: "Preferences", body: "Remember choices such as your currency and theme." },
  { key: "analytics", title: "Analytics", body: "Help us understand which pages are useful. Data is aggregated." },
  { key: "marketing", title: "Marketing", body: "Measure and personalize advertising. We do not run any today." },
];

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange?: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors motion-reduce:transition-none disabled:opacity-60",
        checked ? "border-transparent bg-accent" : "border-border-strong bg-muted",
      )}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start] motion-reduce:transition-none", checked ? "start-[1.5rem]" : "start-0.5")} />
    </button>
  );
}


type Props = {
  open: boolean;
  onClose: () => void;
  draft: ConsentChoices;
  setDraft: React.Dispatch<React.SetStateAction<ConsentChoices>>;
  decide: (choices: ConsentChoices) => void;
};

export default function CookiePreferences({ open, onClose, draft, setDraft, decide }: Props) {
  return (
      <Dialog open={open} onClose={onClose} title="Cookie preferences" description="Choose which optional cookies we may use. Necessary cookies are always on because the site cannot work without them.">
        <ul className="space-y-5">
          <li className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Necessary</p>
              <p className="t-small text-muted-foreground">Security, theme and remembering this choice.</p>
            </div>
            <Toggle checked disabled label="Necessary cookies (always on)" />
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">{c.title}</p>
                <p className="t-small text-muted-foreground">{c.body}</p>
              </div>
              <Toggle checked={draft[c.key]} onChange={(v) => setDraft((d) => ({ ...d, [c.key]: v }))} label={`${c.title} cookies`} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" onClick={() => decide(REJECT_ALL)}>
            Reject all
          </Button>
          <Button type="button" variant="secondary" onClick={() => decide(ACCEPT_ALL)}>
            Accept all
          </Button>
          <Button type="button" onClick={() => decide(draft)}>
            Save choices
          </Button>
        </div>
      </Dialog>
  );
}
