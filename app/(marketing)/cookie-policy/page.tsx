import CookieSettingsButton from "@/components/consent/CookieSettingsButton";
import LegalPage from "@/components/legal/LegalPage";
import JsonLd from "@/components/sections/JsonLd";
import Link from "next/link";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cookie Policy | DronaHost",
  description: "Which cookies and similar storage DronaHost uses, what each one is for, how long it lasts, and how to change your choices.",
  path: "/cookie-policy",
});

type Row = { name: string; type: string; purpose: string; duration: string; provider: string };

const NECESSARY: Row[] = [
  { name: "dh_consent", type: "Cookie", purpose: "Remembers your cookie choices and a random ID that lets us show we asked for your consent.", duration: "6 months", provider: "DronaHost" },
  { name: "theme", type: "Local storage", purpose: "Remembers whether you chose the light or dark theme.", duration: "Until you clear your browser data", provider: "DronaHost" },
  { name: "dh-migration, dh-consultation", type: "Session storage", purpose: "Keeps your answers if you reload a multi-step form. Cleared when you send the form or close the tab.", duration: "Current tab only", provider: "DronaHost" },
  { name: "dh-announcement-*", type: "Local storage", purpose: "Remembers that you dismissed a site notice. Only used when a notice is shown.", duration: "Until you clear your browser data", provider: "DronaHost" },
  { name: "Cloudflare Turnstile", type: "Script", purpose: "Tells people from automated bots on pages with a form. Loaded from challenges.cloudflare.com on those pages only.", duration: "Set by Cloudflare", provider: "Cloudflare" },
];

const PREFERENCES: Row[] = [
  { name: "dh_currency", type: "Cookie", purpose: "Remembers the currency you picked. Used only if the currency selector is switched on, and only after you allow preference cookies.", duration: "1 year", provider: "DronaHost" },
];

const ANALYTICS: Row[] = [
  { name: "Plausible Analytics", type: "None", purpose: "Counts page views without cookies or personal data, when enabled.", duration: "Not applicable", provider: "Plausible" },
  { name: "_ga, _ga_*", type: "Cookie", purpose: "Google Analytics 4 measures how the site is used, when enabled. Loads only after you allow analytics cookies.", duration: "Up to 2 years", provider: "Google" },
];

function CookieTable({ rows }: { rows: Row[] }) {
  return (
    <div className="not-article overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label="Cookie table, scrollable">
      <table className="w-full min-w-[40rem] text-start text-sm">
        <thead className="bg-muted text-foreground">
          <tr>
            {["Name", "Type", "Purpose", "Lasts", "Set by"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-start font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-border align-top">
              <th scope="row" className="px-4 py-3 text-start font-mono text-xs font-semibold text-foreground">
                {r.name}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.duration}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/cookie-policy"))]} />
      <LegalPage title="Cookie Policy" path="/cookie-policy" updated="2026-10-06" intro="This page lists every cookie and similar storage the DronaHost website uses, why, and for how long. You choose which optional ones we may use.">
        <h2>What cookies are</h2>
        <p>
          Cookies are small files a website saves in your browser. Similar technologies, such as local storage and session storage, do the same job. We use the word &quot;cookies&quot; for all of them on this page.
        </p>

        <h2>Your choices</h2>
        <p>
          When you first visit, we ask whether we may use optional cookies. Rejecting is as easy as accepting, and the site works the same either way. You can change your mind at any time:
        </p>
        <p>
          <CookieSettingsButton className="btn btn-secondary btn-sm" />
        </p>
        <p>
          You can also delete or block cookies in your browser settings. Blocking necessary storage may stop parts of the site, such as the theme choice or form progress, from working.
        </p>

        <h2>Necessary</h2>
        <p>The site needs these to work and to keep your choices. They do not track you across other websites, and you cannot switch them off here.</p>
        <CookieTable rows={NECESSARY} />

        <h2>Preferences</h2>
        <p>These remember settings you choose. We set them only if you allow preference cookies.</p>
        <CookieTable rows={PREFERENCES} />

        <h2>Analytics</h2>
        <p>These tell us which pages are useful. Cookie-setting analytics load only after you allow analytics cookies.</p>
        <CookieTable rows={ANALYTICS} />

        <h2>Marketing</h2>
        <p>We do not use advertising or marketing cookies at the moment. If that changes, they will stay off until you allow them, and this page will be updated first.</p>

        <h2>Your consent record</h2>
        <p>
          When you make a choice, we store it with a random ID, the date and your choices, so we can show that we asked. We do not store your IP address or browser details with it.
        </p>

        <h2>More information</h2>
        <p>
          How we handle personal data is explained in our{" "}
          <Link href="/privacy" className="text-link underline underline-offset-4">
            Privacy policy
          </Link>
          . Questions about cookies? <Link href="/contact" className="text-link underline underline-offset-4">Contact us</Link>.
        </p>
      </LegalPage>
    </>
  );
}
