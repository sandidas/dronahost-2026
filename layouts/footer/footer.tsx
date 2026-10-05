import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ACCEPTED_PAYMENT_METHODS } from "@/content/claims";
import { COMPANY } from "@/content/company";
import { FOOTER_COLUMNS } from "@/content/navigation";

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground";

/**
 * Site footer: brand, four link columns with unique headings, and a legal strip.
 * Company details, social profiles and payment methods render only when they are
 * set and verified in content/company.ts and content/claims.ts.
 */
export default function Footer() {
  const payments = ACCEPTED_PAYMENT_METHODS.filter((m) => m.verified);
  const legalLine = [COMPANY.legalName, COMPANY.registrationNumber && `Reg. ${COMPANY.registrationNumber}`, COMPANY.vatNumber && `VAT ${COMPANY.vatNumber}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer aria-labelledby="footer-heading" className="border-t border-border bg-card">
      <h2 id="footer-heading" className="sr-only">
        DronaHost site footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.8fr]">
          <div>
            <Link href="/" aria-label="DronaHost home" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="t-small mt-4 max-w-xs text-muted-foreground">{COMPANY.summary}</p>
            {COMPANY.supportEmail && (
              <p className="t-small mt-4">
                <a href={`mailto:${COMPANY.supportEmail}`} className="font-semibold text-link underline underline-offset-4">
                  {COMPANY.supportEmail}
                </a>
              </p>
            )}
            {COMPANY.socials.length > 0 && (
              <ul aria-label="Social profiles" className="mt-5 flex flex-wrap gap-2">
                {COMPANY.socials.map((s) => (
                  <li key={s.platform}>
                    <a href={s.href} rel="noopener noreferrer" target="_blank" className="btn btn-secondary btn-sm capitalize">
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                <ul className="mt-3 space-y-0.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} {COMPANY.legalName ?? COMPANY.brandName}. All rights reserved.
            </p>
            {legalLine && <p className="text-xs text-subtle-foreground">{legalLine}</p>}
            {COMPANY.address && <p className="text-xs text-subtle-foreground">{COMPANY.address}</p>}
          </div>
          {payments.length > 0 && (
            <p>
              Accepted payment methods: {payments.map((p) => p.label).join(", ")}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
