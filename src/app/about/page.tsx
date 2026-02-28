import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Testimonials } from "@/components/testimonials"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Ink2Screen LLC Publishing, founded by Sterling R. Smith — engineering narratives for readers and screen adaptation.",
}

/* ─── Hero — Mission Statement ─── */
function HeroSection() {
  return (
    <section className="relative flex h-[578px] items-center justify-center overflow-hidden bg-[#050505]">
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

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
            OUR MISSION
          </p>
          <h1 className="font-heading text-5xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] md:text-[64px]">
            IDEAS INTO INK.
            <br />
            INK INTO IMPACT.
          </h1>
        </div>

        <p className="max-w-[800px] text-xl font-light leading-relaxed text-[#e0e0e0] md:text-2xl md:leading-[1.6]">
          Raison D&apos;etre is the debut novel from author and engineer
          Sterling R. Smith. A bold psychological journey developed through
          Ink2Screen, where powerful stories are built for both readers and
          future screen adaptation.
        </p>
      </div>
    </section>
  )
}

/* ─── The Engineer & The Author ─── */
function EngineerAuthorSection() {
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

      <div className="relative mx-auto flex min-h-[720px] max-w-[1440px] flex-col md:flex-row">
        {/* Left — Text */}
        <div
          id="author"
          className="flex w-full flex-col gap-6 px-6 py-16 md:w-1/2 md:px-20 md:py-[70px]"
        >
          <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
            THE ENGINEER &amp; THE AUTHOR
          </h2>

          <div className="flex flex-col gap-6 text-xl font-light leading-relaxed text-[#e0e0e0] md:text-2xl md:leading-[1.6]">
            <p>
              Sterling R. Smith represents the intersection of structural
              precision and narrative fluidity. As an engineer, he understands
              the architecture of things; as an author, he understands the
              architecture of the human psyche.
            </p>
            <p>
              Ink2Screen was founded on a singular premise:{" "}
              <span className="font-bold">Ownership</span>. To control the
              narrative, one must own the intellectual property. Sterling leads
              the studio with a focus on cultivating authors, writers, and
              burgeoning creatives who want to turn their ideas into lasting
              cultural legacy.
            </p>
          </div>
        </div>

        {/* Right — Portrait */}
        <div className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-[#121212] md:h-auto md:w-1/2">
          {/* Purple glow (CSS only) */}
          <div className="absolute left-1/2 top-[45%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/25 blur-[150px]" />

          {/* Portrait */}
          <div className="relative h-full w-[540px] pt-8">
            <Image
              src="/images/sterling-portrait.jpg"
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
function CapabilitiesSection() {
  const capabilities = [
    {
      title: "LITERARY DEVELOPMENT",
      description:
        "From manuscript refinement to global distribution. We treat books as the foundation of IP.",
      icon: <LiteraryIcon />,
    },
    {
      title: "SCREEN ADAPTATION",
      description:
        "Translating written narratives into visual scripts and production-ready formats for film and TV.",
      icon: <ScreenIcon />,
      highlighted: true,
    },
    {
      title: "EVENTS & EXPERIENCES",
      description:
        "Live engagements, book signings, and the Ink & Indulgence series.",
      icon: <EventsIcon />,
    },
  ]

  return (
    <section className="bg-[#050505] px-6 py-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8">
        <h2 className="text-center font-heading text-5xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] md:text-[64px]">
          OUR CAPABILITIES
        </h2>

        <div className="flex w-full flex-col gap-6">
          {/* Top row — 2 cards */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Literary Development — wider */}
            <div className="group relative h-[262px] overflow-hidden rounded-[10px] bg-[#28292a] md:w-[60%]">
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

            {/* Screen Adaptation — highlighted purple */}
            <div className="group relative h-[262px] overflow-hidden rounded-[10px] bg-[#240046] md:flex-1">
              <div className="absolute inset-0">
                <Image
                  src="/images/hero-bg-texture.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover opacity-15 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#f0f0f0]">
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

          {/* Bottom row — full width */}
          <div className="group relative h-[262px] overflow-hidden rounded-[10px] bg-[#28292a]">
            <div className="absolute inset-0">
              <Image
                src="/images/hero-bg-texture.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-10 mix-blend-soft-light"
              />
            </div>
            <div className="relative flex h-full flex-col justify-between p-8">
              <div className="flex items-center gap-5">
                <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                  {capabilities[2].description}
                </p>
                {capabilities[2].icon}
              </div>
              <p className="font-heading text-2xl font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
                {capabilities[2].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── (uses shared Testimonials component) */

/* ─── Experience the Narrative CTA ─── */
function ExperienceCTASection() {
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
        <h2 className="text-center font-heading text-5xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] md:text-[64px]">
          EXPERIENCE THE NARRATIVE
        </h2>

        <div className="flex flex-col items-center gap-4">
          <Button
            asChild
            className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          >
            <Link href="/artefacts">VISIT THE ARTIFACTS</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          >
            <Link href="/contact">START A PROJECT</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── About Page ─── */
export default function AboutPage() {
  return (
    <div className="bg-[#050505]">
      <HeroSection />
      <EngineerAuthorSection />
      <CapabilitiesSection />
      <Testimonials />
      <ExperienceCTASection />
    </div>
  )
}
