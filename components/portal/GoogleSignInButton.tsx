"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { SIGN_IN_TEXT } from "@/content/portal-strings";

/** Starts Google sign-in. The callback page then sends each role to its portal. */
export function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-primary w-full"
      aria-busy={busy}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signIn("google", { callbackUrl });
      }}
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.06-1.06-.15-1.51Z" />
      </svg>
      {SIGN_IN_TEXT.google}
    </button>
  );
}
