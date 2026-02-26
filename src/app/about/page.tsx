import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          className="object-cover opacity-10 mix-blend-multiply"
        />
      </div>

      <div className="relative mx-auto flex min-h-[720px] max-w-[1440px] flex-col md:flex-row">
        {/* Left — Text */}
        <div
          id="author"
          className="flex w-full flex-col gap-6 px-6 py-16 md:w-1/2 md:px-20 md:py-[60px]"
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
        <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-[#121212] md:h-auto md:w-1/2">
          {/* Purple glow */}
          <div className="absolute inset-0">
            <Image
              src="/images/purple-glow-portrait.png"
              alt=""
              fill
              className="object-contain opacity-80"
            />
          </div>

          {/* Portrait */}
          <div className="relative h-full w-[540px]">
            <Image
              src="/images/sterling-portrait.jpg"
              alt="Sterling R. Smith"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Our Capabilities ─── */
function CapabilitiesSection() {
  const capabilities = [
    {
      title: "LITERARY DEVELOPMENT",
      description:
        "From manuscript refinement to global distribution. We treat books as the foundation of IP.",
      icon: "/images/icon-literary.png",
      wide: true,
    },
    {
      title: "SCREEN ADAPTATION",
      description:
        "Translating written narratives into visual scripts and production-ready formats for film and TV.",
      icon: "/images/icon-screen.png",
      wide: false,
      highlighted: true,
    },
    {
      title: "EVENTS & EXPERIENCES",
      description:
        "Live engagements, book signings, and the Ink & Indulgence series.",
      icon: "/images/icon-events.png",
      fullWidth: true,
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
                  className="object-cover opacity-10 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                    {capabilities[0].description}
                  </p>
                  <Image
                    src={capabilities[0].icon}
                    alt=""
                    width={60}
                    height={60}
                  />
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
                  className="object-cover opacity-15 mix-blend-soft-light"
                />
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div className="flex items-center gap-5">
                  <p className="flex-1 text-sm font-medium leading-relaxed text-[#f0f0f0]">
                    {capabilities[1].description}
                  </p>
                  <Image
                    src={capabilities[1].icon}
                    alt=""
                    width={60}
                    height={60}
                  />
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
                className="object-cover opacity-10 mix-blend-soft-light"
              />
            </div>
            <div className="relative flex h-full flex-col justify-between p-8">
              <div className="flex items-center gap-5">
                <p className="flex-1 text-sm font-medium leading-relaxed text-[#888]">
                  {capabilities[2].description}
                </p>
                <Image
                  src={capabilities[2].icon}
                  alt=""
                  width={60}
                  height={60}
                />
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

/* ─── Testimonials ─── */
function TestimonialsSection() {
  return (
    <section className="relative h-[760px] overflow-hidden bg-gradient-to-br from-brand-gold/20 to-[#aa8324]/20">
      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-5 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1240px] items-center px-6">
        <div className="flex w-full flex-col overflow-hidden md:flex-row">
          {/* Photo */}
          <div className="relative h-[400px] w-full overflow-hidden md:h-auto md:w-[466px]">
            <Image
              src="/images/library-bg.jpg"
              alt="Testimonial"
              fill
              className="object-cover"
            />
          </div>

          {/* Quote */}
          <div className="flex flex-1 flex-col gap-6 bg-[#28292a] p-6">
            <Image
              src="/images/icon-quote.png"
              alt=""
              width={100}
              height={100}
            />

            <p className="text-xl font-light leading-relaxed text-[#f0f0f0] md:text-2xl md:leading-[1.6]">
              &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.&rdquo;
            </p>

            <p className="text-right text-xl font-medium leading-relaxed text-[#f0f0f0] md:text-2xl">
              John A. Doe
            </p>

            <div className="flex flex-col items-end">
              <Button className="h-14 w-14 bg-brand-gold p-0 hover:bg-brand-gold-dark">
                <ChevronRight className="h-6 w-6 text-[#050505]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
          className="object-cover opacity-10"
        />
      </div>

      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
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
      <TestimonialsSection />
      <ExperienceCTASection />
    </div>
  )
}
