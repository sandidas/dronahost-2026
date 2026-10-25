import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // One 404 page for the whole app: the root layout lives in a dynamic [locale] segment.
  experimental: { globalNotFound: true },
  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/llms-full.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/experience-growth", destination: "/about", permanent: true },
      { source: "/Experience%26Growth", destination: "/about", permanent: true },
      { source: "/web-hosting", destination: "/wordpress-hosting", permanent: true },
      { source: "/hosting-price", destination: "/pricing", permanent: true },
      { source: "/domains-pricing", destination: "/domains", permanent: true },
      // Service URLs follow the v1 site so existing rankings and links carry over (owner, 2026-10-11, decision 70).
      { source: "/cloud-hosting", destination: "/cloud-web-hosting", permanent: true },
      { source: "/vps-hosting", destination: "/managed-vps-hosting", permanent: true },
      { source: "/web-design", destination: "/wordpress-website-design", permanent: true },
      { source: "/custom-development", destination: "/custom-website-development", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
