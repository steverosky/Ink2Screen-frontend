import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Testimonials } from "@/components/testimonials"
import { getContent, cms } from "@/lib/cms"

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Sterling R. Smith — engineer, author, and founder of Ink2Screen LLC Publishing. Our mission: cultivate authors and bring powerful stories to screen.",
  openGraph: {
    title: "About — Ink2Screen LLC Publishing",
    description:
      "Meet Sterling R. Smith — engineer, author, and founder of Ink2Screen LLC Publishing.",
    url: "https://www.ink2screenllc.com/about",
    images: [{ url: "/images/sterling-transparent.png", width: 1200, height: 630, alt: "Sterling R. Smith" }],
  },
  alternates: { canonical: "https://www.ink2screenllc.com/about" },
}

/* ─── Hero — Mission Statement ─── */
function HeroSection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="relative flex min-h-[578px] items-center justify-center overflow-hidden bg-[#050505] py-20 md:py-24">
      {/* Library background */}
      <div className="absolute inset-0">
        <Image
          src="/images/library-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
        />
      </div>

      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-6 px-6 text-center md:gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold trackitng-[0.15em] text-brand-gold sm:text-sm">
            {cms(c, "about", "hero", "label", "OUR MISSION")}
          </p>
          <h1 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[64px]">
            {cms(c, "about", "hero", "headline", "IDEAS INTO INK. INK INTO IMPACT.")}
          </h1>
        </div>

        <div className="flex max-w-[720px] flex-col gap-4 text-base font-light leading-relaxed text-[#e0e0e0] sm:text-lg md:gap-5 md:text-xl md:leading-[1.6]">
          <p>
            Ink2Screen was built on a simple conviction: ideas deserve
            structure.
          </p>
          <p>
            We are a creative publishing and production platform designed to
            move ideas from concept to execution — from ink to screen, from
            manuscript to marketplace, from thought to influence.
          </p>
          <p>
            Because stories are not disposable. Because ideas are not
            accidental. Because impact does not happen by chance.
          </p>
          <p className="font-medium">
            Ink2Screen is where vision becomes structured execution.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── The Engineer & The Author ─── */
function EngineerAuthorSection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="relative overflow-hidden bg-[#121212]">
      {/* Background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10 mix-blend-multiply"
        />
      </div>

      <div className="relative mx-auto flex max-w-[1440px] flex-col md:min-h-[720px] md:flex-row">
        {/* Left — Text */}
        <div
          id="author"
          className="flex w-full flex-col gap-4 px-6 py-12 sm:gap-5 md:w-1/2 md:px-12 md:py-[70px] lg:gap-6 lg:px-20"
        >
          <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
            {cms(c, "about", "founder", "label", "THE FOUNDER")}
          </p>
          <h2 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
            {cms(c, "about", "founder", "name", "STERLING R. SMITH")}
          </h2>

          <div className="flex flex-col gap-4 text-base font-light leading-relaxed text-[#e0e0e0] sm:text-lg md:gap-5 md:text-xl md:leading-[1.6]">
            <p>
              {cms(c, "about", "founder", "bio_paragraph_1", "Sterling R. Smith founded Ink2Screen from a simple place — he had the idea. He is not driven by trends or reaction. His focus is straightforward: build a successful brand rooted in integrity and long-term influence.")}
            </p>
            <p>
              {cms(c, "about", "founder", "bio_paragraph_2", "With a professional background in engineering, Sterling approaches creative work with discipline and structure. He believes ideas deserve thoughtful development and intentional execution — not just exposure.")}
            </p>
            <p>
              {cms(c, "about", "founder", "bio_paragraph_3", "High-quality stories — the kind that move communities, elevate perspective, and present people in a stronger light — often struggle to move across mediums. Ink2Screen exists to bridge that gap.")}
            </p>
            <p>
              {cms(c, "about", "founder", "bio_paragraph_4", "He is building a platform centered on publishing, production, and literary events — with integrity at its core and influence as its outcome.")}
            </p>
          </div>
        </div>

        {/* Right — Portrait */}
        <div className="relative flex h-[450px] w-full items-center justify-center overflow-hidden bg-[#121212] sm:h-[550px] md:h-auto md:w-1/2">
          {/* Purple glow (CSS only) */}
          <div className="absolute left-1/2 top-[45%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/25 blur-[150px] md:h-[500px] md:w-[500px]" />

          {/* Portrait */}
          <div className="relative h-full w-full max-w-[540px] pt-8">
            <Image
              src={cms(c, "about", "founder", "portrait_image", "/images/sterling-portrait.jpg")}
              alt="Sterling R. Smith"
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-cover object-[center_10%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Capability Icons (SVG) ─── */
function LiteraryIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book */}
      <rect x="4" y="10" width="18" height="28" rx="2" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <rect x="28" y="10" width="18" height="28" rx="2" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      {/* Spine */}
      <line x1="25" y1="8" x2="25" y2="40" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Text lines — left page */}
      <line x1="9" y1="18" x2="18" y2="18" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="9" y1="23" x2="18" y2="23" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="9" y1="28" x2="18" y2="28" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      {/* Text lines — right page */}
      <line x1="32" y1="18" x2="41" y2="18" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="23" x2="41" y2="23" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="28" x2="41" y2="28" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function PublishingIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stack of pages / document */}
      <rect x="10" y="8" width="24" height="32" rx="2" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      <rect x="14" y="12" width="24" height="32" rx="2" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
      {/* Text lines */}
      <line x1="19" y1="20" x2="33" y2="20" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="19" y1="25" x2="33" y2="25" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      <line x1="19" y1="30" x2="28" y2="30" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function ScreenIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Camera body */}
      <rect x="6" y="14" width="30" height="22" rx="3" stroke="#E0E0E0" strokeWidth="1.5" fill="none" />
      {/* Lens / play triangle */}
      <polygon points="18,21 18,31 27,26" stroke="#E0E0E0" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Film reel / viewfinder */}
      <path d="M36 20 L44 14 L44 36 L36 30" stroke="#E0E0E0" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

function EventsIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ticket outline */}
      <path
        d="M5 15 h16 a0 0 0 0 1 0 0 c0 3 2 5 4 5 s4-2 4-5 a0 0 0 0 1 0 0 h16 v20 h-16 a0 0 0 0 1 0 0 c0-3-2-5-4-5 s-4 2-4 5 a0 0 0 0 1 0 0 h-16 z"
        stroke="#D4AF37"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Dashed center line */}
      <line x1="25" y1="17" x2="25" y2="33" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  )
}

/* ─── Our Capabilities ─── */
function CapabilitiesSection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  const capabilities = [
    {
      title: cms(c, "about", "capabilities", "card_1_title", "LITERARY DEVELOPMENT"),
      description: cms(c, "about", "capabilities", "card_1_description", "From manuscript refinement to global distribution. We treat books as the foundation of IP."),
      icon: <LiteraryIcon />,
    },
    {
      title: cms(c, "about", "capabilities", "card_2_title", "PUBLISHING"),
      description: cms(c, "about", "capabilities", "card_2_description", "Developing, protecting, and elevating original works through structured creative execution."),
      icon: <PublishingIcon />,
    },
    {
      title: cms(c, "about", "capabilities", "card_3_title", "SCREEN ADAPTATION"),
      description: cms(c, "about", "capabilities", "card_3_description", "Translating written narratives into visual scripts and production-ready formats for film and TV."),
      icon: <ScreenIcon />,
      highlighted: true,
    },
    {
      title: cms(c, "about", "capabilities", "card_4_title", "EVENTS & EXPERIENCES"),
      description: cms(c, "about", "capabilities", "card_4_description", "Live engagements, book signings, and the Ink & Indulgence series."),
      icon: <EventsIcon />,
    },
  ]

  return (
    <section className="bg-[#050505] px-6 py-16 md:py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8">
        <h2 className="text-center font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[64px]">
          {cms(c, "about", "capabilities", "title", "OUR CAPABILITIES")}
        </h2>

        <div className="flex w-full flex-col gap-6">
          {/* Top row — 2 cards */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Literary Development — wider */}
            <div className="group relative min-h-[220px] overflow-hidden rounded-[10px] bg-[#28292a] md:min-h-[262px] md:w-[60%]">
              <div className="absolute inset-0">
                <Image
                  src="/images/hero-bg-texture.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover opacity-10 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                    {capabilities[0].description}
                  </p>
                  {capabilities[0].icon}
                </div>
                <p className="font-heading text-2xl font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
                  {capabilities[0].title}
                </p>
              </div>
            </div>

            {/* Publishing */}
            <div className="group relative min-h-[220px] overflow-hidden rounded-[10px] bg-[#28292a] md:min-h-[262px] md:flex-1">
              <div className="absolute inset-0">
                <Image
                  src="/images/hero-bg-texture.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover opacity-10 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                    {capabilities[1].description}
                  </p>
                  {capabilities[1].icon}
                </div>
                <p className="font-heading text-2xl font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
                  {capabilities[1].title}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row — 2 cards */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Screen Adaptation — highlighted purple */}
            <div className="group relative min-h-[220px] overflow-hidden rounded-[10px] bg-[#240046] md:min-h-[262px] md:flex-1">
              <div className="absolute inset-0">
                <Image
                  src="/images/hero-bg-texture.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-15 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#f0f0f0]">
                    {capabilities[2].description}
                  </p>
                  {capabilities[2].icon}
                </div>
                <p className="font-heading text-2xl font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
                  {capabilities[2].title}
                </p>
              </div>
            </div>

            {/* Events & Experiences */}
            <div className="group relative min-h-[220px] overflow-hidden rounded-[10px] bg-[#28292a] md:min-h-[262px] md:flex-1">
              <div className="absolute inset-0">
                <Image
                  src="/images/hero-bg-texture.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-10 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                    {capabilities[3].description}
                  </p>
                  {capabilities[3].icon}
                </div>
                <p className="font-heading text-2xl font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
                  {capabilities[3].title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── (uses shared Testimonials component) */

/* ─── Experience the Narrative CTA ─── */
function ExperienceCTASection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="relative flex min-h-[453px] items-center justify-center overflow-hidden bg-[#240046]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/texture-dark.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10"
        />
      </div>

      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-6 px-6 py-16">
        <h2 className="text-center font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[64px]">
          {cms(c, "about", "cta", "title", "EXPERIENCE THE NARRATIVE")}
        </h2>

        <div className="flex flex-col items-center gap-4">
          <Button
            asChild
            className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          >
            <Link href="/artefacts">{cms(c, "about", "cta", "cta_primary_text", "VISIT THE ARTIFACTS")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          >
            <Link href="/contact">{cms(c, "about", "cta", "cta_secondary_text", "START A PROJECT")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── About Page ─── */
export default async function AboutPage() {
  const c = await getContent("about")

  return (
    <div className="bg-[#050505]">
      <HeroSection c={c} />
      <EngineerAuthorSection c={c} />
      <CapabilitiesSection c={c} />
      <Testimonials />
      <ExperienceCTASection c={c} />
    </div>
  )
}
