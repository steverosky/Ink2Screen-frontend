import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Instagram, Youtube, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getContent, cms } from "@/lib/cms"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ink2Screen LLC Publishing — general inquiries, event partnerships, and press collaborations. Based in Houston, Texas.",
  openGraph: {
    title: "Contact Ink2Screen LLC Publishing",
    description: "Reach out for general inquiries, events, and press. Based in Houston, Texas.",
    url: "https://www.ink2screenllc.com/contact",
  },
  alternates: { canonical: "https://www.ink2screenllc.com/contact" },
}

type ContentMap = Record<string, Record<string, Record<string, string>>>

const DEFAULT_EMAIL = "Ink2screenllc@gmail.com"

function getSocialLinks(c: ContentMap) {
  return [
    {
      label: "Instagram",
      handle: "@Ink2Screen",
      href: cms(c, "global", "social", "instagram_url", "https://instagram.com/ink2screen"),
      icon: Instagram,
    },
    {
      label: "TikTok",
      handle: "@Ink2Screen",
      href: cms(c, "global", "social", "tiktok_url", "https://tiktok.com/@ink2screen"),
      icon: () => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
    },
    {
      label: "YouTube — Ink2Screen",
      handle: "@Ink2ScreenLLC",
      href: cms(c, "global", "social", "youtube_url", "https://youtube.com/@Ink2ScreenLLC"),
      icon: Youtube,
    },
    {
      label: "YouTube — Founder's Personal",
      handle: "@GalvarinoChillyTv",
      href: cms(c, "global", "social", "youtube_galvarino_url", "https://youtube.com/@GalvarinoChillyTv"),
      icon: Youtube,
    },
    {
      label: "Twitter / X",
      handle: "@Ink2ScreenLLC",
      href: cms(c, "global", "social", "twitter_url", "https://x.com/Ink2ScreenLLC"),
      icon: Twitter,
    },
  ]
}

/* ─── Hero ─── */
function HeroSection({ c }: { c: ContentMap }) {
  return (
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-[#050505] py-20 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/images/library-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
      </div>
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-6 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
          {cms(c, "contact", "hero", "label", "GET IN TOUCH")}
        </p>
        <h1 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[64px]">
          {cms(c, "contact", "hero", "headline", "LET'S CONNECT")}
        </h1>
        <p className="max-w-[600px] text-base font-light leading-relaxed text-[#e0e0e0] sm:text-lg md:text-xl">
          {cms(c, "contact", "hero", "description", "Inquiries, partnerships, event collaborations, or just a conversation about great storytelling.")}
        </p>
      </div>
    </section>
  )
}

/* ─── Email CTA ─── */
function EmailSection({ c }: { c: ContentMap }) {
  const email = cms(c, "contact", "email", "address", DEFAULT_EMAIL)
  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-16 md:py-20">
      {/* Section-level grain */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.04] mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto max-w-[800px]">
        <div className="relative overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-8 md:p-12">
          {/* Card grain */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg-texture.jpg"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-multiply"
            />
          </div>
          {/* Purple glow */}
          <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-brand-purple/10 blur-[120px]" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/5">
                <Mail className="h-7 w-7 text-brand-gold" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0] md:text-3xl">
                {cms(c, "contact", "email", "title", "SEND US A MESSAGE")}
              </h2>
              <p className="max-w-[500px] text-sm font-light leading-relaxed text-[#999] md:text-base">
                For business inquiries, press, partnerships, event
                collaborations, or general questions — send us a note below.
              </p>
            </div>

            <ContactForm />

            <p className="text-center text-xs text-[#666]">
              Prefer email? Reach us directly at{" "}
              <a
                href={`mailto:${email}`}
                className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
              >
                {email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Info Cards ─── */
function InfoCardsSection({ c }: { c: ContentMap }) {
  const EMAIL = cms(c, "contact", "email", "address", DEFAULT_EMAIL)
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-6 py-16 md:py-20">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.06] mix-blend-soft-light"
        />
      </div>
      <div className="relative mx-auto grid max-w-[1260px] gap-6 md:grid-cols-3">
        {/* General Inquiries */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg-texture.jpg"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-multiply"
            />
          </div>
          <Mail className="relative h-6 w-6 text-brand-gold" />
          <h3 className="relative font-heading text-lg font-bold tracking-tight text-[#e0e0e0]">
            GENERAL INQUIRIES
          </h3>
          <p className="relative text-sm font-light leading-relaxed text-[#999]">
            Questions about Ink2Screen, our products, or anything else — we read
            every message.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=General%20Inquiry`}
            className="relative mt-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
          >
            {EMAIL}
          </a>
        </div>

        {/* Events & Partnerships */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg-texture.jpg"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-multiply"
            />
          </div>
          <MapPin className="relative h-6 w-6 text-brand-gold" />
          <h3 className="relative font-heading text-lg font-bold tracking-tight text-[#e0e0e0]">
            EVENTS &amp; PARTNERSHIPS
          </h3>
          <p className="relative text-sm font-light leading-relaxed text-[#999]">
            Interested in hosting a book signing, workshop, or the Ink &amp;
            Indulgence experience? Let&apos;s plan it.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=Event%20Partnership%20Inquiry`}
            className="relative mt-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
          >
            {EMAIL}
          </a>
        </div>

        {/* Press & Media */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-bg-texture.jpg"
              alt=""
              fill
              className="object-cover opacity-10 mix-blend-multiply"
            />
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative h-6 w-6 text-brand-gold"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
          <h3 className="relative font-heading text-lg font-bold tracking-tight text-[#e0e0e0]">
            PRESS &amp; MEDIA
          </h3>
          <p className="relative text-sm font-light leading-relaxed text-[#999]">
            For interviews, features, reviews, or media kits — reach out and
            we&apos;ll get back to you promptly.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=Press%20%2F%20Media%20Inquiry`}
            className="relative mt-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Social Section ─── */
function SocialSection({ c }: { c: ContentMap }) {
  const socialLinks = getSocialLinks(c)
  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-16 md:py-20">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.04] mix-blend-soft-light"
        />
      </div>
      <div className="relative mx-auto max-w-[800px]">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
            FOLLOW THE MOVEMENT
          </p>
          <h2 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl">
            FIND US ONLINE
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[10px] border border-[#222] bg-[#121212] px-6 py-4 transition-colors hover:border-brand-gold/30"
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-[#888] transition-colors group-hover:text-brand-gold" />
                  <div>
                    <p className="text-sm font-semibold text-[#e0e0e0] group-hover:text-brand-gold">
                      {social.label}
                    </p>
                    <p className="text-xs text-[#666]">{social.handle}</p>
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-[#444] transition-colors group-hover:text-brand-gold"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Location ─── */
function LocationSection({ c }: { c: ContentMap }) {
  return (
    <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden">
      {/* Purple radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.4)_0%,transparent_70%)]" />
      {/* Grain texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex max-w-[800px] flex-col items-center gap-6 px-6 py-16 text-center">
        <MapPin className="h-8 w-8 text-brand-gold" />
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0] md:text-3xl">
          {cms(c, "contact", "location", "heading", "HOUSTON, TEXAS")}
        </h2>
        <p className="max-w-[500px] text-base font-light leading-relaxed text-[#e0e0e0]">
          {cms(c, "contact", "location", "description", "Ink2Screen is rooted in Houston. Our events, signings, and experiences are centered in the heart of Texas.")}
        </p>
        <Button
          asChild
          variant="outline"
          className="h-12 border-brand-gold px-6 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
        >
          <Link href="/events">VIEW UPCOMING EVENTS</Link>
        </Button>
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default async function ContactPage() {
  const c = await getContent()

  return (
    <div className="bg-[#050505]">
      <HeroSection c={c} />
      <EmailSection c={c} />
      <InfoCardsSection c={c} />
      <SocialSection c={c} />
      <LocationSection c={c} />
    </div>
  )
}
