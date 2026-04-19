/**
 * Dummy data fixtures for the /v2 component showcase.
 * All shapes match the exact TypeScript prop types defined in each component.
 */

/* ─────────────────────────────────────────
   HeroSection  (HomeHeroSection.tsx)
   data.heroSection
───────────────────────────────────────── */
export const heroData = {
  heroSection: {
    title1: "Managed WordPress Hosting",
    title2: "Built for Performance.",
    description:
      "LiteSpeed + NVMe storage with sub-200ms average TTFB from our London, Frankfurt, and New York nodes. 99.95% uptime SLA with automatic service credits.",
    background: {
      src: "/images/placeholder.png",
      alt: "DronaHost hero background",
    },
    buttons: [
      { label: "Start Free Trial", variant: "primary", link: "/hosting/wordpress" },
      { label: "View Plans", variant: "secondary", link: "/pricing" },
    ],
    members: {
      countText: "Trusted by 1,200+ businesses across the US, UK, and EU",
      avatars: [
        "/images/placeholder.png",
        "/images/placeholder.png",
        "/images/placeholder.png",
      ],
    },
    heroImage: {
      src: "/images/placeholder.png",
      alt: "DronaHost dashboard preview",
    },
    floatingCards: [
      {
        title: "99.95% Uptime SLA",
        description: "Automatic credits if we miss the mark.",
        position: "top-left",
      },
      {
        title: "18-min Avg. Response",
        description: "24/7 support across US, UK, and UAE.",
        position: "middle-left",
      },
      {
        title: "LiteSpeed + NVMe",
        description: "Faster cold-starts, better Core Web Vitals.",
        position: "bottom-left",
      },
    ],
    decorations: {
      backgroundBlur: true,
      gradientOverlay: false,
      curvedLines: true,
    },
  },
};

/* ─────────────────────────────────────────
   FeatureSection  (FeatureSection.tsx)
   data.featuresSection
───────────────────────────────────────── */
export const featureData = {
  featuresSection: {
    tagline: "Why developers choose DronaHost",
    title: "Everything your site needs, managed for you.",
    features: [
      {
        title: "Automatic Daily Backups",
        description:
          "Point-in-time restore for every site, retained for 30 days. One-click rollback from the control panel.",
        cta: { label: "Learn about backups" },
      },
      {
        title: "Edge-Cached Delivery",
        description:
          "Cloudflare in front of every site. Static assets served from 300+ PoPs; HTML cached at edge with 60-second TTL.",
        cta: { label: "See performance data" },
      },
      {
        title: "Isolated Hosting Environments",
        description:
          "Each account runs in a containerised environment — no noisy-neighbour risk, no shared PHP processes.",
        cta: { label: "Read the architecture docs" },
      },
    ],
  },
};

/* ─────────────────────────────────────────
   ServicesSection  (ServiceSection.tsx)
   data.servicesSection
───────────────────────────────────────── */
export const serviceData = {
  servicesSection: {
    tagline: "What we offer",
    title: "Hosting and web services for growing businesses",
    description:
      "From a single WordPress site to a fleet of cloud servers, DronaHost covers every layer of your online presence.",
    services: [
      {
        id: 1,
        title: "Managed WordPress",
        description:
          "LiteSpeed-optimised stacks, automatic updates, and staging environments included on every plan.",
        icon: "/icon/wordpress.svg",
        cta: { label: "Explore plans", link: "/hosting/wordpress" },
      },
      {
        id: 2,
        title: "VPS Hosting",
        description:
          "Full root access, choice of OS, and dedicated NVMe storage. Scale vertically in under 60 seconds.",
        icon: "/icon/vps.svg",
        cta: { label: "View VPS options", link: "/hosting/vps" },
      },
      {
        id: 3,
        title: "Website Design",
        description:
          "Custom WordPress and Next.js builds designed for conversion. Fixed-price packages with 30-day delivery.",
        icon: "/icon/design.svg",
        cta: { label: "See portfolio", link: "/web-design" },
      },
      {
        id: 4,
        title: "SEO Retainers",
        description:
          "Monthly retainer-based SEO for US, UK, and EU markets. Transparent reporting, no lock-in contracts.",
        icon: "/icon/seo.svg",
        cta: { label: "Get an audit", link: "/seo" },
      },
    ],
    layout: {
      columns: 4,
      showDividers: true,
      alignment: "center",
    },
  },
};

/* ─────────────────────────────────────────
   CaseStudySection  (CaseStudy.tsx)
   data.caseStudySection
───────────────────────────────────────── */
export const caseStudyData = {
  caseStudySection: {
    tagline: "Client results",
    title: "How Meridian Legal cut page-load time by 68%",
    description:
      "Meridian Legal's WordPress site was loading in 4.2 seconds on a shared host. After migrating to DronaHost Managed WordPress, average LCP dropped to 1.34 seconds — improving both bounce rate and organic ranking.",
    ctaPrimary: {
      label: "Read the full case study",
      link: "/case-studies/meridian-legal",
    },
    ctaSecondary: {
      label: "Browse all case studies",
      link: "/case-studies",
    },
    stats: [
      { value: "68%", label: "Faster page load" },
      { value: "1.34s", label: "Average LCP" },
      { value: "+22%", label: "Organic sessions (90 days)" },
    ],
    image: {
      src: "/images/home/caseStudy.svg",
      alt: "Meridian Legal website performance chart",
    },
  },
};

/* ─────────────────────────────────────────
   CTASection  (CTA.tsx)
   data.ctaSection
───────────────────────────────────────── */
export const ctaData = {
  ctaSection: {
    tagline: "30-day money-back guarantee",
    title: "Launch your site on infrastructure that scales with you.",
    buttons: [
      {
        label: "Start for free",
        variant: "primary",
        link: "/signup",
        icon: "arrow-right",
      },
      {
        label: "Talk to an expert",
        variant: "secondary",
        link: "/contact",
      },
    ],
    image: {
      src: "/images/home/CTA.svg",
      alt: "Illustration of a rocket launching",
    },
  },
};

/* ─────────────────────────────────────────
   PricingSection1  (PricingSection1.tsx)
   data.managedHostingSection
───────────────────────────────────────── */
export const pricingSection1Data = {
  managedHostingSection: {
    tagline: "Managed WordPress Hosting",
    title: "Your WordPress site, fully managed from server to CDN.",
    description:
      "We handle OS patches, PHP upgrades, LiteSpeed tuning, and Cloudflare configuration so your team can focus on content and growth.",
    features: [
      { text: "LiteSpeed + NVMe on every plan — not just premium tiers", icon: "check" },
      { text: "One-click staging environment with push-to-live", icon: "check" },
      { text: "Daily off-site backups retained for 30 days", icon: "check" },
    ],
    buttons: [
      { label: "See all plans", variant: "primary", link: "/hosting/wordpress" },
      { label: "Compare features", variant: "secondary", link: "/hosting/wordpress#compare" },
    ],
    image: {
      src: "/images/home/pricingSection1.png",
      alt: "DronaHost control panel screenshot",
    },
  },
};

/* ─────────────────────────────────────────
   PricingSection2  (PricingSection2.tsx)
   data.managedHostingIllustrationSection
───────────────────────────────────────── */
export const pricingSection2Data = {
  managedHostingIllustrationSection: {
    tagline: "Global server locations",
    title: "Your data where your customers are.",
    description:
      "Choose from London, Frankfurt, New York, or Dubai. Data stays in region — no cross-border transfers for EU or UK customers.",
    features: [
      { text: "GDPR-compliant EU data residency (Frankfurt)", icon: "check" },
      { text: "UK server with ICO-aligned data handling", icon: "check" },
      { text: "Sub-20ms latency to major US metro areas from New York node", icon: "check" },
    ],
    buttons: [
      { label: "Choose your region", variant: "primary", link: "/hosting/us" },
      { label: "Learn about compliance", variant: "secondary", link: "/security" },
    ],
    illustration: {
      src: "/images/home/pricingSection2.svg",
      alt: "World map showing DronaHost server locations",
    },
  },
};

/* ─────────────────────────────────────────
   PricingSection3  (PricingSection3.tsx)
   data.managedHostingAbstractSection
───────────────────────────────────────── */
export const pricingSection3Data = {
  managedHostingAbstractSection: {
    tagline: "Developer-friendly infrastructure",
    title: "SSH, Git, WP-CLI — the tools you already use.",
    description:
      "Every managed plan includes SSH access, WP-CLI, Git deployment hooks, and a staging URL. No locked-down environments, no extra fees.",
    features: [
      { text: "Git push-to-deploy via webhook integration", icon: "check" },
      { text: "WP-CLI pre-installed on all managed plans", icon: "check" },
      { text: "PHP 8.1–8.3 selectable per site, no server restart required", icon: "check" },
    ],
    buttons: [
      { label: "View developer docs", variant: "primary", link: "/kb/developer" },
      { label: "Start free trial", variant: "secondary", link: "/signup" },
    ],
    illustration: {
      src: "/images/home/pricingSection3.svg",
      alt: "Abstract illustration of server infrastructure",
    },
  },
};

/* ─────────────────────────────────────────
   PricingSection4  (PricingSection4.tsx)
   data.managedHostingUISection
───────────────────────────────────────── */
export const pricingSection4Data = {
  managedHostingUISection: {
    tagline: "Intuitive control panel",
    title: "Manage every site from a single dashboard.",
    description:
      "Add domains, push to staging, trigger backups, and view real-time performance metrics — all without opening a terminal.",
    features: [
      { text: "Real-time LCP and TTFB monitoring per site", icon: "check" },
      { text: "One-click SSL issuance and renewal via Let's Encrypt", icon: "check" },
      { text: "Team access controls with role-based permissions", icon: "check" },
    ],
    buttons: [
      { label: "See a live demo", variant: "primary", link: "/demo" },
      { label: "Explore the control panel", variant: "secondary", link: "/features/control-panel" },
    ],
    illustration: {
      src: "/images/home/pricingSection4.svg",
      alt: "DronaHost dashboard UI screenshot",
    },
  },
};

/* ─────────────────────────────────────────
   PricingJourney  (pricingJourney.tsx)
   data.pricingSection
───────────────────────────────────────── */
export const pricingJourneyData = {
  pricingSection: {
    tagline: "Transparent pricing",
    title: "Plans that grow with your business",
    billingToggle: {
      label: "Subscription plans are listed",
      options: ["monthly", "annually"],
      default: "monthly",
    },
    plans: [
      {
        id: "starter",
        name: "Starter",
        badge: null,
        description: "For personal sites and early-stage projects.",
        price: { amount: 12, currency: "USD", duration: "month" },
        cta: { label: "Get started", variant: "outline", link: "/signup?plan=starter" },
        featuresTitle: "Included in Starter:",
        features: [
          "1 WordPress site",
          "10 GB NVMe storage",
          "Free SSL certificate",
          "Daily backups (7-day retention)",
        ],
        footer: {
          cta: "Activate plan",
          secondaryLink: "View full feature list",
        },
      },
      {
        id: "essential",
        name: "Essential",
        badge: "Most popular",
        description: "For growing businesses that need room to scale.",
        price: { amount: 30, currency: "USD", duration: "month" },
        cta: { label: "Start free trial", variant: "primary", link: "/signup?plan=essential" },
        featuresTitle: "Everything in Starter, plus:",
        features: [
          "Up to 3 WordPress sites",
          "30 GB NVMe storage",
          "Staging environment",
          "30-day backup retention",
          "Priority support queue",
        ],
        extensions: {
          title: "Optional add-ons:",
          items: [
            "Automated plugin updates +$3/mo",
            "Extra security layer +$19/mo",
            "NitroPack integration +$20/mo",
          ],
        },
        footer: {
          cta: "Activate plan",
          secondaryLink: "Compare all plans",
        },
      },
      {
        id: "agency",
        name: "Agency",
        badge: null,
        description: "For agencies managing multiple client sites.",
        price: { custom: true, label: "Custom pricing" },
        cta: { label: "Talk to sales", variant: "secondary", link: "/contact?intent=agency" },
        featuresTitle: "Everything in Essential, plus:",
        features: [
          "Unlimited WordPress sites",
          "Dedicated account manager",
          "White-label reporting",
          "SLA with financial credits",
          "Custom billing per client",
        ],
        footer: {
          cta: "Request a quote",
          secondaryLink: "Download agency pricing sheet",
        },
      },
    ],
    layout: {
      highlightedPlan: "essential",
    },
  },
};

/* ─────────────────────────────────────────
   TestimonialsSection  (TestimonialsSection.tsx)
   data.testimonialsSection
───────────────────────────────────────── */
export const testimonialsData = {
  testimonialsSection: {
    title: "Trusted by businesses across three continents.",
    tabs: [
      { label: "All", active: true },
      { label: "WordPress", active: false },
      { label: "Agency", active: false },
    ],
    testimonials: [
      {
        id: 1,
        rating: 5,
        source: {
          platform: "Trustpilot",
          label: "Verified review",
          icon: "/icon/trustpilot.svg",
        },
        content:
          "We migrated 14 client sites from a shared host in a single afternoon. Average LCP improved from 3.8s to 1.2s across the board. The support team handled every hiccup within minutes.",
        author: {
          name: "James Harrington",
          role: "Director, Harrington Digital — London, UK",
          avatar: "/images/placeholder.png",
        },
      },
      {
        id: 2,
        rating: 5,
        source: {
          platform: "G2",
          label: "Verified review",
          icon: "/icon/g2.svg",
        },
        content:
          "DronaHost is the first host I've used that actually explains what they changed in maintenance windows. Transparent, responsive, and technically solid. Our WooCommerce store has been rock-solid for eight months.",
        author: {
          name: "Sarah Okonkwo",
          role: "Head of E-commerce, BrightLeaf Organics — Austin, TX",
          avatar: "/images/placeholder.png",
        },
      },
      {
        id: 3,
        rating: 5,
        source: {
          platform: "HostAdvice",
          label: "Verified review",
          icon: "/icon/hostadvice.svg",
        },
        content:
          "GDPR compliance was a genuine concern for us as a Frankfurt-based SaaS. DronaHost gave us a signed DPA, EU data residency, and a clear data-processing log. Saved us weeks of legal back-and-forth.",
        author: {
          name: "Lukas Bauer",
          role: "CTO, Fenster Analytics GmbH — Frankfurt, DE",
          avatar: "/images/placeholder.png",
        },
      },
    ],
    layout: {
      columns: 3,
    },
  },
};

/* ─────────────────────────────────────────
   FAQSection  (FAQSection.tsx)
   data.faqSection
───────────────────────────────────────── */
export const faqData = {
  faqSection: {
    tagline: "Support & questions",
    title: "Answers to the questions we get most often.",
    categories: [
      { label: "All", active: true },
      { label: "Hosting", active: false },
      { label: "Billing", active: false },
      { label: "Migration", active: false },
    ],
    content: {
      title: "Not sure which plan fits?",
      description:
        "Most customers start on Essential and upgrade as traffic grows. Our migration team will move your existing site for free on any annual plan.",
      highlightBox: {
        text: "Every plan includes a 30-day money-back guarantee — no questions, no partial refunds, no hidden fees.",
      },
      additionalInfo: [
        "You can upgrade or downgrade your plan at any time. Billing is prorated to the day.",
        "If you have questions not answered here, our support team typically responds within 18 minutes, around the clock.",
      ],
    },
    faqs: [
      {
        id: 1,
        question: "How much does WordPress hosting cost at DronaHost?",
        answer:
          "Plans start at $12/month for a single site on our Starter tier. The Essential plan (3 sites, staging, 30-day backups) is $30/month. All prices are in USD; we also bill in GBP, EUR, and AED — automatically detected from your location.",
        isOpen: false,
      },
      {
        id: 2,
        question: "Is my data stored in the EU if I choose the Frankfurt node?",
        answer:
          "Yes. Selecting the Frankfurt region at sign-up ensures all site data, database backups, and access logs remain on EU infrastructure. We provide a signed Data Processing Agreement (DPA) and do not transfer data outside the EEA without Standard Contractual Clauses in place.",
        isOpen: false,
      },
      {
        id: 3,
        question: "What happens if DronaHost misses the 99.95% uptime SLA?",
        answer:
          "We issue automatic service credits — no ticket required. Credits are calculated as 10× the prorated value of the downtime period and applied to your next invoice. The full credit schedule is in our SLA document at dronahost.com/sla.",
        isOpen: false,
      },
      {
        id: 4,
        question: "Can I migrate from SiteGround or Kinsta without downtime?",
        answer:
          "Our migration team handles the full transfer: files, database, DNS cutover, and SSL. For most sites this is a zero-downtime migration using a temporary subdomain for testing before we switch DNS. Migration is free on any annual plan and $49 as a standalone service.",
        isOpen: false,
      },
    ],
  },
};

/* ─────────────────────────────────────────
   TeamsSection  (TeamsSection.tsx)
   data.trustSection
───────────────────────────────────────── */
export const teamsData = {
  trustSection: {
    rating: {
      label: "Excellent",
      value: 5,
      platform: "Trustpilot",
      reviews: "134 reviews",
    },
    title: {
      text: "Powering sites for businesses that demand reliability.",
      highlight: "reliability",
    },
    logos: [
      { name: "Meridian", src: "/images/placeholder.png" },
      { name: "BrightLeaf", src: "/images/placeholder.png" },
      { name: "Fenster", src: "/images/placeholder.png" },
      { name: "Arclight", src: "/images/placeholder.png" },
      { name: "Northgate", src: "/images/placeholder.png" },
    ],
  },
};
