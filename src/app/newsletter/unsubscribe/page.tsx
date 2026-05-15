import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
}

async function unsubscribe(token: string): Promise<{
  ok: boolean
  email?: string
}> {
  const base =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  try {
    const res = await fetch(
      `${base}/store/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        cache: "no-store",
      }
    )
    if (!res.ok) return { ok: false }
    const data = await res.json()
    return { ok: !!data.success, email: data.email }
  } catch {
    return { ok: false }
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token || ""
  const result = token ? await unsubscribe(token) : { ok: false }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#050505] px-6 py-20">
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-10 text-center md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full bg-brand-purple/10 blur-[120px]" />

        <Image
          src="/images/logo.png"
          alt="Ink2Screen"
          width={150}
          height={48}
          className="relative mx-auto mb-8 h-auto w-[150px]"
        />

        {result.ok ? (
          <>
            <h1 className="relative font-heading text-2xl font-bold tracking-tight text-[#e0e0e0] md:text-3xl">
              YOU&apos;RE UNSUBSCRIBED
            </h1>
            <p className="relative mt-4 text-sm font-light leading-relaxed text-[#999]">
              {result.email ? (
                <>
                  <span className="text-[#ccc]">{result.email}</span> has been
                  removed from the Ink2Screen mailing list.
                </>
              ) : (
                "You've been removed from the Ink2Screen mailing list."
              )}{" "}
              You won&apos;t receive further marketing emails.
            </p>
          </>
        ) : (
          <>
            <h1 className="relative font-heading text-2xl font-bold tracking-tight text-[#e0e0e0] md:text-3xl">
              LINK INVALID
            </h1>
            <p className="relative mt-4 text-sm font-light leading-relaxed text-[#999]">
              This unsubscribe link is invalid or has expired. If you continue
              to receive emails, contact us at{" "}
              <a
                href="mailto:info@ink2screenllc.com"
                className="text-brand-gold underline underline-offset-2"
              >
                info@ink2screenllc.com
              </a>
              .
            </p>
          </>
        )}

        <Button
          asChild
          className="relative mt-8 h-12 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
        >
          <Link href="/">RETURN HOME</Link>
        </Button>
      </div>
    </div>
  )
}
