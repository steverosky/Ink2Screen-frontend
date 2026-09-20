/**
 * Events API Client
 * Calls the Medusa backend store routes — no longer talks directly to .NET.
 * Prices are stored as-is (49.99 = $49.99, never divide by 100).
 */

import { sdk } from "./sdk"

// --- Types ---

export interface EventListItem {
  id: string
  title: string
  subtitle: string | null
  venue: string
  city: string
  state: string
  start_date: string
  end_date: string | null
  image_url: string | null
  type: EventType
  status: EventStatus
  ticket_price: number
  spots_remaining: number
  is_free: boolean
}

export interface EventDetail {
  id: string
  title: string
  subtitle: string | null
  description: string
  venue: string
  address: string
  city: string
  state: string
  start_date: string
  end_date: string | null
  image_url: string | null
  type: EventType
  status: EventStatus
  ticket_price: number
  max_capacity: number
  current_registrations: number
  spots_remaining: number
  requires_waiver: boolean
  is_free: boolean
}

export interface CalendarMonth {
  year: number
  month: number
  events: CalendarEvent[]
}

export interface CalendarEvent {
  id: string
  title: string
  start_date: string
  end_date: string | null
  type: EventType
  status: EventStatus
  city: string
  state: string
}

export interface Registration {
  id: string
  event_id: string
  first_name: string
  last_name: string
  email: string
  ticket_quantity: number
  amount_paid: number
  status: string
  created_at: string
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  phone?: string
  ticket_quantity: number
  waiver_accepted: boolean
  media_release_accepted: boolean
}

export type EventType =
  | "BookSigning"
  | "AuthorTalk"
  | "InkAndIndulgence"
  | "Workshop"
  | "CommunityEvent"
  | "VirtualEvent"

export type EventStatus =
  | "Upcoming"
  | "SoldOut"
  | "InProgress"
  | "Completed"
  | "Cancelled"

// --- API Functions ---

export async function getUpcomingEvents(): Promise<EventListItem[]> {
  return sdk.client.fetch<EventListItem[]>("/store/events", { method: "GET" })
}

export async function getEvent(id: string): Promise<EventDetail> {
  return sdk.client.fetch<EventDetail>(`/store/events/${id}`, { method: "GET" })
}

export async function getCalendarEvents(
  year: number,
  month: number
): Promise<CalendarMonth> {
  return sdk.client.fetch<CalendarMonth>(
    `/store/events/calendar/${year}/${month}`,
    { method: "GET" }
  )
}

export async function registerForEvent(
  eventId: string,
  data: RegisterRequest
): Promise<Registration> {
  return sdk.client.fetch<Registration>(`/store/events/${eventId}/register`, {
    method: "POST",
    body: data,
  })
}

export async function cancelRegistration(
  registrationId: string,
  email: string
): Promise<void> {
  await sdk.client.fetch(
    `/store/events/registrations/${registrationId}?email=${encodeURIComponent(email)}`,
    { method: "DELETE" }
  )
}

// --- Helpers ---

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  BookSigning: "Book Signing",
  AuthorTalk: "Author Talk",
  InkAndIndulgence: "Ink & Indulgence",
  Workshop: "Workshop",
  CommunityEvent: "Community Event",
  VirtualEvent: "Virtual Event",
}

/**
 * All events are hosted in Houston, so dates are always rendered in the venue's
 * timezone. Without this, server components (UTC on Render) and visitors'
 * browsers would each show a different wall-clock time than the admin entered.
 */
export const EVENT_TIMEZONE = "America/Chicago"

export function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: EVENT_TIMEZONE,
  })
}

export function formatEventTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: EVENT_TIMEZONE,
  })
}

/** Calendar parts (year, month 1-12, day) of an event in the venue timezone. */
export function getEventDateParts(dateStr: string): {
  year: number
  month: number
  day: number
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(dateStr))
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0)
  return { year: get("year"), month: get("month"), day: get("day") }
}

export function formatEventPrice(price: number): string {
  if (price === 0) return "Free"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}
