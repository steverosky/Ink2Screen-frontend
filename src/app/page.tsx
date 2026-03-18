import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getContent } from "@/lib/cms"

/* ─── Hero Section ─── */
function HeroSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const hero = c.hero || {}

  const superscript = hero.superscript || "INK2SCREEN PRESENTS"
  const description =
    hero.description ||
    "Raison D'etre is the debut novel from author and engineer Sterling R. Smith. A bold psychological journey developed through Ink2Screen, where powerful stories are built for both readers and future screen adaptation."
  const cta_primary_text = hero.cta_primary_text || "GET THIS BOOK"
  const cta_primary_link = hero.cta_primary_link || "/artefacts"
  const cta_secondary_text = hero.cta_secondary_text || "WORK WITH INK2SCREEN"
  const cta_secondary_link = hero.cta_secondary_link || "/about"
  const footer_text =
    hero.footer_text ||
    "DEBUT NOVEL: RAISON D'ETRE  |  CREATED BY INK2SCREEN  |  STORIES ENGINEERED"

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

      {/* Purple glow accent (CSS only) */}
      <div className="absolute left-[10%] top-[10%] h-[400px] w-[500px] rounded-full bg-brand-purple/15 blur-[150px]" />

      <div className="relative mx-auto flex h-full max-w-[1440px] items-center">
        {/* Left Content */}
        <div className="flex w-full flex-col gap-6 px-6 lg:w-1/2 lg:px-20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              {superscript}
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
            {description}
          </p>

          <div className="flex gap-4">
            <Button
              asChild
              className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              <Link href={cta_primary_link}>{cta_primary_text}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href={cta_secondary_link}>{cta_secondary_text}</Link>
            </Button>
          </div>

          <p className="text-[11px] font-bold tracking-[0.05em] text-[#e0e0e0]">
            {footer_text}
          </p>
        </div>

        {/* Right — Book Art */}
        <div className="hidden h-full w-1/2 items-center justify-center lg:flex">
          {/* Faded book art background — rotated behind */}
          <div className="absolute right-0 top-[125px] h-[760px] w-[850px]">
            <Image
              src="/images/hero-book-art.png"
              alt=""
              width={850}
              height={760}
              className="h-full w-full -rotate-[92deg] object-contain opacity-40"
            />
          </div>

          {/* Purple radial glow behind book */}
          <div className="absolute right-0 h-full w-1/2">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.5)_0%,rgba(5,5,5,0)_70%)]" />
          </div>

          {/* Book cover on top */}
          <div className="relative h-[660px] w-[500px]">
            <Image
              src="/images/book-cover-back.png"
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
function EngineeringNarrativesSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const n = c.narratives || {}

  const sectionTitle = n.title || "ENGINEERING NARRATIVES"

  const pillars = [
    {
      title: n.pillar_1_title || "ORIGINAL CONCEPTS",
      description:
        n.pillar_1_description ||
        'Developing bold psychological journeys and character-driven IP from the ground up."',
    },
    {
      title: n.pillar_2_title || "SCREEN ADAPTATION",
      description:
        n.pillar_2_description ||
        "Structuring written works for visual translation. We build stories that demand to be seen.",
    },
    {
      title: n.pillar_3_title || "CULTURAL IMPACT",
      description:
        n.pillar_3_description ||
        "Curating experiences that extend the story beyond the page into real-world connection.",
    },
  ]

  return (
    <section className="flex h-[400px] items-center justify-center px-6">
      <div className="mx-auto flex max-w-[1088px] flex-col items-center gap-8">
        <h2 className="text-center font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
          {sectionTitle}
        </h2>
        <div className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex items-center gap-8">
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
function BookSpotlightSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const s = c.spotlight || {}

  const label = s.label || "NOW AVAILABLE"
  const title = s.title || "RAISON D'ETRE"
  const tagline = s.tagline || "Every psyche has a breaking point."
  const description =
    s.description ||
    "A psychological deep dive into the human condition. Sterling R. Smith's debut novel challenges the boundaries of purpose and existence. Available in Hardcover and Digital formats."
  const cta_primary_text = s.cta_primary_text || "ORDER HARDCOVER"
  const cta_secondary_text = s.cta_secondary_text || "READ THE FIRST CHAPTER"

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
              {label}
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-white md:text-5xl">
              {title}
            </h2>
          </div>

          <p className="text-2xl font-light leading-relaxed text-[#e0e0e0]">
            {tagline}
          </p>

          <p className="text-base font-normal leading-[1.7] text-[#888]">
            {description}
          </p>

          <div className="flex gap-4">
            <Button
              asChild
              className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              <Link href="/artefacts">{cta_primary_text}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href="/artefacts">{cta_secondary_text}</Link>
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
function TheFeedSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const f = c.feed || {}

  const title = f.title || "The Feed"
  const description =
    f.description ||
    "Behind the scenes, author insights, and visual storytelling."
  const cta_text = f.cta_text || "FOLLOW @INK2SCREEN"
  const cta_link = f.cta_link || "https://instagram.com/ink2screen"
  const youtube_video = f.youtube_video || "/videos/youtube-author-insights.mp4"
  const youtube_label = f.youtube_label || "Author Insights"
  const tiktok_video = f.tiktok_video || "/videos/tiktok-behind-scenes.mp4"
  const tiktok_label = f.tiktok_label || "Behind the Scenes"

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
          {/* Main Video — YouTube style */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-[#121212] md:h-[632px] md:w-[570px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={youtube_video} type="video/mp4" />
            </video>
            {/* Dark overlay with play icon hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/90">
                <svg
                  viewBox="0 0 24 24"
                  fill="#050505"
                  className="ml-1 h-5 w-5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">YouTube</p>
                <p className="text-xs text-white/60">{youtube_label}</p>
              </div>
            </div>
          </div>

          {/* TikTok style — vertical */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-[#121212] md:h-[632px] md:w-[397px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={tiktok_video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/90">
                <svg
                  viewBox="0 0 24 24"
                  fill="#050505"
                  className="ml-0.5 h-5 w-5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">TikTok</p>
                <p className="text-xs text-white/60">{tiktok_label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
            {title}
          </h2>
          <p className="text-center text-base font-normal leading-[1.7] text-[#f0f0f0]">
            {description}
          </p>
          <Button
            asChild
            variant="outline"
            className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          >
            <Link
              href={cta_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta_text}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Ink & Indulgence Event Section ─── */
function InkAndIndulgenceSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const e = c.ink_indulgence || {}

  const label = e.label || "CULTURAL EXPERIENCE"
  const title = e.title || "INK & INDULGENCE"
  const subtitle = e.subtitle || "Vol. 1: The Launch"
  const description =
    e.description ||
    "Join us for a refined evening of conversation, storytelling, and the official release of Raison D'etre."
  const location = e.location || "HOUSTON, TEXAS \u2022 LATE 2026"
  const cta_text = e.cta_text || "JOIN THE WAITLIST"
  const cta_link = e.cta_link || "/events"

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
              {label}
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
              {title}
            </h2>
          </div>

          <p className="text-center font-heading text-2xl font-bold leading-[1.4] tracking-tight text-brand-gold md:text-[32px]">
            {subtitle}
          </p>

          <p className="max-w-[637px] text-center text-xl font-light leading-relaxed text-[#f0f0f0] md:text-2xl">
            {description}
          </p>

          <p className="text-center text-sm font-bold leading-relaxed text-[#f0f0f0]">
            {location}
          </p>

          <Button
            asChild
            className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          >
            <Link href={cta_link}>{cta_text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Control the Narrative CTA Section ─── */
function ControlTheNarrativeSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const n = c.newsletter || {}

  const title = n.title || "CONTROL THE NARRATIVE"
  const description =
    n.description ||
    "Join the Ink2Screen Registry for early access to manuscripts, event tickets, and exclusive merchandise."

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
            {title}
          </h2>
          <p className="text-base font-normal leading-[1.7] text-[#f0f0f0]">
            {description}
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
export default async function HomePage() {
  const content = await getContent("home")
  const c = content.home || {}

  return (
    <div className="bg-[#050505]">
      <HeroSection c={c} />
      <EngineeringNarrativesSection c={c} />
      <BookSpotlightSection c={c} />
      <TheFeedSection c={c} />
      <InkAndIndulgenceSection c={c} />
      <ControlTheNarrativeSection c={c} />
    </div>
  )
}
