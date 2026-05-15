"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckSquare, Square, Loader2, Check, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sdk } from "@/lib/sdk"

const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "events", label: "Events & Partnerships" },
  { value: "press", label: "Press & Media" },
  { value: "partnerships", label: "Business / Partnerships" },
  { value: "other", label: "Other" },
] as const

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState<string>("general")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  // Honeypot — hidden from real users.
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [errorMsg, setErrorMsg] = useState("")

  const isValid =
    name.trim().length >= 2 &&
    email.includes("@") &&
    email.includes(".") &&
    subject.trim().length >= 3 &&
    message.trim().length >= 10 &&
    consent

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || status === "loading") return

    setStatus("loading")
    setErrorMsg("")

    try {
      await sdk.client.fetch("/store/contact", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          category,
          subject: subject.trim(),
          message: message.trim(),
          website,
          consent: true,
        },
      })
      setStatus("success")
      setName("")
      setEmail("")
      setPhone("")
      setSubject("")
      setMessage("")
      setConsent(false)
    } catch (err: any) {
      setStatus("error")
      const code = err?.status
      setErrorMsg(
        code === 429
          ? "You've sent a message recently. Please wait a minute and try again."
          : "We couldn't send your message. Please email us directly at info@ink2screenllc.com."
      )
    }
  }

  if (status === "success") {
    return (
      <div className="relative flex flex-col items-center gap-5 rounded-[10px] border border-brand-gold/30 bg-[#121212] p-10 text-center md:p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
          <Check className="h-6 w-6 text-brand-gold" />
        </div>
        <h3 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0]">
          MESSAGE SENT
        </h3>
        <p className="max-w-[440px] text-sm font-light leading-relaxed text-[#999]">
          Thank you for reaching out. We&apos;ve sent a confirmation to your
          inbox and typically respond within 2 business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-xs text-[#888] underline underline-offset-2 hover:text-[#ccc]"
        >
          Send another message
        </button>
      </div>
    )
  }

  const fieldClass =
    "h-11 rounded-md border border-[#2a2a2a] bg-[#0a0a0a] px-3.5 text-sm text-[#e0e0e0] placeholder:text-[#555] focus-visible:border-brand-gold/50 focus-visible:ring-0 focus-visible:ring-offset-0"
  const labelClass =
    "text-[11px] font-bold tracking-[0.08em] text-brand-gold uppercase"

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-5 rounded-[10px] border border-[#222] bg-[#121212] p-8 md:p-10"
    >
      {/* Purple glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-[260px] w-[260px] rounded-full bg-brand-purple/10 blur-[120px]" />

      <div className="relative grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className={labelClass}>
            Name
          </label>
          <Input
            id="cf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className={labelClass}>
            Email
          </label>
          <Input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="relative grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-phone" className={labelClass}>
            Phone <span className="text-[#555] normal-case">(optional)</span>
          </label>
          <Input
            id="cf-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(000) 000-0000"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-category" className={labelClass}>
            Topic
          </label>
          <select
            id="cf-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass} appearance-none`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#0a0a0a]">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative flex flex-col gap-1.5">
        <label htmlFor="cf-subject" className={labelClass}>
          Subject
        </label>
        <Input
          id="cf-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help?"
          required
          className={fieldClass}
        />
      </div>

      <div className="relative flex flex-col gap-1.5">
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="cf-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a little more…"
          required
          rows={6}
          className="rounded-md border border-[#2a2a2a] bg-[#0a0a0a] px-3.5 py-3 text-sm leading-relaxed text-[#e0e0e0] placeholder:text-[#555] focus-visible:border-brand-gold/50 focus-visible:outline-none"
        />
      </div>

      {/* Honeypot — visually hidden, off-screen, not tab-reachable */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <label className="relative flex cursor-pointer items-start gap-2.5">
        <button
          type="button"
          onClick={() => setConsent(!consent)}
          className="mt-0.5 flex-shrink-0"
          aria-label="Consent to be contacted"
        >
          {consent ? (
            <CheckSquare className="h-4 w-4 text-brand-gold" />
          ) : (
            <Square className="h-4 w-4 text-[#666]" />
          )}
        </button>
        <span className="text-[11px] leading-relaxed text-[#999]">
          I agree to be contacted regarding this inquiry and accept the{" "}
          <Link
            href="/terms#privacy"
            className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {status === "error" && (
        <p className="relative text-xs text-red-400">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={!isValid || status === "loading"}
        className="relative h-12 w-full bg-brand-gold text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark disabled:opacity-40 sm:w-auto sm:self-start sm:px-10"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            SEND MESSAGE
          </span>
        )}
      </Button>
    </form>
  )
}
