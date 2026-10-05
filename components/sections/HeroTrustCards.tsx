// ─── PageSpeed score chip ─────────────────────────────────────────────────────

const R = 24;
const CIRC = 2 * Math.PI * R;
const SCORE = 98;
const DASH_OFFSET = CIRC * (1 - SCORE / 100);

function PageSpeedChip() {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-[var(--card)] px-4 py-3 shadow-xl shadow-black/10 ring-1 ring-[var(--border)]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        PageSpeed
      </p>
      <div className="relative h-[54px] w-[54px]">
        <svg width="54" height="54" viewBox="0 0 54 54" className="-rotate-90" aria-hidden="true">
          <circle
            cx="27" cy="27" r={R}
            fill="none" strokeWidth="4"
            className="[stroke:var(--border)]"
          />
          <circle
            cx="27" cy="27" r={R}
            fill="none" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={DASH_OFFSET}
            className="stroke-emerald-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">
          {SCORE}
        </span>
      </div>
      <p className="text-center text-[9px] leading-tight text-[var(--muted-foreground)]">
        Top 4%<br />globally
      </p>
    </div>
  );
}

// ─── "Website secure" pill ────────────────────────────────────────────────────

function SecureBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 shadow-lg shadow-emerald-500/30">
      <svg
        width="13" height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span className="text-sm font-semibold text-white">Website secure</span>
    </div>
  );
}

// ─── Backup toast ─────────────────────────────────────────────────────────────

function BackupToast() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[var(--card)] px-3.5 py-2.5 shadow-lg shadow-black/10 ring-1 ring-[var(--border)]">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <svg
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </span>
      <div>
        <p className="text-xs font-semibold text-foreground">
          Daily backup saved
        </p>
        <p className="text-[10px] text-[var(--muted-foreground)]">
          2 hours ago · 1-click restore
        </p>
      </div>
    </div>
  );
}

// ─── Main status card ─────────────────────────────────────────────────────────

const statusRows = [
  {
    label: "SSL certificate",
    value: "Active & valid",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Page speed",
    value: "Under 1 second",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Daily backups",
    value: "Automatic",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
] as const;

function MainCard() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[var(--card)]/90 shadow-2xl shadow-black/10 ring-1 ring-[var(--border)] backdrop-blur-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b bg-[var(--muted)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400"     aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400"   aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded-md bg-[var(--card)]/70 px-2.5 py-1 text-[11px] text-[var(--muted-foreground)]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-emerald-500" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          yourbusiness.com
        </div>
      </div>

      {/* Running status */}
      <div className="flex items-center gap-2.5 border-b px-4 py-3.5">
        <span
          className="h-2 w-2 shrink-0 motion-safe:animate-pulse rounded-full bg-emerald-500"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-foreground">
          Your website is running perfectly
        </span>
      </div>

      {/* Status rows */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {statusRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[13px] text-[var(--muted-foreground)]">
              <span className="text-[var(--muted-foreground)]" aria-hidden="true">
                {row.icon}
              </span>
              {row.label}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composition ──────────────────────────────────────────────────────────────

export default function HeroTrustCards() {
  return (
    <div
      role="img"
      aria-label="DronaHost hosting dashboard showing 99.95% uptime, active SSL, and daily backups"
      className="relative w-full max-w-[360px] select-none"
      style={{ height: "318px", minWidth: 0 }}
    >
      {/* PageSpeed chip — top left, overlaps main card */}
      <div className="stats-card-float absolute left-0 top-6 z-20">
        <PageSpeedChip />
      </div>

      {/* Secure badge — top right */}
      <div
        className="stats-card-float absolute right-0 top-0 z-20"
        style={{ animationDelay: "0.9s" }}
      >
        <SecureBadge />
      </div>

      {/* Main card — right side, behind chips */}
      <div className="absolute bottom-0 left-16 right-0 top-10 z-10">
        <MainCard />
      </div>

      {/* Backup toast — bottom left, overlaps main card */}
      <div
        className="stats-card-float absolute bottom-4 left-0 z-20"
        style={{ animationDelay: "1.6s" }}
      >
        <BackupToast />
      </div>
    </div>
  );
}
