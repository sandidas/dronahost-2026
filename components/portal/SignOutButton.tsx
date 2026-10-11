"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { PORTAL_TEXT } from "@/content/portal-strings";

/** Ends the database session and returns to the sign-in page. */
export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      aria-busy={busy}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOut({ callbackUrl: "/sign-in" });
      }}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {PORTAL_TEXT.signOut}
    </button>
  );
}
