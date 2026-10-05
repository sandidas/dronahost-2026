import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import Logo from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";
import Surface from "@/components/ui/Surface";
import { contrastRatio, type PairResult, type Theme, type TokenMap } from "@/lib/design/contrast";
import { cn } from "@/utils/cn";
import { BothThemes, SpecLabel, ThemePane } from "./_panes";

type Tokens = Record<Theme, TokenMap>;

const SWATCH_GROUPS: { label: string; names: string[] }[] = [
  { label: "Surfaces", names: ["background", "card", "surface-raised", "muted"] },
  { label: "Text", names: ["foreground", "muted-foreground", "subtle-foreground", "link"] },
  { label: "Action (orange) and accent (teal)", names: ["action", "action-hover", "action-active", "accent", "accent-hover"] },
  { label: "Semantic", names: ["success", "success-surface", "warning", "warning-surface", "danger", "danger-surface"] },
  { label: "Focus", names: ["ring"] },
];

function Swatch({ name, hex }: { name: string; hex?: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="size-10 shrink-0 rounded-lg border border-border-strong"
        style={{ background: `var(--${name})` }}
      />
      <span className="min-w-0 text-sm leading-tight">
        <span className="block truncate font-semibold text-foreground">{name}</span>
        <span className="block font-mono text-xs text-muted-foreground">{hex ?? "rgba"}</span>
      </span>
    </li>
  );
}

const BRAND_PALETTE: [string, string][] = [
  ["Orange (action)", "#FE5504"],
  ["Teal (secondary)", "#05A2C6"],
  ["Deep orange (light-theme text/fill)", "#C23700"],
  ["Deep teal (light-theme text/fill)", "#027280"],
  ["Navy", "#092F49"],
  ["Ink (dark base)", "#07131F"],
  ["Tint (light base)", "#F1FAFA"],
];

const FILL_TESTS: [string, string, string][] = [
  ["White on #FE5504", "#ffffff", "#FE5504"],
  ["White on #05A2C6", "#ffffff", "#05A2C6"],
  ["Ink #07131F on #FE5504", "#07131F", "#FE5504"],
  ["Ink #07131F on #05A2C6", "#07131F", "#05A2C6"],
];

export function ColorSection({ tokens }: { tokens: Tokens }) {
  return (
    <>
      <div>
        <SpecLabel>Brand palette (theme independent)</SpecLabel>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRAND_PALETTE.map(([label, hex]) => (
            <li key={hex} className="surface p-3">
              <span className="block h-14 rounded-lg border border-border-strong" style={{ background: hex }} />
              <span className="mt-2 block text-sm font-semibold text-foreground">{label}</span>
              <span className="block font-mono text-xs text-muted-foreground">{hex}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface p-6">
        <SpecLabel>Why brand fills never carry white text</SpecLabel>
        <ul className="grid gap-4 sm:grid-cols-2">
          {FILL_TESTS.map(([label, fg, bg]) => {
            const ratio = contrastRatio(fg, bg);
            return (
              <li key={label} className="flex items-center gap-4">
                <span
                  className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ color: fg, background: bg }}
                >
                  Aa
                </span>
                <span className="text-sm text-foreground">
                  {label}: <strong>{ratio.toFixed(2)}:1</strong>{" "}
                  <span className={ratio >= 4.5 ? "text-success" : "text-danger"}>
                    {ratio >= 4.5 ? "passes AA" : "fails AA (needs 4.5:1)"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="t-small mt-4 text-muted-foreground">
          Rule: bright brand fills take ink text. White text only sits on the deep shades (#C23700, #027280).
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {(["dark", "light"] as const).map((theme) => (
          <ThemePane key={theme} theme={theme}>
            <div className="space-y-6">
              {SWATCH_GROUPS.map((group) => (
                <div key={group.label}>
                  <SpecLabel>{group.label}</SpecLabel>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {group.names.map((name) => (
                      <Swatch key={name} name={name} hex={tokens[theme][name]} />
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <SpecLabel>Borders</SpecLabel>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <Swatch name="border" hex={theme === "dark" ? "white 8%" : "#cde0e3"} />
                  <Swatch name="border-strong" hex={theme === "dark" ? "white 16%" : "#a9c4ca"} />
                </ul>
              </div>
            </div>
          </ThemePane>
        ))}
      </div>
    </>
  );
}

export function ContrastSection({ results }: { results: PairResult[] }) {
  const failures = results.filter((r) => !r.pass).length;
  return (
    <>
      <p
        role="status"
        className={cn(
          "inline-flex rounded-2xl border px-4 py-2 text-sm font-semibold",
          failures === 0 ? "border-success/30 bg-success-surface text-success" : "border-danger/30 bg-danger-surface text-danger",
        )}
      >
        {results.length - failures} of {results.length} token pairs pass WCAG AA. Enforced by npm run check:contrast, which also runs
        before every build.
      </p>
      <details className="group rounded-2xl border border-border">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-foreground">
          Show all {results.length} pair results
        </summary>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-start text-sm">
          <caption className="sr-only">Contrast ratio of every text and background token pair, per theme</caption>
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 text-start font-semibold">Pair</th>
              <th scope="col" className="px-4 py-3 text-start font-semibold">Theme</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">Ratio</th>
              <th scope="col" className="px-4 py-3 text-end font-semibold">Needs</th>
              <th scope="col" className="px-4 py-3 text-start font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={`${r.theme}-${r.label}`} className="border-t border-border">
                <td className="px-4 py-2 text-foreground">{r.label}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.theme}</td>
                <td className="px-4 py-2 text-end font-mono text-foreground">{r.ratio.toFixed(2)}:1</td>
                <td className="px-4 py-2 text-end font-mono text-muted-foreground">{r.min}:1</td>
                <td className={cn("px-4 py-2 font-semibold", r.pass ? "text-success" : "text-danger")}>
                  {r.pass ? "Pass" : "Fail"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </details>
    </>
  );
}

const TYPE_SCALE = [
  { cls: "t-display", name: "Display", spec: "clamp 40 to 72px, lh 1.04, tracking -0.035em, Sora 600", sample: "Managed hosting, built calmly" },
  { cls: "t-h1", name: "H1", spec: "clamp 32 to 56px, lh 1.08, -0.03em", sample: "WordPress hosting for teams that ship" },
  { cls: "t-h2", name: "H2", spec: "clamp 28 to 44px, lh 1.12, -0.025em", sample: "Performance you can inspect" },
  { cls: "t-h3", name: "H3", spec: "clamp 20 to 28px, lh 1.25, -0.015em", sample: "Daily backups with 30-day retention" },
  { cls: "t-h4", name: "H4", spec: "18px, lh 1.35", sample: "Staging environments" },
  { cls: "t-lead", name: "Lead", spec: "clamp 18 to 21px, lh 1.6, max 62ch", sample: "A short, answer-first summary sits directly under the headline so readers and search engines get the point immediately." },
  { cls: "t-body", name: "Body", spec: "16 to 17px, lh 1.7, max 65ch", sample: "Body copy stays between sixteen and eighteen pixels with generous line height. Lines never run beyond roughly sixty-five characters, which keeps long paragraphs comfortable to read on every screen." },
  { cls: "t-small", name: "Small", spec: "14px, lh 1.55", sample: "Supporting detail such as footnotes and form hints." },
  { cls: "t-eyebrow", name: "Eyebrow", spec: "12px, uppercase, +0.14em, teal", sample: "Managed WordPress" },
];

export function TypeSection() {
  return (
    <>
      <BothThemes>
        <div className="space-y-8">
          {TYPE_SCALE.map((t) => (
            <div key={t.cls}>
              <SpecLabel>
                {t.name} · .{t.cls} · {t.spec}
              </SpecLabel>
              <p className={cn(t.cls, t.cls !== "t-eyebrow" && "text-foreground")}>{t.sample}</p>
            </div>
          ))}
          <div>
            <SpecLabel>One highlighted word per heading (teal)</SpecLabel>
            <p className="t-h2 text-foreground">
              Hosting that stays <GradientText>quietly fast</GradientText>
            </p>
          </div>
        </div>
      </BothThemes>
      <p className="t-small text-muted-foreground">
        Fonts: Manrope for UI and body, Sora for headlines, both via next/font with display swap and Latin subsets. Add the Arabic
        subset when the ar-AE locale ships.
      </p>
    </>
  );
}

const RADII = [
  ["rounded-md", "8px", "small controls"],
  ["rounded-lg", "12px", "buttons, inputs"],
  ["rounded-xl", "16px", "cards"],
  ["rounded-2xl", "24px", "panels, hero mockups"],
];
const SHADOWS = ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"];
const SPACES = [8, 16, 24, 32, 48, 64, 96, 144];

export function LayoutSection() {
  return (
    <BothThemes>
      <div className="space-y-10">
        <div>
          <SpecLabel>Radius scale (12 / 16 / 24, plus 8 for small controls)</SpecLabel>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RADII.map(([cls, px, use]) => (
              <li key={cls} className="text-sm text-foreground">
                <span className={cn("block h-20 border border-border-strong bg-surface-raised", cls)} />
                <span className="mt-2 block font-semibold">{px}</span>
                <span className="block text-xs text-muted-foreground">{use}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SpecLabel>Shadows (soft, multi-layer)</SpecLabel>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            {SHADOWS.map((cls) => (
              <li key={cls} className="text-center text-xs text-muted-foreground">
                <span className={cn("mb-2 block h-16 rounded-xl border border-border bg-surface-raised", cls)} />
                {cls}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SpecLabel>Spacing on an 8px grid. Section padding runs 64px (mobile) to 144px (wide)</SpecLabel>
          <ul className="space-y-2">
            {SPACES.map((px) => (
              <li key={px} className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="w-12 font-mono">{px}px</span>
                <span className="h-3 max-w-full rounded bg-accent" style={{ width: px }} />
              </li>
            ))}
          </ul>
          <p className="t-small mt-3 text-muted-foreground">
            Container max-width 1280px with a fluid 16 to 32px gutter (.container-site). Section rhythm: .section-y.
          </p>
        </div>
      </div>
    </BothThemes>
  );
}

const VARIANTS = ["primary", "secondary", "ghost", "link"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SIZE_LABEL = { sm: "Small", md: "Medium", lg: "Large" } as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Variant = (typeof VARIANTS)[number];

const STATES: { label: string; node: (v: Variant) => React.ReactNode }[] = [
  { label: "Default", node: (v) => <Button href="#buttons" variant={v}>Default</Button> },
  { label: "Hover", node: (v) => <Button href="#buttons" variant={v} className="is-hover">Hover</Button> },
  { label: "Focus-visible", node: (v) => <Button href="#buttons" variant={v} className="is-focus">Focus</Button> },
  { label: "Active", node: (v) => <Button href="#buttons" variant={v} className="is-active">Active</Button> },
  { label: "Disabled", node: (v) => <Button href="#buttons" variant={v} disabled>Disabled</Button> },
  { label: "Loading", node: (v) => <Button type="button" variant={v} loading>Loading</Button> },
];

export function ButtonSection() {
  return (
    <BothThemes>
      <div className="space-y-10">
        <div>
          <SpecLabel>Variants and sizes (sm 40px with 44px hit area, md 48px, lg 56px)</SpecLabel>
          <div className="space-y-4">
            {VARIANTS.map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{v}</span>
                {SIZES.map((s) => (
                  <Button key={s} href="#buttons" variant={v} size={s}>
                    {SIZE_LABEL[s]}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <SpecLabel>With icon, and full width</SpecLabel>
          <div className="max-w-sm space-y-3">
            <Button href="#buttons" trailingIcon={<ArrowIcon />} fullWidth>View plans</Button>
            <Button href="#buttons" variant="secondary" fullWidth>Talk to an expert</Button>
          </div>
          <p className="t-small mt-3 text-muted-foreground">
            One primary action per section. Everything else is secondary, ghost or link.
          </p>
        </div>
      </div>
    </BothThemes>
  );
}

export function ButtonStatesSection() {
  return (
    <div className="space-y-6">
      {(["dark", "light"] as const).map((theme) => (
        <ThemePane key={theme} theme={theme}>
        <div>
          <SpecLabel>States</SpecLabel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">Button states per variant</caption>
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="py-2 pe-3 text-start font-semibold">State</th>
                  {VARIANTS.map((v) => (
                    <th key={v} scope="col" className="px-2 py-2 text-start font-semibold">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STATES.map((s) => (
                  <tr key={s.label}>
                    <th scope="row" className="py-2 pe-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </th>
                    {VARIANTS.map((v) => (
                      <td key={v} className="px-2 py-2">{s.node(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </ThemePane>
      ))}
    </div>
  );
}

export function SurfaceSection() {
  return (
    <BothThemes>
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Surface>
            <h3 className="t-h4 text-foreground">Surface</h3>
            <p className="t-small mt-2 text-muted-foreground">Hairline border, inner highlight, soft shadow.</p>
          </Surface>
          <Surface variant="raised">
            <h3 className="t-h4 text-foreground">Raised</h3>
            <p className="t-small mt-2 text-muted-foreground">One step up for featured content.</p>
          </Surface>
          <Surface as="article" interactive>
            <h3 className="t-h4 text-foreground">Interactive</h3>
            <p className="t-small mt-2 text-muted-foreground">Lifts 2px on hover over 200ms. Hover me.</p>
          </Surface>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-4">
            <div className="ambient-glow absolute inset-0" aria-hidden="true" />
            <Surface variant="glass" className="relative">
              <h3 className="t-h4 text-foreground">Glass</h3>
              <p className="t-small mt-2 text-muted-foreground">Translucent. Used sparingly, over ambient glow only.</p>
            </Surface>
          </div>
        </div>
        <div>
          <SpecLabel>Badges</SpecLabel>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </div>
      </div>
    </BothThemes>
  );
}

export function ImagerySection() {
  return (
    <>
      <BothThemes>
        <div className="space-y-6">
          <div>
            <SpecLabel>Ambient glow (teal and orange at 10 to 14% opacity)</SpecLabel>
            <div className="ambient-glow relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-border">
              <p className="t-h3 text-foreground">Calm, not loud</p>
            </div>
          </div>
          <div>
            <SpecLabel>Hairline grid, masked to the centre</SpecLabel>
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-border">
              <div className="bg-grid absolute inset-0" aria-hidden="true" />
              <p className="t-h3 relative px-4 text-center text-foreground">Infrastructure, drawn in hairlines</p>
            </div>
          </div>
        </div>
      </BothThemes>
      <p className="t-small text-muted-foreground">
        Phase 3 replaces every placeholder image with inline SVG illustrations and CSS or SVG product mockups built on these two
        backgrounds. Raster images use next/image with explicit width and height.
      </p>
    </>
  );
}

const MOTION_TOKENS = [
  ["--dur-fast", "150ms", "hover colour and border changes"],
  ["--dur", "200ms", "shadow and lift"],
  ["--dur-slow", "250ms", "scroll-in reveal"],
  ["--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "all transitions"],
];

export function MotionSection() {
  return (
    <ThemePane theme="dark">
      <ul className="grid gap-3 sm:grid-cols-2">
        {MOTION_TOKENS.map(([name, value, use]) => (
          <li key={name} className="surface p-4 text-sm">
            <code className="font-mono font-semibold text-foreground">{name}</code>
            <span className="block break-words text-muted-foreground">{value}</span>
            <span className="block text-xs text-subtle-foreground">{use}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <SpecLabel>Scroll-in: fades and lifts once, no layout shift (scroll to see)</SpecLabel>
        <Reveal className="surface p-6">
          <p className="t-body text-foreground">
            This card is in the server HTML. If it starts below the fold, it fades in a single time. With reduced motion enabled it
            simply appears.
          </p>
        </Reveal>
      </div>
    </ThemePane>
  );
}

export function LogoSection() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ThemePane theme="dark">
        <div className="p-4 sm:p-8">
          <Logo size="lg" />
        </div>
      </ThemePane>
      <ThemePane theme="light">
        <div className="p-4 sm:p-8">
          <Logo size="lg" />
        </div>
      </ThemePane>
      <ul className="t-small list-disc space-y-1 ps-5 text-muted-foreground xl:col-span-2">
        <li>Official SVG only (docs/reference/brand/dronaHost-logo.svg). The component takes no colour or filter props.</li>
        <li>Never recolour, add gradients, shadows or other effects, stretch, rotate, outline, reverse or repeat it as a pattern.</li>
        <li>Never place it on an orange, teal or similar-coloured background. Keep generous clear space around it.</li>
      </ul>
    </div>
  );
}
