"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface GoogleAnalyticsProps {
  gaId?: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const cleanId = gaId?.trim() || "";

  useEffect(() => {
    if (!cleanId) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window.gtag === "function") {
      window.gtag("config", cleanId, {
        page_path: pathname,
      });
    }
  }, [pathname, cleanId]);

  if (!cleanId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${cleanId}`}
        strategy="lazyOnload"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${cleanId}');`,
        }}
      />
    </>
  );
}
