"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { consentSnapshot, readConsent, subscribeConsent } from "@/lib/consent";

/** Loads cookie-setting scripts only when the matching consent category is granted. */
export default function ConsentScripts({ gaId }: { gaId?: string }) {
  const raw = useSyncExternalStore(subscribeConsent, consentSnapshot, () => "");
  const consent = raw ? readConsent() : null;
  if (!gaId || !consent?.analytics) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
