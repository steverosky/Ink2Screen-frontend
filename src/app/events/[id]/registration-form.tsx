"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Loader2,
  CheckCircle2,
  CheckSquare,
  Square,
  Minus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  registerForEvent,
  formatEventPrice,
  type EventDetail,
} from "@/lib/events-api"
import { cn } from "@/lib/utils"

function FormInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-none border-[#333] bg-transparent font-body text-sm text-[#e0e0e0] placeholder:text-[#666] focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}

export function EventRegistrationForm({ event }: { event: EventDetail }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [waiverAccepted, setWaiverAccepted] = useState(false)
  const [mediaReleaseAccepted, setMediaReleaseAccepted] = useState(false)

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const maxQuantity = Math.min(10, event.spots_remaining)
  const totalPrice = event.ticket_price * quantity

  const isValid =
    firstName.trim() &&
    lastName.trim() &&
    email.includes("@") &&
    waiverAccepted &&
    mediaReleaseAccepted &&
    quantity >= 1 &&
    quantity <= maxQuantity

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const registration = await registerForEvent(event.id, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        ticket_quantity: quantity,
        waiver_accepted: waiverAccepted,
        media_release_accepted: mediaReleaseAccepted,
      })
      setRegistrationId(registration.id)
      setStatus("success")
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      )
      setStatus("error")
    }
  }

  // --- Success State ---
  if (status === "success") {
    return (
      <div className="rounded-[10px] border border-brand-gold/30 bg-[#121212] p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-brand-gold" />
        <h3 className="mb-2 font-heading text-xl font-bold text-[#e0e0e0]">
          You&apos;re Registered!
        </h3>
        <p className="mb-1 text-sm text-[#c0c0c0]">
          A confirmation has been sent to{" "}
          <span className="font-semibold text-brand-gold">{email}</span>.
        </p>
        <p className="mb-6 text-xs text-[#888]">
          Registration ID: {registrationId}
        </p>
        <Button
          asChild
          className="h-12 bg-brand-gold px-6 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
        >
          <Link href="/events">BROWSE MORE EVENTS</Link>
        </Button>
      </div>
    )
  }

  // --- Registration Form ---
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-[#222] bg-[#121212] p-6 md:p-8"
    >
      <h3 className="mb-6 font-heading text-xl font-bold tracking-tight text-[#e0e0e0]">
        REGISTER
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
          <FormInput
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>

        {/* Email */}
        <FormInput
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        {/* Phone */}
        <FormInput
          type="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />

        {/* Ticket quantity */}
        <div className="flex items-center justify-between rounded-none border border-[#333] px-4 py-3">
          <span className="text-sm text-[#e0e0e0]">Tickets</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#333] text-[#888] transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-[#e0e0e0]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#333] text-[#888] transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Price summary */}
        <div className="flex items-center justify-between border-t border-[#222] pt-4">
          <span className="text-sm text-[#888]">Total</span>
          <span className="text-lg font-bold text-brand-gold">
            {formatEventPrice(totalPrice)}
          </span>
        </div>

        {/* Waiver section */}
        {event.requires_waiver && (
          <div className="space-y-3 border-t border-[#222] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
              Required Agreements
            </p>

            {/* Liability waiver */}
            <label className="flex cursor-pointer items-start gap-3">
              <button
                type="button"
                onClick={() => setWaiverAccepted(!waiverAccepted)}
                className="mt-0.5 flex-shrink-0"
              >
                {waiverAccepted ? (
                  <CheckSquare className="h-5 w-5 text-brand-gold" />
                ) : (
                  <Square className="h-5 w-5 text-[#666]" />
                )}
              </button>
              <span className="text-xs leading-relaxed text-[#c0c0c0]">
                I acknowledge and accept the{" "}
                <Link
                  href="/terms#events"
                  target="_blank"
                  className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
                >
                  Liability Waiver &amp; Event Terms
                </Link>
                . I assume all risks associated with attending this event and
                release Ink2Screen from liability for injury, loss, or damage.
              </span>
            </label>

            {/* Media release */}
            <label className="flex cursor-pointer items-start gap-3">
              <button
                type="button"
                onClick={() =>
                  setMediaReleaseAccepted(!mediaReleaseAccepted)
                }
                className="mt-0.5 flex-shrink-0"
              >
                {mediaReleaseAccepted ? (
                  <CheckSquare className="h-5 w-5 text-brand-gold" />
                ) : (
                  <Square className="h-5 w-5 text-[#666]" />
                )}
              </button>
              <span className="text-xs leading-relaxed text-[#c0c0c0]">
                I grant permission for photographs or recordings taken at this
                event to be used for{" "}
                <Link
                  href="/terms#events"
                  target="_blank"
                  className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
                >
                  promotional purposes
                </Link>
                .
              </span>
            </label>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <p className="text-center text-xs text-red-400">{errorMsg}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={!isValid || status === "loading"}
          className="h-14 w-full rounded-none bg-brand-gold text-sm font-bold uppercase tracking-widest text-[#050505] hover:bg-brand-gold-dark disabled:opacity-40"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              REGISTERING...
            </>
          ) : event.is_free ? (
            "REGISTER — FREE"
          ) : (
            `REGISTER — ${formatEventPrice(totalPrice)}`
          )}
        </Button>

        <p className="text-center text-[10px] text-[#666]">
          By registering you agree to the{" "}
          <Link
            href="/terms"
            className="text-brand-gold underline underline-offset-2"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/terms#privacy"
            className="text-brand-gold underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
