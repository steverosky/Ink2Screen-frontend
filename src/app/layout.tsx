import type { Metadata } from "next"
import { Cinzel, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ConsentBanner } from "@/components/consent-banner"
import { ContentProtection } from "@/components/content-protection"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["700"],
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const SITE_URL = "https://www.ink2screenllc.com"
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/book-spotlight.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ink2Screen LLC Publishing — Every Story Has a Purpose",
    template: "%s | Ink2Screen LLC Publishing",
  },
  description:
    "Ink2Screen LLC Publishing — Engineering narratives for readers and screen adaptation. Discover books, events, and exclusive merchandise by Sterling R. Smith.",
  keywords: [
    "Ink2Screen",
    "Ink2Screen LLC",
    "Sterling Smith",
    "Sterling R. Smith",
    "publishing",
    "books",
    "Raison D'être",
    "fiction",
    "screen adaptation",
    "author",
    "Houston author",
    "Black author",
  ],
  authors: [{ name: "Sterling R. Smith", url: SITE_URL }],
  creator: "Ink2Screen LLC Publishing",
  publisher: "Ink2Screen LLC Publishing",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Ink2Screen LLC Publishing",
    title: "Ink2Screen LLC Publishing — Every Story Has a Purpose",
    description:
      "Engineering narratives for readers and screen adaptation. Discover books, events, and exclusive merchandise by Sterling R. Smith.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ink2Screen LLC Publishing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ink2ScreenLLC",
    creator: "@Ink2ScreenLLC",
    title: "Ink2Screen LLC Publishing — Every Story Has a Purpose",
    description:
      "Engineering narratives for readers and screen adaptation. Discover books, events, and exclusive merchandise.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${montserrat.variable} flex min-h-screen flex-col font-body antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
        <ContentProtection />
      </body>
    </html>
  )
}
