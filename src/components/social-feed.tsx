"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export interface SocialPost {
  platform: "instagram" | "tiktok"
  /** Instagram: full post URL. TikTok: full video URL. */
  url: string
  /** Fallback label shown while embed loads */
  label?: string
}

/** Renders a single Instagram post embed */
function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Instagram embed script once
    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script")
      script.id = "instagram-embed-script"
      script.src = "https://www.instagram.com/embed.js"
      script.async = true
      document.body.appendChild(script)
    } else if ((window as { instgrm?: { Embeds?: { process?: () => void } } }).instgrm?.Embeds?.process) {
      ;(window as { instgrm?: { Embeds?: { process?: () => void } } }).instgrm!.Embeds!.process!()
    }
  }, [url])

  return (
    <div ref={containerRef} className="overflow-hidden rounded-lg">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#121212",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "8px",
          margin: 0,
          maxWidth: "100%",
          minWidth: "280px",
          padding: 0,
          width: "100%",
        }}
      >
        <div style={{ padding: "16px" }}>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-gold underline"
          >
            View on Instagram
          </Link>
        </div>
      </blockquote>
    </div>
  )
}

/** Renders a single TikTok video embed */
function TikTokEmbed({ url }: { url: string }) {
  // Extract video ID from TikTok URL: https://www.tiktok.com/@user/video/1234567890
  const videoId = url.match(/video\/(\d+)/)?.[1]

  useEffect(() => {
    if (!document.getElementById("tiktok-embed-script")) {
      const script = document.createElement("script")
      script.id = "tiktok-embed-script"
      script.src = "https://www.tiktok.com/embed.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  if (!videoId) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-brand-gold/20 bg-[#121212]">
        <Link href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-gold underline">
          View on TikTok
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{
          maxWidth: "100%",
          minWidth: "280px",
          margin: 0,
        }}
      >
        <section>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-gold underline"
          >
            View on TikTok
          </Link>
        </section>
      </blockquote>
    </div>
  )
}

export function SocialFeedSection({
  title = "FOLLOW THE JOURNEY",
  description = "Stay connected with the latest from Ink2Screen.",
  posts,
  channelLinks,
}: {
  title?: string
  description?: string
  posts: SocialPost[]
  channelLinks?: { instagram?: string; tiktok?: string }
}) {
  if (posts.length === 0) return null

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1088px]">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-brand-gold md:text-5xl">
            {title}
          </h2>
          <p className="max-w-[560px] text-base leading-[1.7] text-[#e0e0e0]">{description}</p>
          {channelLinks && (
            <div className="flex items-center gap-4">
              {channelLinks.instagram && (
                <Link
                  href={channelLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold tracking-widest text-brand-gold underline underline-offset-4 hover:text-brand-gold/80"
                >
                  @INK2SCREEN
                </Link>
              )}
              {channelLinks.tiktok && (
                <Link
                  href={channelLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold tracking-widest text-brand-gold underline underline-offset-4 hover:text-brand-gold/80"
                >
                  TIKTOK
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Posts grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <div key={i}>
              {post.platform === "instagram" ? (
                <InstagramEmbed url={post.url} />
              ) : (
                <TikTokEmbed url={post.url} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
