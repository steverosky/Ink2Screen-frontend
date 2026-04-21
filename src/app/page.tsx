import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getContent } from "@/lib/cms"
import { SocialFeedSection } from "@/components/social-feed"

/* Extract a YouTube video ID from a raw ID or any common URL form. */
function parseYoutubeId(input?: string): string {
  if (!input) return ""
  const v = input.trim()
  if (!v || v.startsWith("/")) return ""
  if (!/[/.?=]/.test(v)) return v
  const short = v.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  if (short) return short[1]
  const watch = v.match(/[?&]v=([A-Za-z0-9_-]{6,})/)
  if (watch) return watch[1]
  const path = v.match(/\/(?:embed|shorts|v|live)\/([A-Za-z0-9_-]{6,})/)
  if (path) return path[1]
  return ""
}

/* Extract a TikTok numeric video ID from an ID or any common URL form. */
function parseTiktokId(input?: string): string {
  if (!input) return ""
  const v = input.trim()
  if (!v || v.startsWith("/")) return ""
  if (/^\d{6,}$/.test(v)) return v
  const m = v.match(/\/video\/(\d+)/)
  if (m) return m[1]
  return ""
}

/* ─── Hero Section ─── */
function HeroSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const hero = c.hero || {}

  const superscript = hero.superscript || "INK2SCREEN PRESENTS"
  const headline_line_1 = hero.headline_line_1 || "EVERY STORY HAS A PURPOSE."
  const headline_line_2_prefix = hero.headline_line_2_prefix || "WE ADD "
  const headline_accent_1 = hero.headline_accent_1 || "POWER"
  const headline_line_2_middle = hero.headline_line_2_middle || " AND "
  const headline_accent_2 = hero.headline_accent_2 || "PASSION"
  const headline_line_2_suffix = hero.headline_line_2_suffix || "."
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
  const book_art_image = hero.book_art_image || "/images/hero-book-art.png"
  const book_cover_image = hero.book_cover_image || "/images/book-cover-back.png"

  return (
    <section className="relative min-h-[580px] overflow-hidden sm:h-[720px] sm:min-h-0">
      {/* Background texture */}
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
      <div className="absolute left-[10%] top-[10%] h-[300px] w-[400px] rounded-full bg-brand-purple/15 blur-[150px] sm:h-[400px] sm:w-[500px]" />

      <div className="relative mx-auto flex h-full max-w-[1440px] items-center py-16 sm:py-0">
        {/* Left Content */}
        <div className="flex w-full flex-col gap-5 px-5 sm:gap-6 sm:px-6 lg:w-1/2 lg:px-20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              {superscript}
            </p>
            <h1 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
              {headline_line_1}
              <br />
              <span>{headline_line_2_prefix}</span>
              <span className="text-brand-gold">{headline_accent_1}</span>
              <span>{headline_line_2_middle}</span>
              <span className="text-brand-gold">{headline_accent_2}</span>
              <span>{headline_line_2_suffix}</span>
            </h1>
          </div>

          <p className="text-base font-light leading-relaxed text-[#e0e0e0] sm:text-lg md:text-2xl md:leading-[1.6]">
            {description}
          </p>

          {/* CTA buttons — stacked on mobile, side by side on sm+ */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              className="h-12 w-full bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark sm:h-14 sm:w-auto"
            >
              <Link href={cta_primary_link}>{cta_primary_text}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10 sm:h-14 sm:w-auto"
            >
              <Link href={cta_secondary_link}>{cta_secondary_text}</Link>
            </Button>
          </div>

          <p className="text-[11px] font-bold tracking-[0.05em] text-[#e0e0e0]">
            {footer_text}
          </p>
        </div>

        {/* Right — Book Art (desktop only) */}
        <div className="hidden h-full w-1/2 items-center justify-center lg:flex">
          <div className="absolute right-0 top-[125px] h-[760px] w-[850px]">
            <Image
              src={book_art_image}
              alt=""
              width={850}
              height={760}
              className="h-full w-full -rotate-[92deg] object-contain opacity-40"
            />
          </div>
          <div className="absolute right-0 h-full w-1/2">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.5)_0%,rgba(5,5,5,0)_70%)]" />
          </div>
          <div className="relative h-[660px] w-[500px]">
            <Image
              src={book_cover_image}
              alt="Raison D'etre book cover"
              fill
              sizes="500px"
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
    <section className="flex items-center justify-center px-5 py-14 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-[1088px] flex-col items-center gap-10">
        <h2 className="text-center font-heading text-3xl font-bold leading-[1.3] tracking-tight text-brand-gold sm:text-4xl md:text-5xl">
          {sectionTitle}
        </h2>
        <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:gap-8">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="flex w-full flex-col items-center gap-2 text-center md:flex-1">
              {/* Divider between pillars on desktop */}
              {i > 0 && (
                <div className="mb-10 h-px w-full bg-brand-gold/20 md:hidden" />
              )}
              <p className="text-sm font-semibold tracking-[0.1em] text-[#f0f0f0]">
                {pillar.title}
              </p>
              <p className="max-w-xs text-sm font-medium leading-relaxed text-[#888] sm:max-w-none">
                {pillar.description}
              </p>
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
  const front_image = s.front_image || "/images/book-spotlight.png"
  const back_image = s.back_image || "/images/book-cover-back.png"

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

      <div className="relative mx-auto flex max-w-[1440px] flex-col md:flex-row">
        {/* Left Content */}
        <div className="flex w-full flex-col justify-center gap-5 px-5 py-12 sm:gap-6 sm:px-6 sm:py-16 md:w-1/2 md:px-20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              {label}
            </p>
            <h2 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-white sm:text-4xl md:text-5xl">
              {title}
            </h2>
          </div>

          <p className="text-xl font-light leading-relaxed text-[#e0e0e0] sm:text-2xl">
            {tagline}
          </p>

          <p className="text-base font-normal leading-[1.7] text-[#888]">
            {description}
          </p>

          {/* CTA buttons — stacked on mobile */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              className="h-12 w-full bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark sm:h-14 sm:w-auto"
            >
              <Link href="/artefacts">{cta_primary_text}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 w-full border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10 sm:h-14 sm:w-auto"
            >
              <Link href="/artefacts">{cta_secondary_text}</Link>
            </Button>
          </div>
        </div>

        {/* Right — Book Images — responsive sizes */}
        <div className="relative flex h-[320px] w-full items-center justify-center sm:h-[440px] md:h-[654px] md:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.4)_0%,transparent_70%)]" />
          <div className="relative flex items-center">
            <div className="relative -mr-3 h-[270px] w-[160px] sm:-mr-4 sm:h-[380px] sm:w-[225px] md:-mr-5 md:h-[525px] md:w-[311px]">
              <Image
                src={front_image}
                alt="Raison D'etre hardcover"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 225px, 311px"
                className="object-contain"
              />
            </div>
            <div className="relative -ml-3 h-[270px] w-[185px] sm:-ml-4 sm:h-[380px] sm:w-[260px] md:-ml-5 md:h-[525px] md:w-[357px]">
              <Image
                src={back_image}
                alt="Raison D'etre back cover"
                fill
                sizes="(max-width: 640px) 185px, (max-width: 768px) 260px, 357px"
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
  const youtube_id = parseYoutubeId(f.youtube_video) || "D9Ihs241zeg"
  const youtube_label = f.youtube_label || "Author Insights"
  const youtube_channel = f.youtube_channel || "https://youtube.com/@Ink2ScreenLLC"
  const tiktok_id = parseTiktokId(f.tiktok_video) || "7578671437095963935"
  const tiktok_label = f.tiktok_label || "Behind the Scenes"
  const tiktok_channel = f.tiktok_channel || "https://tiktok.com/@ink2screen"

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20">
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
          {/* YouTube */}
          <div className="relative h-[260px] w-full overflow-hidden rounded-lg bg-[#121212] sm:h-[360px] md:h-[632px] md:w-[570px]">
            {youtube_id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtube_id}?autoplay=1&mute=1&loop=1&playlist=${youtube_id}&controls=1&rel=0&modestbranding=1`}
                title={youtube_label}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <Link
                href={youtube_channel}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#1a0a2e] via-[#0d0d0d] to-[#1a1a1a] transition-all hover:from-[#220d3a]"
              >
                {/* YouTube play button */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                  <svg viewBox="0 0 90 20" className="h-5 w-auto fill-[#050505]">
                    <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324ZM11.4253 14.2854V5.71458L18.8477 10.0015L11.4253 14.2854Z" />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="font-heading text-lg font-bold text-[#f0f0f0]">@Ink2ScreenLLC</p>
                  <p className="text-sm text-[#aaa]">{youtube_label}</p>
                  <p className="mt-1 text-xs font-semibold tracking-widest text-brand-gold">WATCH ON YOUTUBE →</p>
                </div>
              </Link>
            )}
            {youtube_id && (
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-6 sm:left-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/90 sm:h-10 sm:w-10">
                  <svg viewBox="0 0 90 20" className="h-3 w-auto fill-[#050505]">
                    <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324ZM11.4253 14.2854V5.71458L18.8477 10.0015L11.4253 14.2854Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white drop-shadow">YouTube</p>
                  <p className="text-xs text-white/60 drop-shadow">{youtube_label}</p>
                </div>
              </div>
            )}
          </div>

          {/* TikTok */}
          <div className="relative h-[340px] w-full overflow-hidden rounded-lg bg-[#121212] sm:h-[440px] md:h-[632px] md:w-[397px]">
            {tiktok_id ? (
              <iframe
                src={`https://www.tiktok.com/embed/v2/${tiktok_id}`}
                title={tiktok_label}
                allow="encrypted-media"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <Link
                href={tiktok_channel}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#0d0d1a] via-[#0d0d0d] to-[#1a0a2e] transition-all hover:from-[#0d0d22]"
              >
                {/* TikTok icon badge */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-[#050505]">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="font-heading text-lg font-bold text-[#f0f0f0]">@ink2screen</p>
                  <p className="text-sm text-[#aaa]">{tiktok_label}</p>
                  <p className="mt-1 text-xs font-semibold tracking-widest text-brand-gold">FOLLOW ON TIKTOK →</p>
                </div>
              </Link>
            )}
            {tiktok_id && (
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 sm:bottom-6 sm:left-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/90 sm:h-10 sm:w-10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#050505]">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white drop-shadow">TikTok</p>
                  <p className="text-xs text-white/60 drop-shadow">{tiktok_label}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-brand-gold sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-base font-normal leading-[1.7] text-[#f0f0f0]">
            {description}
          </p>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10 sm:h-14 sm:w-auto"
          >
            <Link href={cta_link} target="_blank" rel="noopener noreferrer">
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
    <section className="px-4 py-8 sm:px-6">
      <div className="relative mx-auto max-w-[1260px] overflow-hidden rounded-2xl border border-[#2e004e] bg-[#121212] sm:rounded-[40px] lg:rounded-[50px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-texture.jpg"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-multiply"
          />
        </div>

        <div className="relative flex min-h-[480px] flex-col items-center justify-center gap-5 px-5 py-14 text-center sm:gap-6 sm:px-8 sm:py-16 md:min-h-[578px]">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              {label}
            </p>
            <h2 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
              {title}
            </h2>
          </div>

          <p className="font-heading text-xl font-bold leading-[1.4] tracking-tight text-brand-gold sm:text-2xl md:text-[32px]">
            {subtitle}
          </p>

          <p className="max-w-[560px] text-lg font-light leading-relaxed text-[#f0f0f0] sm:text-xl md:text-2xl">
            {description}
          </p>

          <p className="text-sm font-bold leading-relaxed text-[#f0f0f0]">
            {location}
          </p>

          <Button
            asChild
            className="h-12 w-full bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark sm:h-14 sm:w-auto"
          >
            <Link href={cta_link}>{cta_text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Social Feed Section ─── */
function SocialSection({
  c,
}: {
  c: Record<string, Record<string, string>>
}) {
  const s = c.social_feed || {}

  const title = s.title || "FOLLOW THE JOURNEY"
  const description =
    s.description || "Stay connected with the latest from Ink2Screen."

  const DEFAULT_POSTS: { platform: "instagram" | "tiktok"; url: string }[] = [
    { platform: "instagram", url: "https://www.instagram.com/reel/DWU27xdjRHd/" },
    { platform: "tiktok", url: "https://www.tiktok.com/@ink2screen/video/7578671437095963935" },
  ]

  const rawPosts = [
    { platform: s.post_1_platform, url: s.post_1_url },
    { platform: s.post_2_platform, url: s.post_2_url },
    { platform: s.post_3_platform, url: s.post_3_url },
  ].filter(
    (p): p is { platform: "instagram" | "tiktok"; url: string } =>
      !!p.url && (p.platform === "instagram" || p.platform === "tiktok")
  )

  const posts = rawPosts.length > 0 ? rawPosts : DEFAULT_POSTS

  return (
    <SocialFeedSection
      title={title}
      description={description}
      posts={posts}
      channelLinks={{
        instagram: "https://instagram.com/ink2screen",
        tiktok: "https://tiktok.com/@ink2screen",
      }}
    />
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
    <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden px-5 py-16 sm:min-h-[401px] sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,0,78,0.4)_0%,transparent_70%)]" />
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1088px] flex-col items-center gap-8 sm:gap-10">
        <div className="flex flex-col gap-3 text-center sm:gap-4">
          <h2 className="font-heading text-3xl font-bold leading-[1.3] tracking-tight text-brand-gold sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-base font-normal leading-[1.7] text-[#f0f0f0]">
            {description}
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold tracking-[0.05em] text-brand-gold">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-10 w-full rounded-none border-b border-l-0 border-r-0 border-t-0 border-[#333] bg-transparent px-0 text-sm text-[#e0e0e0] placeholder:text-[#555] focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-80"
            />
          </div>
          <Button className="h-12 w-full bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark sm:h-14 sm:w-auto">
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
    <div className="overflow-x-hidden bg-[#050505]">
      <HeroSection c={c} />
      <EngineeringNarrativesSection c={c} />
      <BookSpotlightSection c={c} />
      <TheFeedSection c={c} />
      <SocialSection c={c} />
      <InkAndIndulgenceSection c={c} />
      <ControlTheNarrativeSection c={c} />
    </div>
  )
}
