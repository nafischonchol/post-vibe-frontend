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

export const getOrganizationSchema = () => {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? process.env.APP_NAME ?? "Post-Vibe";
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "https://www.postvibe.com";

  return {
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Post-Vibe",
    foundingDate: "2026-01-01",
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
        contactType: "customer service",
        availableLanguage: ["en", "bn"],
        email: "support@postvibe.com",
      },
    ],
  };
};

export const getNewsMediaOrganizationSchema = getOrganizationSchema;

export const getWebSiteSchema = (menuCategories: Array<{ title: string; slug: string }> = []) => {
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
      "@type": "Organization",
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
