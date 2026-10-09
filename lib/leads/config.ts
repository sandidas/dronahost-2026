/**
 * Where a free-migration request goes. Change this one object to point the form somewhere else.
 *
 * - "mailto": opens the visitor's email app with the request filled in. No server, no database. Needs `COMPANY.supportEmail`.
 * - "route": POSTs the request as JSON to `routeUrl`. Use it for an email route or for WHMCS: make a server route that calls
 *   WHMCS (its OpenTicket API) with credentials kept on the server, and set `routeUrl` to that route.
 */
import { COMPANY } from "@/content/company";

export type LeadDestination = { mode: "mailto"; to: string | null } | { mode: "route"; routeUrl: string };

export const LEAD_DESTINATION: LeadDestination = { mode: "mailto", to: COMPANY.supportEmail };

/** True when a request has somewhere to go. */
export const isLeadDestinationConfigured = (d: LeadDestination = LEAD_DESTINATION): boolean => (d.mode === "mailto" ? Boolean(d.to) : Boolean(d.routeUrl));

/** The page shows the form when it can send, and in development so the design can be reviewed before an address is set. */
export const leadFormReady = (): boolean => isLeadDestinationConfigured() || process.env.NODE_ENV === "development";
