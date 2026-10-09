import { Fragment, type ReactNode } from "react";
import { defaultContext, type ResolveContext } from "./refs";
import { visibleSections } from "./page";
import { SECTION_REGISTRY } from "./registry";
import type { PageSpecData } from "./schemas/page";
import type { SectionSpec } from "./schemas/sections";

export { parsePage, visibleSections } from "./page";

/** The page body: each visible section through the registry. Server-rendered, no client fetching. */
export function renderPage(spec: PageSpecData, ctx: ResolveContext = defaultContext): ReactNode {
  const sections = visibleSections(spec, ctx).map((section) => {
    const entry = SECTION_REGISTRY[section.type] as { render: (s: SectionSpec, c: ResolveContext) => ReactNode };
    return <Fragment key={section.id}>{entry.render(section, ctx)}</Fragment>;
  });
  // `.page-tones` gives every second section a tinted band (app/styles/tokens.css), counted over the sections that really render,
  // so two neighbours never share a background even when a section hides itself.
  return <div className="page-tones">{sections}</div>;
}
