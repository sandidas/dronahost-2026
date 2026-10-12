"use server";

import type { ReactNode } from "react";
import { PORTAL_ERRORS } from "@/content/portal-strings";
import { can } from "@/lib/auth/permissions";
import { getActor } from "@/lib/auth/session";
import type { PostKind } from "@/lib/builder/model";
import { renderSiteSection } from "@/lib/builder/render";
import { parseBuilderDoc } from "@/lib/builder/validate";

export type SitePreview = { ok: true; node: ReactNode } | { ok: false; problems: string[] };

/**
 * Renders one site section for the editor canvas with the real section component, so the canvas matches the live page.
 * The block arrives as a JSON string (server-action serialisation would otherwise reshape nested data) and passes the
 * same structural check as a save. Nothing is stored.
 */
export async function previewSiteBlockAction(kind: PostKind, rawBlock: string): Promise<SitePreview> {
  const actor = await getActor();
  if (!actor || !can(actor.role, "post.view")) return { ok: false, problems: [PORTAL_ERRORS.signedOut] };
  if (typeof rawBlock !== "string" || rawBlock.length > 256 * 1024) return { ok: false, problems: [PORTAL_ERRORS.generic] };
  let block: unknown;
  try {
    block = JSON.parse(rawBlock);
  } catch {
    return { ok: false, problems: [PORTAL_ERRORS.generic] };
  }
  const parsed = parseBuilderDoc({ version: 1, blocks: [block] }, kind === "page" ? "page" : "post");
  if (!parsed.ok) return { ok: false, problems: [parsed.error] };
  const site = parsed.doc.blocks[0];
  if (site?.type !== "site") return { ok: false, problems: [PORTAL_ERRORS.generic] };
  const { node, problems } = renderSiteSection(site);
  return node ? { ok: true, node } : { ok: false, problems: problems.length ? problems : [] };
}
