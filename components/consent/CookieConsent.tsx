"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
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

// The preferences dialog is only needed once the visitor opens it, so it loads on demand.
const CookiePreferences = dynamic(() => import("./CookiePreferences"), { ssr: false });

/**
 * Consent banner and preferences dialog. Accept all and Reject all are the same size and
 * style (EU rule: refusing must be as easy as accepting). Nothing non-essential runs until
 * the visitor chooses. The footer "Cookie settings" button reopens the dialog.
 */
export default function CookieConsent() {
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, () => "pending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMounted, setDialogMounted] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(REJECT_ALL);
  const descId = useId();

  useEffect(() => {
    const open = () => {
      const current = readConsent();
      setDraft(current ? { preferences: current.preferences, analytics: current.analytics, marketing: current.marketing } : REJECT_ALL);
      setDialogMounted(true);
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

      {dialogMounted && (
        <CookiePreferences open={dialogOpen} onClose={() => setDialogOpen(false)} draft={draft} setDraft={setDraft} decide={decide} />
      )}
    </>
  );
}
