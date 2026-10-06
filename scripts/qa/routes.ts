/** Public routes covered by the QA scripts. */
export const KEY_ROUTES = ["/", "/pricing", "/wordpress-hosting", "/about", "/seo-services"];
export const OTHER_ROUTES = [
  "/contact", "/migration", "/consultation", "/security", "/sla", "/terms", "/privacy", "/refund-policy", "/data-processing",
  "/domains", "/web-design", "/vps-hosting", "/cloud-hosting", "/business-hosting", "/growth-services", "/blog", "/hosting/us", "/hosting/uk", "/hosting/eu", "/hosting/uae",
];
export const ALL_ROUTES = [...KEY_ROUTES, ...OTHER_ROUTES];
export const BASE = process.env.QA_BASE ?? "http://localhost:3200";
