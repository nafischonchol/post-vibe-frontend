export const SITE_KEYWORDS = [
  "Post-Vibe",
  "video syndication",
  "automated social media publishing",
  "AI video content workflow",
  "content automation",
  "social media automation",
  "video marketing SaaS",
  "platform publishing",
  "multi-channel content distribution",
  "social video scheduling",
  "AI metadata generation",
  "YouTube publishing",
  "TikTok automation",
  "Facebook Reels publishing",
  "tenant portal",
  "post vibe",
  "postvibe",
  "social media growth tools",
  "automated content syndication",
];

export const getNewsMediaOrganizationSchema = () => {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? process.env.APP_NAME ?? "Post-Vibe";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "https://www.postvibe.com";

  return {
    "@type": ["Organization", "NewsMediaOrganization"],
    name: SITE_NAME,
    alternateName: "Post-Vibe",
    foundingDate: "2026-05-01",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    image: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.facebook.com/postvibe",
      "https://x.com/postvibe",
      "https://www.youtube.com/@postvibe",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801704-052374",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["bn", "en"],
        email: "support@postvibe.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "hello@postvibe.com",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Empire Talukder Dream, 22–23 Station Road",
      addressLocality: "Tejgaon",
      addressRegion: "Dhaka",
      postalCode: "1215",
      addressCountry: "BD",
    },
    employee: {
      "@type": "Person",
      name: "Nafis Chonchol",
      jobTitle: "Developer",
      sameAs: ["https://www.facebook.com/nafis.chonchol"],
    },
    publishingPrinciples: [
      `${SITE_URL}/about`,
      `${SITE_URL}/privacy`,
      `${SITE_URL}/terms`,
    ],
  };
};

export const getWebSiteSchema = (menuCategories: any[] = []) => {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? process.env.APP_NAME ?? "Post-Vibe";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "https://www.postvibe.com";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    interactivityType: "mixed",
    name: SITE_NAME,
    headline: `${SITE_NAME} | AI-powered video syndication and social publishing platform`,
    keywords: SITE_KEYWORDS.join(", "),
    url: SITE_URL,
    copyrightHolder: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL,
    },
    ...(menuCategories.length > 0 && {
      hasPart: menuCategories.map((category) => ({
        "@type": "WebPage",
        name: category.title,
        url: `${SITE_URL}/${category.slug}`,
      })),
    }),
  };
};
