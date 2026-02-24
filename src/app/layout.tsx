import type { Metadata } from "next"
import { Cinzel, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

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

export const metadata: Metadata = {
  title: {
    default: "Ink2Screen LLC Publishing - Every Story Has a Purpose",
    template: "%s | Ink2Screen LLC Publishing",
  },
  description:
    "Ink2Screen LLC Publishing — Engineering narratives for readers and screen adaptation. Discover books by Sterling R. Smith.",
  keywords: [
    "Ink2Screen",
    "publishing",
    "books",
    "Sterling Smith",
    "Raison D'être",
    "fiction",
    "screen adaptation",
  ],
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
      </body>
    </html>
  )
}
