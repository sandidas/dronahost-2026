/** Emails in ADMIN_EMAILS (comma-separated) always sign in as admins and cannot be demoted from the team screen. */
export function adminEmails(): ReadonlySet<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const isEnvAdmin = (email: string | null | undefined): boolean => Boolean(email) && adminEmails().has(String(email).toLowerCase());
