"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

// Strictly validate IDs - only render scripts with known-good formats
const rawGA = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();
const rawPixel = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();

// GA4 IDs are like "G-XXXXXXXXXX", legacy UA IDs are "UA-XXXXXX-X"
const GA_ID = /^(G-[A-Z0-9]+|UA-\d+-\d+)$/.test(rawGA) ? rawGA : "";
// Meta Pixel IDs are numeric strings (typically 15-16 digits)
const PIXEL_ID = /^\d{6,20}$/.test(rawPixel) ? rawPixel : "";

const hasGA = GA_ID.length > 0;
const hasPixel = PIXEL_ID.length > 0;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    dataLayer?: unknown[];
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (hasGA && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_ID, { page_path: pathname });
    }
    if (hasPixel && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  // No valid analytics IDs configured — render nothing
  if (!hasGA && !hasPixel) return null;

  return (
    <>
      {hasGA && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`,
            }}
          />
        </>
      )}

      {hasPixel && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`,
          }}
        />
      )}
    </>
  );
}
