import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter / X", href: "https://x.com" },
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
            className="h-[78px] w-auto"
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
        <div className="flex max-w-[415px] flex-col gap-4">
          <div className="flex flex-col gap-2 py-2.5">
            <p className="text-sm font-semibold tracking-wide text-[#e0e0e0]">
              STAY INSPIRED
            </p>
            <p className="text-sm font-normal leading-[1.8] text-[#e0e0e0]">
              Be the first to discover new Ink2Screen books, exclusive
              collections, and special offers.
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex w-80 flex-col gap-1">
              <label className="text-[11px] font-bold tracking-[0.05em] text-brand-gold">
                EMAIL
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-10 rounded-none border-b border-l-0 border-r-0 border-t-0 border-[#333] bg-transparent px-0 text-sm text-[#e0e0e0] placeholder:text-[#555] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button className="h-11 bg-brand-gold px-6 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark">
              SIGN UP
            </Button>
          </div>
        </div>
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
