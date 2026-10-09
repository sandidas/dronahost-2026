/**
 * The one function that sends a free-migration request. Every form calls this and nothing else, so changing where requests go
 * means changing `LEAD_DESTINATION` in ./config.ts, not the form.
 */
import { LEAD_DESTINATION, type LeadDestination, isLeadDestinationConfigured } from "./config";
import { type MigrationRequestData, requestToEmail } from "./migration-request";

export type SubmitResult =
  | { ok: true; via: "mailto"; href: string }
  | { ok: true; via: "route" }
  | { ok: false; reason: "not-configured" | "network" | "rejected" };

export async function submitMigrationRequest(data: MigrationRequestData, destination: LeadDestination = LEAD_DESTINATION): Promise<SubmitResult> {
  // A filled honeypot is a bot. Say "sent" and send nothing, so the bot learns nothing.
  if (data.website) return destination.mode === "mailto" ? { ok: true, via: "mailto", href: "" } : { ok: true, via: "route" };
  if (!isLeadDestinationConfigured(destination)) return { ok: false, reason: "not-configured" };

  if (destination.mode === "mailto") {
    const { subject, body } = requestToEmail(data);
    return { ok: true, via: "mailto", href: `mailto:${destination.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
  }

  try {
    const { website: _honeypot, ...payload } = data;
    const res = await fetch(destination.routeUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return res.ok ? { ok: true, via: "route" } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
