import { Link } from "@/i18n/link";
import Button from "@/components/ui/Button";
import {
  HELP_PANEL,
  HOSTING_LINKS,
  SERVICE_LINKS,
  type NavLink,
} from "@/content/navigation";
import NavIcon from "./NavIcon";

type HostingMegaMenuProps = {
  id: string;
  open: boolean;
  /** Called after a link is chosen so the parent can close the panel. */
  onNavigate: () => void;
};

function MegaItem({
  item,
  onNavigate,
}: {
  item: NavLink;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface-raised text-link transition-colors group-hover:border-accent">
          <NavIcon name={item.icon} />
        </span>
        <span>
          <span className="block text-base font-semibold leading-snug text-foreground">
            {item.label}
          </span>
          {item.description && (
            <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

/**
 * Hosting mega menu. Always in the DOM (hidden via the `hidden` attribute when closed)
 * so every link is present in the initial HTML for crawlers; it is removed from the
 * accessibility tree and tab order while hidden.
 */
export default function HostingMegaMenu({
  id,
  open,
  onNavigate,
}: HostingMegaMenuProps) {
  return (
    <div id={id} hidden={!open} className="absolute inset-x-0 top-full z-50">
      <div className="mx-auto max-w-(--container-max) px-4 pt-2 sm:px-6 lg:px-8">
        <div className="surface surface-raised grid gap-2 p-4 shadow-lg lg:grid-cols-[1.15fr_1fr_0.9fr] lg:gap-6 lg:p-6">
          <nav aria-label="Hosting">
            <p className="t-eyebrow px-3 pb-2">Hosting</p>
            <ul>
              {HOSTING_LINKS.map((item) => (
                <MegaItem key={item.href} item={item} onNavigate={onNavigate} />
              ))}
            </ul>
          </nav>
          <nav
            aria-label="Web services"
            className="lg:border-s lg:border-border lg:ps-6"
          >
            <p className="t-eyebrow px-3 pb-2">Web services</p>
            <ul>
              {SERVICE_LINKS.map((item) => (
                <MegaItem key={item.href} item={item} onNavigate={onNavigate} />
              ))}
            </ul>
          </nav>
          <aside className="rounded-xl border border-border bg-muted p-5 lg:self-start">
            <p className="t-h4 text-foreground">{HELP_PANEL.title}</p>
            <p className="t-small mt-2 text-muted-foreground">
              {HELP_PANEL.body}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                href={HELP_PANEL.primary.href}
                variant="secondary"
                size="sm"
              >
                {HELP_PANEL.primary.label}
              </Button>
              <Button href={HELP_PANEL.secondary.href} variant="link" size="sm">
                {HELP_PANEL.secondary.label}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
