import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Ticket, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventRegistrationForm } from "./registration-form"
import {
  getEvent,
  formatEventDate,
  formatEventTime,
  formatEventPrice,
  EVENT_TYPE_LABELS,
  type EventDetail,
} from "@/lib/events-api"

// --- Placeholder data for when backend isn't running ---
const PLACEHOLDER_EVENTS: Record<string, EventDetail> = {
  "ink-indulgence-vol-1": {
    id: "ink-indulgence-vol-1",
    title: "Ink & Indulgence",
    subtitle: "Vol. 1: The Launch",
    description:
      "Join us for a refined evening of conversation, storytelling, live music, and the official release of Raison D'etre.\n\nInk & Indulgence is our signature cultural experience series — an intimate gathering where literary art meets live engagement. This debut event marks the launch of Sterling R. Smith's first novel and the beginning of a new chapter for Ink2Screen.\n\nThe evening includes:\n• Author reading and Q&A\n• Live musical performance\n• Complimentary refreshments\n• Exclusive signed copies\n• Networking with fellow literary enthusiasts\n\nDress code: Smart casual. Limited seating — register early.",
    venue: "Private Venue",
    address: "Address provided upon registration",
    city: "Houston",
    state: "TX",
    start_date: "2026-12-01T19:00:00Z",
    end_date: "2026-12-01T23:00:00Z",
    image_url: null,
    type: "InkAndIndulgence",
    status: "Upcoming",
    ticket_price: 0,
    max_capacity: 100,
    current_registrations: 0,
    spots_remaining: 100,
    requires_waiver: true,
    is_free: true,
  },
  "book-signing-houston": {
    id: "book-signing-houston",
    title: "Raison D'être — Book Signing",
    subtitle: "Meet the Author",
    description:
      "Meet Sterling R. Smith in person at this exclusive book signing event. Get your copy of Raison D'etre signed, ask questions about the creative process, and connect with fellow readers.\n\nBooks will be available for purchase on-site.",
    venue: "Barnes & Noble",
    address: "1000 Westheimer Rd",
    city: "Houston",
    state: "TX",
    start_date: "2027-02-15T14:00:00Z",
    end_date: "2027-02-15T17:00:00Z",
    image_url: null,
    type: "BookSigning",
    status: "Upcoming",
    ticket_price: 0,
    max_capacity: 50,
    current_registrations: 0,
    spots_remaining: 50,
    requires_waiver: true,
    is_free: true,
  },
  "writing-workshop": {
    id: "writing-workshop",
    title: "From Concept to Manuscript",
    subtitle: "Creative Writing Workshop",
    description:
      "A full-day workshop on transforming ideas into structured narratives. Led by Sterling R. Smith, this hands-on session covers:\n\n• Concept development and outlining\n• Character construction\n• World-building fundamentals\n• Writing discipline and routines\n• Path to publishing\n\nParticipants will leave with a completed outline and actionable writing plan. Materials provided.",
    venue: "Houston Public Library",
    address: "500 McKinney St",
    city: "Houston",
    state: "TX",
    start_date: "2027-03-20T10:00:00Z",
    end_date: "2027-03-20T16:00:00Z",
    image_url: null,
    type: "Workshop",
    status: "Upcoming",
    ticket_price: 49.99,
    max_capacity: 25,
    current_registrations: 0,
    spots_remaining: 25,
    requires_waiver: true,
    is_free: false,
  },
}

async function getEventData(id: string): Promise<EventDetail | null> {
  try {
    return await getEvent(id)
  } catch {
    return PLACEHOLDER_EVENTS[id] || null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const event = await getEventData(id)
  return {
    title: event ? `${event.title} — Events` : "Event Not Found",
    description: event?.description.slice(0, 160),
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEventData(id)

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#050505] px-4 text-center">
        <Ticket className="mb-4 h-16 w-16 text-[#333]" />
        <h1 className="mb-2 font-heading text-2xl font-bold text-[#e0e0e0]">
          Event Not Found
        </h1>
        <p className="mb-8 text-[#888]">
          This event may have been removed or doesn&apos;t exist.
        </p>
        <Button
          asChild
          className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
        >
          <Link href="/events">VIEW ALL EVENTS</Link>
        </Button>
      </div>
    )
  }

  const isSoldOut = event.status === "SoldOut"
  const isCancelled = event.status === "Cancelled"
  const isCompleted = event.status === "Completed"
  const canRegister = !isSoldOut && !isCancelled && !isCompleted

  return (
    <div className="bg-[#050505]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-texture.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-10 mix-blend-soft-light"
          />
        </div>
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/15 blur-[150px]" />

        <div className="relative mx-auto max-w-[1260px] px-6 py-12 md:py-20">
          {/* Back link */}
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All Events
          </Link>

          <div className="flex flex-col gap-6">
            {/* Type badge */}
            <div className="flex items-center gap-3">
              <span className="rounded-sm bg-brand-purple/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              {isSoldOut && (
                <span className="rounded-sm bg-red-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Sold Out
                </span>
              )}
              {isCancelled && (
                <span className="rounded-sm bg-[#333] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#999]">
                  Cancelled
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] sm:text-4xl md:text-5xl lg:text-[56px]">
                {event.title}
              </h1>
              {event.subtitle && (
                <p className="mt-2 text-xl font-bold text-brand-gold md:text-2xl">
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-6 text-sm text-[#c0c0c0]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-gold" />
                <span>
                  {formatEventDate(event.start_date)}
                  {event.end_date &&
                    ` · ${formatEventTime(event.start_date)} – ${formatEventTime(event.end_date)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold" />
                <span>
                  {event.venue}, {event.city}, {event.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-gold" />
                <span>
                  {event.spots_remaining} of {event.max_capacity} spots
                  remaining
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-brand-gold" />
                <span className="font-bold text-brand-gold">
                  {formatEventPrice(event.ticket_price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content + Registration */}
      <section className="mx-auto max-w-[1260px] px-6 py-12 md:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left — Description */}
          <div className="flex-1">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-[#e0e0e0]">
              ABOUT THIS EVENT
            </h2>
            <div className="space-y-4 text-base leading-[1.8] text-[#c0c0c0]">
              {event.description.split("\n").map((paragraph, i) => {
                if (!paragraph.trim()) return null
                if (paragraph.startsWith("•")) {
                  return (
                    <p key={i} className="pl-4">
                      {paragraph}
                    </p>
                  )
                }
                return <p key={i}>{paragraph}</p>
              })}
            </div>

            {/* Venue details */}
            <div className="mt-10 rounded-[10px] border border-[#222] bg-[#121212] p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-gold">
                Venue
              </h3>
              <div className="space-y-2 text-sm text-[#c0c0c0]">
                <p className="font-semibold text-[#e0e0e0]">{event.venue}</p>
                <p>{event.address}</p>
                <p>
                  {event.city}, {event.state}
                </p>
              </div>
            </div>
          </div>

          {/* Right — Registration Form */}
          <div className="w-full lg:w-[420px]">
            <div className="lg:sticky lg:top-24">
              {canRegister ? (
                <EventRegistrationForm event={event} />
              ) : (
                <div className="rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
                  <Ticket className="mx-auto mb-4 h-12 w-12 text-[#333]" />
                  <p className="text-lg font-semibold text-[#e0e0e0]">
                    {isSoldOut && "This event is sold out."}
                    {isCancelled && "This event has been cancelled."}
                    {isCompleted && "This event has ended."}
                  </p>
                  <Button
                    asChild
                    className="mt-6 h-12 bg-brand-gold px-6 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
                  >
                    <Link href="/events">BROWSE OTHER EVENTS</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
