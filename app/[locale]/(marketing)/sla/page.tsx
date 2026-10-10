import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import { Link } from "@/i18n/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { isVerified } from "@/content/claims";

// Owner 2026-10-10 (decisions 45 and 53): 99.99% monthly uptime on every hosting plan. The credit bands, cap, exclusions and
// claim steps follow the structure of a major host's published SLA (Kinsta, updated 2025-09-25), written for DronaHost.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Service Level Agreement: 99.99% Uptime",
    description: isVerified("uptime-sla")
      ? "The DronaHost service level agreement: 99.99% monthly uptime, what counts as downtime, service credits and how to claim a credit."
      : "The DronaHost service level agreement. Our uptime commitment and service credits are being finalized. Ask the team if you need details before you buy.",
    path: "/sla",
  });
}

const BANDS = [
  ["5 to 59 minutes", "5%"],
  ["60 to 119 minutes", "10%"],
  ["120 to 179 minutes", "15%"],
  ["180 minutes or more", "20%"],
] as const;

export default function SlaPage() {
  // The figures render only while the uptime-sla claim is verified, so the claim and the page cannot disagree.
  const slaVerified = isVerified("uptime-sla");
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/sla"))]} />
      <LegalPage title="Service Level Agreement" path="/sla" updated="2026-10-10">
        <p>
          This service level agreement (SLA) sets out the uptime DronaHost commits to for hosting plans, and the service
          credit you get when we miss it.
        </p>

        {!slaVerified && <p>Our uptime commitment and service credits are being finalized.</p>}
        {slaVerified && (
          <>
            <h2>Our uptime commitment</h2>
            <p>
              Every DronaHost hosting plan has a monthly uptime commitment of <strong>99.99%</strong>. That allows about
              4 minutes of downtime in a calendar month.
            </p>

            <h2>What counts as downtime</h2>
            <p>
              Downtime is time when your website cannot be reached over the web because of a fault in our hosting
              service, as measured by our monitoring. We add up the minutes in each calendar month.
            </p>

            <h2>What does not count</h2>
            <ul>
              <li>Scheduled maintenance that we announce by email at least 72 hours before it starts.</li>
              <li>Urgent security maintenance that cannot wait. We keep it as short as we can and tell you afterwards.</li>
              <li>Problems caused by your code, plugins, themes, settings or account use.</li>
              <li>Traffic or usage above what your plan includes.</li>
              <li>Failures outside our hosting service, such as your domain&apos;s DNS, your own network or a third-party service.</li>
              <li>Events outside our reasonable control.</li>
            </ul>

            <h2>Service credits</h2>
            <p>If downtime in a calendar month goes over the commitment, you can claim a credit on that month&apos;s hosting fee:</p>
            <table>
              <thead>
                <tr>
                  <th scope="col">Downtime in the month</th>
                  <th scope="col">Credit</th>
                </tr>
              </thead>
              <tbody>
                {BANDS.map(([downtime, credit]) => (
                  <tr key={downtime}>
                    <td>{downtime}</td>
                    <td>{credit} of the monthly fee</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Credits for one month never add up to more than that month&apos;s hosting fee. Credits go against your next
              invoice. They are not paid out as cash. A service credit is the only remedy for missing the uptime
              commitment.
            </p>

            <h2>How to claim a credit</h2>
            <p>
              Open a support ticket within 30 days of the downtime. Give the date, the start time with its time zone, and
              how long your site was down. We check it against our monitoring and reply by ticket with the result.
            </p>
          </>
        )}
        <footer className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800 text-sm text-muted-foreground">
          <p>
            Related:{" "}
            <Link href="/support-policy" className="text-link underline underline-offset-4">
              Support policy
            </Link>
            {" · "}
            <Link href="/refund-policy" className="text-link underline underline-offset-4">
              Refund policy
            </Link>
            {" · "}
            <Link href="/contact" className="text-link underline underline-offset-4">
              Ask the team about this policy
            </Link>
          </p>
        </footer>
      </LegalPage>
    </>
  );
}
