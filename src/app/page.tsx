import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="relative h-[720px] overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
      </div>

      {/* Purple glow accent */}
      <div className="absolute left-[110px] top-[60px] h-[382px] w-[384px]">
        <Image
          src="/images/purple-glow.png"
          alt=""
          width={980}
          height={980}
          className="h-full w-full scale-[2.5] object-contain opacity-60"
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1440px] items-center">
        {/* Left Content */}
        <div className="flex w-full flex-col gap-6 px-6 lg:w-1/2 lg:px-20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              INK2SCREEN PRESENTS
            </p>
            <h1 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
              EVERY STORY HAS A PURPOSE.
              <br />
              <span>WE ADD </span>
              <span className="text-brand-gold">POWER</span>
              <span> AND </span>
              <span className="text-brand-gold">PASSION</span>
              <span>.</span>
            </h1>
          </div>

          <p className="text-lg font-light leading-relaxed text-[#e0e0e0] md:text-2xl md:leading-[1.6]">
            Raison D&apos;etre is the debut novel from author and engineer{" "}
            <span className="font-bold">Sterling R. Smith</span>. A bold
            psychological journey developed through Ink2Screen, where powerful
            stories are built for both readers and future screen adaptation.
          </p>

          <div className="flex gap-4">
            <Button
              asChild
              className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              <Link href="/marketplace">GET THIS BOOK</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href="/about">WORK WITH INK2SCREEN</Link>
            </Button>
          </div>

          <p className="text-[11px] font-bold tracking-[0.05em] text-[#e0e0e0]">
            DEBUT NOVEL: RAISON D&apos;ETRE &nbsp;|&nbsp; CREATED BY INK2SCREEN
            &nbsp;|&nbsp; STORIES ENGINEERED
          </p>
        </div>

        {/* Right — Book Art */}
        <div className="hidden h-full w-1/2 items-center justify-center lg:flex">
          {/* Purple radial glow behind book */}
          <div className="absolute right-0 h-full w-1/2">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.5)_0%,rgba(5,5,5,0)_70%)]" />
          </div>
          <div className="relative h-[660px] w-[500px]">
            <Image
              src="/images/book-cover-front.png"
              alt="Raison D'etre book cover"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Engineering Narratives Section ─── */
function EngineeringNarrativesSection() {
  const pillars = [
    {
      title: "ORIGINAL CONCEPTS",
      description:
        'Developing bold psychological journeys and character-driven IP from the ground up."',
    },
    {
      title: "SCREEN ADAPTATION",
      description:
        "Structuring written works for visual translation. We build stories that demand to be seen.",
    },
    {
      title: "CULTURAL IMPACT",
      description:
        "Curating experiences that extend the story beyond the page into real-world connection.",
    },
  ]

  return (
    <section className="flex h-[400px] items-center justify-center px-6">
      <div className="mx-auto flex max-w-[1088px] flex-col items-center gap-8">
        <h2 className="text-center font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
          ENGINEERING NARRATIVES
        </h2>
        <div className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="flex items-center gap-8">
              {i > 0 && (
                <div className="hidden h-20 w-px bg-[#333] md:block" />
              )}
              <div className="flex w-80 flex-col gap-2 text-center">
                <p className="text-sm font-semibold tracking-[0.1em] text-[#f0f0f0]">
                  {pillar.title}
                </p>
                <p className="text-sm font-medium leading-relaxed text-[#888]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Book Spotlight (Raison D'être) Section ─── */
function BookSpotlightSection() {
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

      <div className="relative mx-auto flex min-h-[654px] max-w-[1440px] flex-col items-center md:flex-row">
        {/* Left Content */}
        <div className="flex w-full flex-col justify-center gap-6 px-6 py-16 md:w-1/2 md:px-20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              NOW AVAILABLE
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-white md:text-5xl">
              RAISON D&apos;ETRE
            </h2>
          </div>

          <p className="text-2xl font-light leading-relaxed text-[#e0e0e0]">
            Every psyche has a breaking point.
          </p>

          <p className="text-base font-normal leading-[1.7] text-[#888]">
            A psychological deep dive into the human condition. Sterling R.
            Smith&apos;s debut novel challenges the boundaries of purpose and
            existence. Available in Hardcover and Digital formats.
          </p>

          <div className="flex gap-4">
            <Button
              asChild
              className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              <Link href="/marketplace">ORDER HARDCOVER</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href="/marketplace">READ THE FIRST CHAPTER</Link>
            </Button>
          </div>
        </div>

        {/* Right — Book Images */}
        <div className="relative flex h-[500px] w-full items-center justify-center md:h-[654px] md:w-1/2">
          {/* Purple glow behind books */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.4)_0%,transparent_70%)]" />
          <div className="relative flex items-center">
            <div className="relative -mr-5 h-[525px] w-[311px]">
              <Image
                src="/images/book-spotlight.png"
                alt="Raison D'etre hardcover"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative -ml-5 h-[525px] w-[357px]">
              <Image
                src="/images/book-cover-back.png"
                alt="Raison D'etre back cover"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── The Feed Section ─── */
function TheFeedSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      {/* Background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-20 mix-blend-multiply"
        />
      </div>

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-8">
        {/* Video Grid */}
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* Main Video — YouTube */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-white md:h-[632px] md:w-[570px]">
            <Image
              src="/images/video-placeholder.jpg"
              alt="YouTube content"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="font-heading text-2xl font-bold text-white/60">
                VIDEO PLACEHOLDER
              </p>
            </div>
          </div>

          {/* Side Videos — TikTok */}
          <div className="flex w-full flex-col gap-4 md:w-[397px]">
            <div className="relative h-[300px] overflow-hidden rounded-lg bg-white md:h-[470px]">
              <Image
                src="/images/video-placeholder.jpg"
                alt="TikTok content"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="font-heading text-xl font-bold text-white/60">
                  VIDEO PLACEHOLDER
                </p>
              </div>
            </div>
            <div className="relative h-[146px] overflow-hidden rounded-lg bg-white">
              <Image
                src="/images/video-placeholder.jpg"
                alt="Social content"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
            The Feed
          </h2>
          <p className="text-center text-base font-normal leading-[1.7] text-[#f0f0f0]">
            Behind the scenes, author insights, and visual storytelling.
          </p>
          <Button
            asChild
            variant="outline"
            className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          >
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              FOLLOW @INK2SCREEN
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Ink & Indulgence Event Section ─── */
function InkAndIndulgenceSection() {
  return (
    <section className="px-6 py-8">
      <div className="relative mx-auto max-w-[1260px] overflow-hidden rounded-[50px] border border-[#2e004e] bg-[#121212]">
        {/* Background texture */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-texture.jpg"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-multiply"
          />
        </div>

        <div className="relative flex min-h-[578px] flex-col items-center justify-center gap-6 px-6 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              CULTURAL EXPERIENCE
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
              INK &amp; INDULGENCE
            </h2>
          </div>

          <p className="text-center font-heading text-2xl font-bold leading-[1.4] tracking-tight text-brand-gold md:text-[32px]">
            Vol. 1: The Launch
          </p>

          <p className="max-w-[637px] text-center text-xl font-light leading-relaxed text-[#f0f0f0] md:text-2xl">
            Join us for a refined evening of conversation, storytelling, and the
            official release of Raison D&apos;etre.
          </p>

          <p className="text-center text-sm font-bold leading-relaxed text-[#f0f0f0]">
            HOUSTON, TEXAS &bull; LATE 2026
          </p>

          <Button
            asChild
            className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          >
            <Link href="/events">JOIN THE WAITLIST</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Control the Narrative CTA Section ─── */
function ControlTheNarrativeSection() {
  return (
    <section className="relative flex min-h-[401px] items-center justify-center overflow-hidden px-6">
      {/* Purple radial glow bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.4)_0%,transparent_70%)]" />

      {/* Background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-10">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
            CONTROL THE NARRATIVE
          </h2>
          <p className="text-base font-normal leading-[1.7] text-[#f0f0f0]">
            Join the Ink2Screen Registry for early access to manuscripts, event
            tickets, and exclusive merchandise.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <div className="flex w-full flex-col gap-1 sm:w-80">
            <label className="text-[11px] font-bold tracking-[0.05em] text-brand-gold">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-10 rounded-none border-b border-l-0 border-r-0 border-t-0 border-[#333] bg-transparent px-0 text-sm text-[#e0e0e0] placeholder:text-[#555] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark">
            SIGN UP
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Homepage ─── */
export default function HomePage() {
  return (
    <div className="bg-[#050505]">
      <HeroSection />
      <EngineeringNarrativesSection />
      <BookSpotlightSection />
      <TheFeedSection />
      <InkAndIndulgenceSection />
      <ControlTheNarrativeSection />
    </div>
  )
}
