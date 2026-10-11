"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { PORTAL_TEXT, TEAM_TEXT } from "@/content/portal-strings";
import { ROLES } from "@/lib/auth/roles";
import { inviteMemberAction } from "@/lib/portal/actions/team";
import { errorClass, helpClass, inputClass, labelClass, panelClass } from "./field-styles";

/** Adds a member by email with a role, before or after they have signed in. */
export function InviteForm({ onDone }: { onDone: (text: string, ok: boolean) => void }) {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<number>(ROLES.STAFF);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      aria-labelledby={`${id}-heading`}
      className={panelClass}
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await inviteMemberAction(email, role);
          if (!res.ok) {
            setError(res.error);
            onDone(res.error, false);
            return;
          }
          setEmail("");
          onDone(res.data === "updated" ? TEAM_TEXT.invite.updated : TEAM_TEXT.invite.added, true);
          router.refresh();
        });
      }}
    >
      <h2 id={`${id}-heading`} className="t-h4 text-foreground">
        {TEAM_TEXT.invite.heading}
      </h2>
      <p className={helpClass}>{TEAM_TEXT.invite.body}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            {TEAM_TEXT.invite.email}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            required
            autoComplete="off"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-err`}
            className={`${inputClass} h-11`}
          />
        </div>
        <div>
          <label htmlFor={`${id}-role`} className={labelClass}>
            {TEAM_TEXT.invite.role}
          </label>
          <select id={`${id}-role`} value={role} onChange={(e) => setRole(Number(e.target.value))} className={`${inputClass} h-11`}>
            <option value={ROLES.STAFF}>{PORTAL_TEXT.roles[ROLES.STAFF]}</option>
            <option value={ROLES.ADMIN}>{PORTAL_TEXT.roles[ROLES.ADMIN]}</option>
          </select>
        </div>
      </div>
      <p id={`${id}-err`} className={error ? errorClass : "sr-only"}>
        {error ?? ""}
      </p>
      <button type="submit" className="btn btn-primary btn-sm mt-4" disabled={pending} aria-busy={pending}>
        {TEAM_TEXT.invite.submit}
      </button>
    </form>
  );
}
