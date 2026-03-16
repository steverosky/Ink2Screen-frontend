import Link from "next/link"
import Image from "next/image"
import { NewsletterSignup } from "@/components/newsletter-signup"

const exploreLinks = [
  { label: "Shop", href: "/artefacts" },
  { label: "Ink2Screen LLC", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/ink2screen" },
  { label: "TikTok", href: "https://tiktok.com/@ink2screen" },
  { label: "YouTube", href: "https://youtube.com/@Ink2ScreenLLC" },
  { label: "YouTube (Galvarino)", href: "https://youtube.com/@GalvarinoChillyTv" },
  { label: "Twitter / X", href: "https://x.com/Ink2ScreenLLC" },
]

export function Footer() {
  return (
    <footer className="bg-black px-7 pb-10 pt-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Logo + Nav Link */}
        <div className="flex flex-col items-center gap-2 py-6">
          <Image
            src="/images/logo.png"
            alt="Ink2Screen"
            width={86}
            height={78}
            className="h-[78px]"
            style={{ width: "auto" }}
          />
          <Link
            href="/"
            className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0] transition-colors hover:text-brand-gold"
          >
            Back to top
          </Link>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-2">
          <p className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0]">
            Explore
          </p>
          {exploreLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0] transition-colors hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-2">
          <p className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0]">
            Legal
          </p>
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0] transition-colors hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-2">
          <p className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0]">
            Socials
          </p>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0] transition-colors hover:text-brand-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Stay Inspired — Newsletter */}
        <NewsletterSignup />
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-10 max-w-[1440px] border-t border-[#333] pt-6 text-center text-xs text-[#888]">
        <p>
          &copy; {new Date().getFullYear()} Ink2Screen LLC Publishing. All
          rights reserved.
        </p>
      </div>
    </footer>
  )
}
