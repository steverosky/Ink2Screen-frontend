import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Ticket, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCalendar } from "./event-calendar"
import {
  getUpcomingEvents,
  formatEventDate,
  formatEventTime,
  formatEventPrice,
  EVENT_TYPE_LABELS,
  type EventListItem,
} from "@/lib/events-api"
import { getContent, cms } from "@/lib/cms"
import { StructuredData } from "@/components/structured-data"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Book signings, author talks, workshops, and the Ink & Indulgence cultural experience series from Ink2Screen LLC Publishing.",
  openGraph: {
    title: "Events — Ink2Screen LLC Publishing",
    description: "Join us for book signings, author talks, and the Ink & Indulgence cultural experience. Houston & beyond.",
    url: "https://www.ink2screenllc.com/events",
    images: [{ url: "/images/book-spotlight.png", width: 1200, height: 630, alt: "Ink2Screen Events" }],
  },
  alternates: { canonical: "https://www.ink2screenllc.com/events" },
}

// --- Placeholder data for initial launch (before .NET backend is running) ---
const PLACEHOLDER_EVENTS: EventListItem[] = [
  {
    id: "ink-indulgence-vol-1",
    title: "Ink & Indulgence",
    subtitle: "Vol. 1: The Launch",
    venue: "Private Venue",
    city: "Houston",
    state: "TX",
    start_date: "2026-12-01T19:00:00Z",
    end_date: "2026-12-01T23:00:00Z",
    image_url: null,
    type: "InkAndIndulgence",
    status: "Upcoming",
    ticket_price: 0,
    spots_remaining: 100,
    is_free: true,
  },
  {
    id: "book-signing-houston",
    title: "Raison D'être — Book Signing",
    subtitle: "Meet the Author",
    venue: "Barnes & Noble",
    city: "Houston",
    state: "TX",
    start_date: "2027-02-15T14:00:00Z",
    end_date: "2027-02-15T17:00:00Z",
    image_url: null,
    type: "BookSigning",
    status: "Upcoming",
    ticket_price: 0,
    spots_remaining: 50,
    is_free: true,
  },
  {
    id: "writing-workshop",
    title: "From Concept to Manuscript",
    subtitle: "Creative Writing Workshop",
    venue: "Houston Public Library",
    city: "Houston",
    state: "TX",
    start_date: "2027-03-20T10:00:00Z",
    end_date: "2027-03-20T16:00:00Z",
    image_url: null,
    type: "Workshop",
    status: "Upcoming",
    ticket_price: 49.99,
    spots_remaining: 25,
    is_free: false,
  },
]

async function getEvents(): Promise<EventListItem[]> {
  try {
    const events = await getUpcomingEvents()
    return events.length > 0 ? events : PLACEHOLDER_EVENTS
  } catch {
    return PLACEHOLDER_EVENTS
  }
}

/* ─── Hero ─── */
function HeroSection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-[#050505] py-20 md:py-24">
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
          {cms(c, "events", "hero", "label", "EVENTS & EXPERIENCES")}
        </p>
        <h1 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[64px]">
          {cms(c, "events", "hero", "headline", "WHERE INK MEETS THE AUDIENCE")}
        </h1>
        <p className="max-w-[600px] text-base font-light leading-relaxed text-[#e0e0e0] sm:text-lg md:text-xl">
          {cms(c, "events", "hero", "description", "Book signings, author talks, workshops, and the Ink & Indulgence cultural experience series.")}
        </p>
      </div>
    </section>
  )
}

/* ─── Featured Event (Ink & Indulgence) ─── */
function FeaturedEventSection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="px-6 py-8">
      <div className="relative mx-auto max-w-[1260px] overflow-hidden rounded-[50px] border border-[#2e004e] bg-[#121212]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-texture.jpg"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-multiply"
          />
        </div>

        <div className="relative flex min-h-[480px] flex-col items-center justify-center gap-6 px-6 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
              {cms(c, "events", "featured", "label", "FEATURED EXPERIENCE")}
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
              {cms(c, "events", "featured", "title", "INK & INDULGENCE")}
            </h2>
          </div>

          <p className="text-center font-heading text-2xl font-bold leading-[1.4] tracking-tight text-brand-gold md:text-[32px]">
            {cms(c, "events", "featured", "subtitle", "Vol. 1: The Launch")}
          </p>

          <p className="max-w-[637px] text-center text-lg font-light leading-relaxed text-[#f0f0f0] md:text-xl">
            {cms(c, "events", "featured", "description", "A refined evening of conversation, storytelling, live music, and the official release of Raison D'etre. Limited seating.")}
          </p>

          <p className="text-center text-sm font-bold leading-relaxed text-[#f0f0f0]">
            {cms(c, "events", "featured", "location", "HOUSTON, TEXAS \u2022 LATE 2026")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              <Link href="/events/ink-indulgence-vol-1">REGISTER NOW</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 border-brand-gold px-8 text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href="#upcoming">VIEW ALL EVENTS</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Event Card ─── */
function EventCard({ event }: { event: EventListItem }) {
  const isSoldOut = event.status === "SoldOut"

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] transition-colors hover:border-brand-gold/30"
    >
      <div className="relative h-[180px] overflow-hidden bg-[#1a1a1a]">
        {event.image_url && event.image_url.startsWith("http") ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[80px]" />
            <Ticket className="relative h-12 w-12 text-brand-gold/40" />
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-sm bg-[#050505]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold backdrop-blur-sm">
          {EVENT_TYPE_LABELS[event.type]}
        </div>
        {isSoldOut && (
          <div className="absolute right-4 top-4 rounded-sm bg-red-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            Sold Out
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div>
          <h3 className="font-heading text-xl font-bold tracking-tight text-[#e0e0e0] group-hover:text-brand-gold">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="mt-1 text-sm text-brand-gold">{event.subtitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 text-xs text-[#999]">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {formatEventDate(event.start_date)}
              {event.end_date &&
                ` · ${formatEventTime(event.start_date)} – ${formatEventTime(event.end_date)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {event.venue} · {event.city}, {event.state}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#222] pt-3">
          <span className="text-sm font-bold text-brand-gold">
            {formatEventPrice(event.ticket_price)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#888]">
            <Users className="h-3.5 w-3.5" />
            {isSoldOut
              ? "No spots left"
              : `${event.spots_remaining} spots left`}
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Upcoming Events Grid ─── */
function UpcomingEventsSection({ events }: { events: EventListItem[] }) {
  return (
    <section
      id="upcoming"
      className="scroll-mt-24 bg-[#050505] px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1260px]">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
            SCHEDULE
          </p>
          <h2 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
            UPCOMING EVENTS
          </h2>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Ticket className="h-16 w-16 text-[#333]" />
            <p className="text-lg text-[#888]">
              No upcoming events at this time. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Calendar Section ─── */
function CalendarSection() {
  return (
    <section className="bg-[#0a0a0a] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[1260px]">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
            PLAN AHEAD
          </p>
          <h2 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
            EVENT CALENDAR
          </h2>
        </div>
        <EventCalendar />
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTASection({ c }: { c: Record<string, Record<string, Record<string, string>>> }) {
  return (
    <section className="relative flex min-h-[350px] items-center justify-center overflow-hidden">
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
        <h2 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl">
          {cms(c, "events", "cta", "title", "HOST AN EVENT WITH US")}
        </h2>
        <p className="max-w-[500px] text-base font-light leading-relaxed text-[#e0e0e0] md:text-lg">
          {cms(c, "events", "cta", "description", "Interested in partnering with Ink2Screen for a book signing, workshop, or literary event? Let's talk.")}
        </p>
        <Button
          asChild
          className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
        >
          <Link href="/contact">{cms(c, "events", "cta", "cta_text", "GET IN TOUCH")}</Link>
        </Button>
      </div>
    </section>
  )
}

/* ─── Page ─── */
export default async function EventsPage() {
  const [events, c] = await Promise.all([getEvents(), getContent("events")])

  return (
    <div className="bg-[#050505]">
      <StructuredData
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events" },
        ])}
      />
      <HeroSection c={c} />
      <FeaturedEventSection c={c} />
      <UpcomingEventsSection events={events} />
      <CalendarSection />
      <CTASection c={c} />
    </div>
  )
}
