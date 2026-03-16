"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckSquare, Square, Loader2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const isValid = email.includes("@") && email.includes(".") && consent

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setStatus("loading")
    setErrorMsg("")

    try {
      // TODO: Replace with real newsletter API endpoint (e.g. Mailchimp, SendGrid, or custom Medusa route)
      // For now, simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus("success")
      setEmail("")
      setConsent(false)
    } catch {
      setStatus("error")
      setErrorMsg("Something went wrong. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex max-w-[415px] flex-col gap-4">
        <div className="flex flex-col gap-2 py-2.5">
          <p className="text-sm font-semibold tracking-wide text-[#e0e0e0]">
            STAY INSPIRED
          </p>
        </div>
        <div className="flex items-center gap-2 py-4">
          <Check className="h-5 w-5 text-brand-gold" />
          <p className="text-sm font-semibold text-brand-gold">
            You&apos;re subscribed! Check your inbox.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-left text-xs text-[#888] underline underline-offset-2 hover:text-[#ccc]"
        >
          Subscribe another email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[415px] flex-col gap-4">
      <div className="flex flex-col gap-2 py-2.5">
        <p className="text-sm font-semibold tracking-wide text-[#e0e0e0]">
          STAY INSPIRED
        </p>
        <p className="text-sm font-normal leading-[1.8] text-[#e0e0e0]">
          Be the first to discover new Ink2Screen books, exclusive collections,
          and special offers.
        </p>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex w-80 flex-col gap-1">
          <label
            htmlFor="newsletter-email"
            className="text-[11px] font-bold tracking-[0.05em] text-brand-gold"
          >
            EMAIL
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 rounded-none border-b border-l-0 border-r-0 border-t-0 border-[#333] bg-transparent px-0 text-sm text-[#e0e0e0] placeholder:text-[#555] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          type="submit"
          disabled={!isValid || status === "loading"}
          className="h-11 bg-brand-gold px-6 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark disabled:opacity-40"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "SIGN UP"
          )}
        </Button>
      </div>

      {/* Consent checkbox */}
      <label className="flex cursor-pointer items-start gap-2.5">
        <button
          type="button"
          onClick={() => setConsent(!consent)}
          className="mt-0.5 flex-shrink-0"
        >
          {consent ? (
            <CheckSquare className="h-4 w-4 text-brand-gold" />
          ) : (
            <Square className="h-4 w-4 text-[#666]" />
          )}
        </button>
        <span className="text-[11px] leading-relaxed text-[#999]">
          I agree to receive marketing emails and accept the{" "}
          <Link
            href="/terms#privacy"
            className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
          >
            Privacy Policy
          </Link>
          . Unsubscribe anytime.
        </span>
      </label>

      {status === "error" && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
    </form>
  )
}
