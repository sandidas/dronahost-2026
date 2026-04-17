import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
