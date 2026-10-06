"use client";

import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import {
  ACCEPT_ALL,
  OPEN_SETTINGS_EVENT,
  REJECT_ALL,
  consentSnapshot,
  readConsent,
  saveConsent,
  subscribeConsent,
  type ConsentChoices,
} from "@/lib/consent";
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

/**
 * Consent banner and preferences dialog. Accept all and Reject all are the same size and
 * style (EU rule: refusing must be as easy as accepting). Nothing non-essential runs until
 * the visitor chooses. The footer "Cookie settings" button reopens the dialog.
 */
export default function CookieConsent() {
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, () => "pending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(REJECT_ALL);
  const descId = useId();

  useEffect(() => {
    const open = () => {
      const current = readConsent();
      setDraft(current ? { preferences: current.preferences, analytics: current.analytics, marketing: current.marketing } : REJECT_ALL);
      setDialogOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  const decide = (choices: ConsentChoices) => {
    saveConsent(choices);
    setDialogOpen(false);
  };

  const showBanner = raw === "";
  return (
    <>
      {showBanner && (
        <section aria-label="Cookie consent" aria-describedby={descId} className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
          <div className="surface surface-raised mx-auto max-w-4xl p-5 sm:p-6">
            <p className="t-h4 text-foreground">Your privacy choices</p>
            <p id={descId} className="t-small mt-2 text-muted-foreground">
              We use necessary cookies to run the site. With your permission we also use optional cookies for preferences, analytics and marketing. You can change this at any time.{" "}
              <Link href="/privacy" className="font-semibold text-foreground underline underline-offset-4">
                Privacy policy
              </Link>
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button" variant="secondary" onClick={() => decide(REJECT_ALL)} className="sm:min-w-40">
                Reject all
              </Button>
              <Button type="button" variant="secondary" onClick={() => decide(ACCEPT_ALL)} className="sm:min-w-40">
                Accept all
              </Button>
              <Button type="button" variant="link" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className="sm:ms-auto">
                Manage preferences
              </Button>
            </div>
          </div>
        </section>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Cookie preferences" description="Choose which optional cookies we may use. Necessary cookies are always on because the site cannot work without them.">
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
    </>
  );
}
