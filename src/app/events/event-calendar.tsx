"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getCalendarEvents,
  EVENT_TYPE_LABELS,
  type CalendarEvent,
} from "@/lib/events-api"
import { cn } from "@/lib/utils"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Placeholder calendar events for when backend isn't running
const PLACEHOLDER_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "ink-indulgence-vol-1",
    title: "Ink & Indulgence Vol. 1",
    start_date: "2026-12-01T19:00:00Z",
    end_date: "2026-12-01T23:00:00Z",
    type: "InkAndIndulgence",
    status: "Upcoming",
    city: "Houston",
    state: "TX",
  },
]

export function EventCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getCalendarEvents(year, month)
      .then((data) => {
        if (!cancelled) setEvents(data.events)
      })
      .catch(() => {
        // Use placeholder data filtered to current month
        if (!cancelled) {
          setEvents(
            PLACEHOLDER_CALENDAR_EVENTS.filter((e) => {
              const d = new Date(e.start_date)
              return d.getFullYear() === year && d.getMonth() + 1 === month
            })
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [year, month])

  function prevMonth() {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const eventsByDay = new Map<number, CalendarEvent[]>()
  for (const event of events) {
    const day = new Date(event.start_date).getDate()
    const existing = eventsByDay.get(day) || []
    existing.push(event)
    eventsByDay.set(day, existing)
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const today = new Date()
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-10 w-10 text-[#888] hover:text-brand-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-heading text-xl font-bold tracking-tight text-[#e0e0e0]">
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-10 w-10 text-[#888] hover:text-brand-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#222]">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#666]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={cn(
          "grid grid-cols-7",
          loading && "pointer-events-none opacity-50"
        )}
      >
        {cells.map((day, i) => {
          const dayEvents = day ? eventsByDay.get(day) || [] : []
          const isToday = isCurrentMonth && day === today.getDate()

          return (
            <div
              key={i}
              className={cn(
                "min-h-[80px] border-b border-r border-[#1a1a1a] p-2 md:min-h-[100px]",
                !day && "bg-[#0a0a0a]"
              )}
            >
              {day && (
                <>
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                      isToday
                        ? "bg-brand-gold text-[#050505]"
                        : "text-[#888]"
                    )}
                  >
                    {day}
                  </span>
                  {dayEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="mt-1 block truncate rounded-sm bg-brand-purple/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-gold transition-colors hover:bg-brand-purple/30"
                      title={`${event.title} — ${EVENT_TYPE_LABELS[event.type]}`}
                    >
                      {event.title}
                    </Link>
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
