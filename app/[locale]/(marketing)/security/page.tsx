import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";

import { CLAIMS, isVerified } from "@/content/claims";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Security & Data Protection",
    description:
      "How DronaHost protects your data and hosting account, which security measures are confirmed today, and how to report a security problem to the team.",
    path: "/security",
    // noindex until the owner (Tier A) or a qualified reviewer (Tier B) approves
    noIndex: true,
  });
}

const claimText = (id: string): string | undefined => CLAIMS.find((c) => c.id === id && c.verified)?.text;

/**
 * Lists only measures confirmed in content/claims.ts. Anything else (monitoring, encryption
 * standards, patch windows, penetration tests) stays off the page until the owner confirms it.
 */
export default function SecurityPage() {
  const backups = isVerified("backups");
  const ssl = claimText("free-ssl");
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/security"))]} />
      <LegalPage title="Security &amp; Data Protection" path="/security" updated="2025-01-01">
        <p>
          This page describes how DronaHost protects your data and your hosting
          account. It lists only the measures we have confirmed. We will add
          more detail as each measure is reviewed.
        </p>

        {(backups || ssl) && (
          <>
            <h2>What is in place today</h2>
            <ul>
              {backups && (
                <li>
                  Your site is backed up automatically.{" "}
                  <Link href="/backup-policy" className="text-link underline underline-offset-4">
                    Read the backup policy
                  </Link>
                  .
                </li>
              )}
              {ssl && <li>{ssl}.</li>}
            </ul>
          </>
        )}

        <h2>How we handle personal data</h2>
        <p>
          The{" "}
          <Link href="/privacy" className="text-link underline underline-offset-4">
            privacy policy
          </Link>{" "}
          explains what personal data we collect and why. The{" "}
          <Link href="/data-processing" className="text-link underline underline-offset-4">
            data processing page
          </Link>{" "}
          explains how we process data on your behalf.
        </p>

        <h2>Report a security problem</h2>
        <p>
          If you find a security problem in our service, open a support ticket
          and say that it is a security report. Please do not share the details
          publicly until we have replied.
        </p>

        <h2>What this page does not cover yet</h2>
        <p>
          Details such as monitoring, encryption standards, update schedules and
          independent testing are not listed here yet. Ask the team if you need
          an answer before you buy.
        </p>
        <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-muted-foreground">
        <p>
          Related:{" "}
          <Link href="/privacy" className="text-link underline underline-offset-4">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/data-processing" className="text-link underline underline-offset-4">
            Data Processing Agreement
          </Link>
          {" · "}
          <Link href="/sla" className="text-link underline underline-offset-4">
            SLA
          </Link>
        </p>
      </footer>
      </LegalPage>
    </>
  );
}
