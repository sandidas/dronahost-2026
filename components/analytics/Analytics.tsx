import Script from "next/script";
import ConsentScripts from "./ConsentScripts";

/**
 * Analytics loaders. Plausible is cookieless and loads for everyone when
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. Anything that sets cookies (GA4) is loaded by
 * ConsentScripts only after the visitor opts in. Nothing loads before hydration finishes.
 */
export default function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <>
      {plausibleDomain && <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      <ConsentScripts gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </>
  );
}
