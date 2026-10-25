import { Fragment, type ReactNode } from "react";
import { defaultContext, type ResolveContext } from "./refs";
import { visibleSections } from "./page";
import { pageLook, SECTION_REGISTRY, type PageLook } from "./registry";
import type { PageSpecData } from "./schemas/page";
import type { SectionSpec } from "./schemas/sections";

export { parsePage, visibleSections } from "./page";

/** The page body: each visible section through the registry. Server-rendered, no client fetching. */
export function renderPage(spec: PageSpecData, ctx: ResolveContext = defaultContext): ReactNode {
  // The hero sets the look of the whole page (the console hero brings the Home look to the shared sections).
  const look = pageLook(spec.sections as SectionSpec[]);
  const sections = visibleSections(spec, ctx).map((section) => {
    const entry = SECTION_REGISTRY[section.type] as { render: (s: SectionSpec, c: ResolveContext, l: PageLook) => ReactNode };
    return <Fragment key={section.id}>{entry.render(section, ctx, look)}</Fragment>;
  });
  // `.page-tones` gives every second section a tinted band (app/styles/tokens.css), counted over the sections that really render,
  // so two neighbours never share a background even when a section hides itself. A section with its own `data-tone` (the ink
  // bands of the Home look) keeps it.
  return <div className="page-tones">{sections}</div>;
}
