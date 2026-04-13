import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

type MegaItem = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

type WebHostingMegaMenuProps = {
  open: boolean;
};

const leftColumn: MegaItem[] = [
  {
    title: "Web Hosting",
    description: "Grow your website with fast and secure web hosting",
    href: "/web-hosting",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="4" width="16" height="7" rx="1.5" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" />
        <path d="M8 7h.01M8 16h.01" />
      </svg>
    ),
  },
  {
    title: "Hosting for WordPress",
    description: "Start, migrate, and manage WordPress sites easily",
    href: "/wordpress-hosting",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 7h.01M16 7h.01M8.8 17h6.4" />
        <path d="M9 9c.8 4.4 1.3 6.7 3 8M15 9c-.8 4.4-1.3 6.7-3 8" />
      </svg>
    ),
  },
  {
    title: "Cloud Hosting",
    description: "High-performance cloud plans for growing sites",
    href: "/cloud-hosting",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 18h8a4 4 0 0 0 .7-7.93A5.5 5.5 0 0 0 6.2 8.2 3.8 3.8 0 0 0 8 18z" />
      </svg>
    ),
  },
  {
    title: "Domains",
    description: "Choose and register a domain with the help of AI",
    href: "/domains-pricing",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" />
      </svg>
    ),
  },
];

const rightColumn: MegaItem[] = [
  {
    title: "Agency Program",
    description: "Scale your agency with premium hosting",
    href: "/agency",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="4" width="16" height="7" rx="1.5" />
        <rect x="4" y="13" width="16" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Reseller Hosting",
    description: "Resell hosting and manage multiple sites easily",
    href: "/reseller-hosting",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M5 9a7 7 0 0 1 12-2" />
        <path d="M19 15a7 7 0 0 1-12 2" />
        <path d="M17 3v4h-4M7 21v-4h4" />
      </svg>
    ),
  },
  {
    title: "Affiliate Program",
    description: "High earnings, fast payouts, and top conversions",
    href: "/affiliate",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="8" cy="9" r="2.2" />
        <circle cx="16" cy="9" r="2.2" />
        <path d="M3.5 18c.8-2.3 2.8-3.5 4.5-3.5s3.7 1.2 4.5 3.5M11.5 18c.8-2.3 2.8-3.5 4.5-3.5s3.7 1.2 4.5 3.5" />
      </svg>
    ),
  },
];

function MenuItem({ item }: { item: MegaItem }) {
  return (
    <Link
      href={item.href}
      className="group block rounded-xl px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800/80"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
          {item.icon}
        </div>
        <div>
          <h4 className="text-[18px] leading-tight font-semibold text-slate-900 dark:text-slate-100">{item.title}</h4>
          <p className="mt-1.5 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{item.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function WebHostingMegaMenu({ open }: WebHostingMegaMenuProps) {
  if (!open) return null;

  return (
    <div className="absolute left-1/2 top-full z-1200 w-[min(96vw,1600px)] -translate-x-1/2 pt-3">
      <div className="rounded-none border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.35)] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[0_36px_90px_-48px_rgba(2,6,23,0.95)] lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
          <div className="space-y-2">
            {leftColumn.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
          </div>

          <div className="space-y-2 border-slate-200 dark:border-slate-700 lg:border-l lg:pl-6">
            {rightColumn.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
          </div>

          <aside className="border-slate-200 pt-2 dark:border-slate-700 lg:border-l lg:pl-6">
            <p className="text-[14px] font-semibold tracking-wide text-slate-900 dark:text-slate-100">CUSTOMER SUCCESS STORIES</p>
            <div className="mt-4 overflow-hidden rounded-2xl bg-linear-to-br from-indigo-300 to-violet-400 p-3 dark:from-indigo-700 dark:to-violet-700">
              <Image
                src="/images/home/caseStudy.svg"
                alt="Customer success story"
                width={480}
                height={260}
                className="h-auto w-full rounded-xl"
                loading="eager"
              />
            </div>
            <p className="mt-4 text-[15px] leading-7 text-slate-800 dark:text-slate-300">
              “With Dronahost, our team launched faster and scaled with confidence. Best service so far.”
            </p>
            <Link href="/case-studies" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-indigo-600 dark:text-indigo-400">
              READ MORE
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
