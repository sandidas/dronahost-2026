import { cn } from "@/utils/cn";

/**
 * Original line illustration for the migration section: a website parcel arriving by parachute at its new home (a browser
 * window with a check), between clouds, on a dot texture. Drawn in code so it follows the theme: lines use `currentColor`
 * (set by the parent's text colour), fills use the theme tokens (accent teal, action orange, card). Decorative: the section
 * describes the steps in text, so this carries `aria-hidden`.
 */
export default function MigrationIllustration({ className }: { className?: string }) {
  const dots: [number, number][] = [];
  for (let x = 24; x < 640; x += 36) for (let y = 20; y < 360; y += 36) dots.push([x, y]);

  return (
    <svg viewBox="0 0 640 360" aria-hidden="true" focusable="false" className={cn("h-auto w-full text-foreground", className)} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Dot texture */}
      <g fill="var(--border-strong)" opacity="0.55">
        {dots.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
        ))}
      </g>

      {/* Clouds */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.55">
        <path d="M34 92h86a14 14 0 0 0-10-24 22 22 0 0 0-40-6 16 16 0 0 0-26 10 10 10 0 0 0-10 20z" fill="var(--card)" />
        <path d="M402 46h70a12 12 0 0 0-8-20 18 18 0 0 0-33-5 13 13 0 0 0-21 8 8 8 0 0 0-8 17z" fill="var(--card)" />
      </g>

      {/* Motion marks */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.45">
        <path d="M60 160h44M96 166h10" />
        <path d="M300 128h36M300 134h10" />
        <path d="M318 282h34M310 288h12" />
      </g>

      {/* The path the parcel travels */}
      <path d="M190 250 C 260 300, 330 300, 392 236" stroke="var(--accent)" strokeWidth="2" strokeDasharray="2 9" opacity="0.9" />

      {/* Parachute canopy */}
      <path d="M96 118 C 106 54, 186 26, 236 54 C 270 72, 286 102, 284 124 L 262 112 L 240 132 L 214 108 L 188 130 L 162 106 L 134 128 L 114 108 Z" fill="var(--accent)" fillOpacity="0.88" stroke="currentColor" strokeWidth="1.4" />
      <path d="M150 58 C 140 80, 136 100, 134 128 M196 40 C 196 70, 192 100, 188 130 M240 56 C 248 80, 248 100, 240 132" stroke="var(--card)" strokeWidth="1.4" opacity="0.7" />
      {/* Strings */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.6">
        <path d="M114 108 L 150 196 M162 106 L 158 192 M214 108 L 214 192 M262 112 L 236 198" />
      </g>

      {/* The parcel: your website */}
      <g stroke="currentColor" strokeWidth="1.4">
        <path d="M140 192 L 248 198 L 242 288 L 134 282 Z" fill="var(--card)" />
        <path d="M140 192 L 154 178 L 260 184 L 248 198" fill="var(--surface-raised)" />
        <path d="M260 184 L 254 274 L 242 288" fill="var(--surface-raised)" />
        <path d="M186 195 L 182 285 M200 195 L 196 286" />
        <path d="M200 181 L 214 182 L 210 196 L 196 195 Z" fill="var(--action-fill)" stroke="none" />
        {/* A tiny page on the parcel */}
        <rect x="150" y="214" width="24" height="18" rx="2" fill="var(--surface-raised)" />
        <path d="M154 220h16M154 225h10" opacity="0.7" />
      </g>

      {/* The new home: a browser window with a check */}
      <g stroke="currentColor" strokeWidth="1.4">
        <rect x="392" y="136" width="208" height="150" rx="14" fill="var(--card)" />
        <path d="M392 164 H 600" />
        <circle cx="410" cy="150" r="3.5" fill="var(--action-fill)" stroke="none" />
        <circle cx="424" cy="150" r="3.5" fill="var(--accent)" stroke="none" />
        <circle cx="438" cy="150" r="3.5" fill="var(--border-strong)" stroke="none" />
        <rect x="412" y="180" width="96" height="10" rx="5" fill="var(--surface-raised)" />
        <rect x="412" y="200" width="160" height="7" rx="3.5" fill="var(--surface-raised)" stroke="none" />
        <rect x="412" y="214" width="136" height="7" rx="3.5" fill="var(--surface-raised)" stroke="none" />
        <rect x="412" y="236" width="74" height="30" rx="8" fill="var(--surface-raised)" />
        <rect x="496" y="236" width="74" height="30" rx="8" fill="var(--surface-raised)" />
      </g>
      {/* Check badge */}
      <circle cx="590" cy="140" r="22" fill="var(--accent)" stroke="currentColor" strokeWidth="1.4" />
      <path d="M580 140 l7 7 l13 -14" stroke="var(--accent-foreground)" strokeWidth="3" />

      {/* Ground line */}
      <path d="M110 318 H 610" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}
