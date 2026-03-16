/**
 * Events API Client
 * Connects to the ASP.NET Core backend for event management.
 * Prices are stored as-is (49.99 = $49.99, never divide by 100).
 */

const EVENTS_API_URL =
  process.env.NEXT_PUBLIC_EVENTS_API_URL || "http://localhost:5285"

// --- Types (matching .NET DTO snake_case) ---

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

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${EVENTS_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || `API error: ${res.status}`)
  }

  return res.json()
}

export async function getUpcomingEvents(): Promise<EventListItem[]> {
  return fetchApi<EventListItem[]>("/api/events")
}

export async function getEvent(id: string): Promise<EventDetail> {
  return fetchApi<EventDetail>(`/api/events/${id}`)
}

export async function getCalendarEvents(
  year: number,
  month: number
): Promise<CalendarMonth> {
  return fetchApi<CalendarMonth>(`/api/events/calendar/${year}/${month}`)
}

export async function registerForEvent(
  eventId: string,
  data: RegisterRequest
): Promise<Registration> {
  return fetchApi<Registration>(`/api/events/${eventId}/register`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function cancelRegistration(
  registrationId: string,
  email: string
): Promise<void> {
  const res = await fetch(
    `${EVENTS_API_URL}/api/events/registrations/${registrationId}?email=${encodeURIComponent(email)}`,
    { method: "DELETE" }
  )
  if (!res.ok) {
    throw new Error("Failed to cancel registration")
  }
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

export function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatEventTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatEventPrice(price: number): string {
  if (price === 0) return "Free"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}
