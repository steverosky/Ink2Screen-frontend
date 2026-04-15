"use client"

import Script from "next/script"
import { useConsentStore } from "@/lib/store"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Loads Google Analytics only after the user has accepted cookies.
 * Set NEXT_PUBLIC_GA_ID in .env.local to activate.
 */
export function Analytics() {
  const cookiesAccepted = useConsentStore((s) => s.cookiesAccepted)

  if (!GA_ID || !cookiesAccepted) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
