import { readFileSync } from "node:fs";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { evaluate, parseTokens } from "@/lib/design/contrast";
import { DsSection } from "./_panes";
import {
  ButtonSection,
  ButtonStatesSection,
  ColorSection,
  ContrastSection,
  ImagerySection,
  LayoutSection,
  LogoSection,
  MotionSection,
  SurfaceSection,
  TypeSection,
} from "./_sections";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const NAV = [
  ["color", "Color"],
  ["contrast", "Contrast"],
  ["type", "Type"],
  ["layout", "Radius, shadow, spacing"],
  ["buttons", "Buttons"],
  ["surfaces", "Cards and badges"],
  ["imagery", "Imagery"],
  ["motion", "Motion"],
  ["logo", "Logo"],
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  const tokens = parseTokens(readFileSync("app/styles/tokens.css", "utf8"));
  const results = evaluate(tokens);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container-site flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <Link href="/v2" className="text-sm font-semibold text-foreground">
            DronaHost /v2
          </Link>
          <nav aria-label="Design system sections" className="flex flex-wrap gap-x-4 gap-y-1">
            {NAV.map(([id, label]) => (
              <Link key={id} href={`#${id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="container-site pb-24">
        <div className="ambient-glow pb-8 pt-16">
          <p className="t-eyebrow">DronaHost design system</p>
          <h1 className="t-h1 mt-3 max-w-3xl text-foreground">Calm, precise, and built to be trusted</h1>
          <p className="t-lead mt-4">
            Tokens, type, buttons and surfaces for the v2 rebuild. Dark is the default theme; both themes are shown side by side.
            Orange is reserved for the single primary action; teal carries links and data accents.
          </p>
        </div>

        <DsSection id="color" title="Color" intro="Navy-derived surfaces, one orange action color, one teal secondary. No other hues.">
          <ColorSection tokens={tokens} />
        </DsSection>
        <DsSection
          id="contrast"
          title="Contrast"
          intro="Every text and background token pair is checked against WCAG 2.2 AA (4.5:1 for text, 3:1 for the focus ring)."
        >
          <ContrastSection results={results} />
        </DsSection>
        <DsSection
          id="type"
          title="Typography"
          intro="Fluid scale with tight tracking and balanced wrapping. Body stays at 16 to 17px on a 1.7 line height."
        >
          <TypeSection />
        </DsSection>
        <DsSection id="layout" title="Radius, shadow and spacing">
          <LayoutSection />
        </DsSection>
        <DsSection id="buttons" title="Buttons" intro="Primary, secondary, ghost and link, in three sizes. Minimum 44px touch target.">
          <ButtonSection />
          <ButtonStatesSection />
        </DsSection>
        <DsSection id="surfaces" title="Cards and badges">
          <SurfaceSection />
        </DsSection>
        <DsSection id="imagery" title="Imagery foundations">
          <ImagerySection />
        </DsSection>
        <DsSection id="motion" title="Motion">
          <MotionSection />
        </DsSection>
        <DsSection id="logo" title="Logo">
          <LogoSection />
        </DsSection>
      </main>
    </div>
  );
}
