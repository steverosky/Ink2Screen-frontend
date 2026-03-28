import { Metadata } from "next"
import { Instagram, Youtube, Twitter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getContent } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Social Hub",
  description: "Follow Ink2Screen LLC Publishing on Instagram, TikTok, YouTube, and Twitter/X for the latest content, behind-the-scenes, and author insights.",
  openGraph: {
    title: "Social Hub — Ink2Screen LLC Publishing",
    description: "Follow us on Instagram, TikTok, YouTube, and Twitter/X.",
    url: "https://www.ink2screenllc.com/social",
  },
  alternates: { canonical: "https://www.ink2screenllc.com/social" },
}

function getSocials(c: Record<string, Record<string, Record<string, string>>>) {
  const s = (key: string, fallback: string) => c?.global?.social?.[key] ?? fallback
  return [
    {
      name: "Instagram",
      handle: "@Ink2Screen",
      href: s("instagram_url", "https://instagram.com/ink2screen"),
      icon: Instagram,
    },
    {
      name: "TikTok",
      handle: "@Ink2Screen",
      href: s("tiktok_url", "https://tiktok.com/@ink2screen"),
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      handle: "@Ink2ScreenLLC",
      href: s("youtube_url", "https://youtube.com/@Ink2ScreenLLC"),
      icon: Youtube,
    },
    {
      name: "YouTube",
      handle: "@GalvarinoChillyTv",
      href: s("youtube_galvarino_url", "https://youtube.com/@GalvarinoChillyTv"),
      icon: Youtube,
    },
    {
      name: "Twitter / X",
      handle: "@Ink2ScreenLLC",
      href: s("twitter_url", "https://x.com/Ink2ScreenLLC"),
      icon: Twitter,
    },
  ]
}

export default async function SocialPage() {
  const c = await getContent("global")
  const socials = getSocials(c)

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-4 text-center font-heading text-4xl font-bold tracking-tight text-brand-gold md:text-5xl">
        Social Hub
      </h1>
      <p className="mb-12 text-center text-base text-[#e0e0e0]">
        Follow Ink2Screen LLC Publishing across all platforms.
      </p>

      <div className="mx-auto grid max-w-3xl gap-4">
        {socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="border-[#222] bg-[#121212] transition-colors hover:border-brand-gold/50">
              <CardContent className="flex items-center gap-4 py-5">
                <social.icon className="h-8 w-8 text-brand-gold" />
                <div>
                  <p className="text-lg font-semibold text-[#f0f0f0]">
                    {social.name}
                  </p>
                  <p className="text-sm text-[#888]">{social.handle}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}
