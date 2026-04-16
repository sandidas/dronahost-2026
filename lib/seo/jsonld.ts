const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com";

export type JsonLdScript = Record<string, unknown>;

export function organizationSchema(): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DronaHost",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      "https://twitter.com/dronahost",
      "https://www.linkedin.com/company/dronahost",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: "English",
      url: `${SITE_URL}/contact`,
    },
  };
}

export function websiteSchema(): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DronaHost",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dronahost.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productWithOfferSchema(input: {
  name: string;
  description: string;
  url: string;
  price: string;
  priceCurrency: string;
  priceValidUntil?: string;
  ratingValue?: number;
  reviewCount?: number;
}): JsonLdScript {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    price: input.price,
    priceCurrency: input.priceCurrency,
    url: input.url,
    availability: "https://schema.org/InStock",
  };

  if (input.priceValidUntil) {
    offer.priceValidUntil = input.priceValidUntil;
  }

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    offers: offer,
  };

  if (input.ratingValue !== undefined && input.reviewCount !== undefined) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue,
      reviewCount: input.reviewCount,
    };
  }

  return product;
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>
): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function blogPostingSchema(input: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
}): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: input.url,
    image: input.imageUrl,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "DronaHost",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
}): JsonLdScript {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "Organization",
      name: "DronaHost",
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Germany" },
    ],
  };
}
