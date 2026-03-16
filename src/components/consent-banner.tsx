"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useConsentStore } from "@/lib/store"

export function ConsentBanner() {
  const { termsAccepted, acceptAll, acceptEssentialOnly } = useConsentStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch — only render after client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || termsAccepted) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#222] bg-[#0a0a0a]/95 px-6 py-5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-[#f0f0f0]">
            We value your privacy
          </p>
          <p className="text-xs leading-relaxed text-[#999]">
            This site uses cookies and analytics to enhance your experience. By
            continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/terms#privacy"
              className="text-brand-gold underline underline-offset-2 hover:text-brand-gold/80"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={acceptEssentialOnly}
            variant="outline"
            className="h-10 rounded-none border-[#333] px-5 text-xs font-bold uppercase tracking-widest text-[#e0e0e0] hover:border-[#555] hover:bg-[#1a1a1a]"
          >
            Essential Only
          </Button>
          <Button
            onClick={acceptAll}
            className="h-10 rounded-none bg-brand-gold px-5 text-xs font-bold uppercase tracking-widest text-[#050505] hover:bg-brand-gold/90"
          >
            Accept All
          </Button>
          <button
            onClick={acceptEssentialOnly}
            className="ml-1 p-1 text-[#666] transition-colors hover:text-[#ccc]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
