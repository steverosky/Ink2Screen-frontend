"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Youtube, Music, Mic2 } from "lucide-react"

export interface Track {
  title: string
  description: string
  src: string
  label: string
  duration: string
}

const LABEL_STYLES: Record<string, string> = {
  PODCAST: "bg-brand-purple/20 text-brand-purple border border-brand-purple/30",
  "AUDIOBOOK SAMPLE": "bg-brand-gold/10 text-brand-gold border border-brand-gold/30",
  INTERVIEW: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
}

function getLabelStyle(label: string) {
  return LABEL_STYLES[label] ?? "bg-brand-purple/20 text-brand-purple border border-brand-purple/30"
}

function formatTime(s: number): string {
  if (isNaN(s) || s === 0) return "0:00"
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
}

function WaveformBars({ playing }: { playing: boolean }) {
  const delays = ["0s", "0.2s", "0.1s", "0.3s"]
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {delays.map((delay, i) =>
        playing ? (
          <div
            key={i}
            className="w-[3px] rounded-full bg-brand-gold animate-waveform"
            style={{ animationDelay: delay }}
          />
        ) : (
          <div key={i} className="w-[3px] rounded-full bg-brand-gold/40" style={{ height: 4 }} />
        )
      )}
    </div>
  )
}

export function PodcastClient({
  tracks,
  hasCmsContent,
  youtubeUrl,
  spotifyUrl,
  appleUrl,
  title,
  description,
}: {
  tracks: Track[]
  hasCmsContent: boolean
  youtubeUrl: string
  spotifyUrl: string
  appleUrl: string
  title: string
  description: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const shouldPlayRef = useRef(false)

  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [filter, setFilter] = useState("ALL")

  const labels = ["ALL", ...Array.from(new Set(tracks.map((t) => t.label)))]
  const filteredTracks = filter === "ALL" ? tracks : tracks.filter((t) => t.label === filter)
  const activeTrack = tracks[activeIdx]
  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setAudioDuration(audio.duration)
    const onEnded = () => {
      setPlaying(false)
      if (activeIdx < tracks.length - 1) {
        shouldPlayRef.current = true
        setActiveIdx((prev) => prev + 1)
        setPlaying(true)
      }
    }
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [activeIdx, tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = tracks[activeIdx].src
    audio.load()
    setCurrentTime(0)
    setAudioDuration(0)
    if (shouldPlayRef.current) {
      shouldPlayRef.current = false
      audio.play().catch(() => setPlaying(false))
    }
  }, [activeIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectTrack(idx: number) {
    if (idx === activeIdx) {
      togglePlay()
    } else {
      shouldPlayRef.current = true
      setActiveIdx(idx)
      setPlaying(true)
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = Number(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
  }

  function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const v = Number(e.target.value)
    audio.volume = v
    setVolume(v)
    if (v > 0) setMuted(false)
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    audio.muted = next
    setMuted(next)
  }

  const volPct = (muted ? 0 : volume) * 100

  return (
    <div className="overflow-x-hidden bg-[#050505]">
      <audio ref={audioRef} preload="metadata" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/10 blur-[120px] md:h-[700px] md:w-[700px] md:blur-[140px]" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 text-center sm:gap-5">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-brand-gold/40 sm:w-10" />
            <p className="text-[10px] font-bold tracking-[0.3em] text-brand-gold sm:tracking-[0.35em]">
              INK2SCREEN AUDIO
            </p>
            <div className="h-px w-8 bg-brand-gold/40 sm:w-10" />
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-[#f0f0f0] sm:text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="max-w-[540px] text-sm leading-[1.8] text-[#888]">{description}</p>

          {/* Platform links — scrollable row on mobile */}
          {(youtubeUrl || spotifyUrl || appleUrl) && (
            <div className="mt-1 flex w-full flex-nowrap justify-center gap-2 overflow-x-auto pb-1 sm:mt-2 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0">
              {youtubeUrl && (
                <Link
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-2.5 text-[11px] font-bold tracking-widest text-brand-gold transition-all hover:border-brand-gold/60 hover:bg-brand-gold/15"
                >
                  <Youtube className="h-3.5 w-3.5" />
                  YOUTUBE
                </Link>
              )}
              {spotifyUrl && (
                <Link
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-2.5 text-[11px] font-bold tracking-widest text-brand-gold transition-all hover:border-brand-gold/60 hover:bg-brand-gold/15"
                >
                  <Music className="h-3.5 w-3.5" />
                  SPOTIFY
                </Link>
              )}
              {appleUrl && (
                <Link
                  href={appleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 px-4 py-2.5 text-[11px] font-bold tracking-widest text-brand-gold transition-all hover:border-brand-gold/60 hover:bg-brand-gold/15"
                >
                  <Mic2 className="h-3.5 w-3.5" />
                  APPLE PODCASTS
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Now Playing panel ── */}
      <section className="px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-brand-gold/20 bg-[#0d0d0d]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-purple/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-brand-gold/10 blur-[60px]" />

            <div className="relative flex flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center md:gap-8 md:p-8">
              {/* Album art — smaller on mobile, centered; left-aligned on md+ */}
              <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-purple/40 via-[#1a1a1a] to-brand-gold/10 ring-1 ring-brand-gold/20 sm:h-32 sm:w-32 md:mx-0 md:h-40 md:w-40">
                <div className="flex h-full w-full items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-10 w-10 fill-brand-gold/30 sm:h-12 sm:w-12 md:h-14 md:w-14">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              </div>

              {/* Info + controls */}
              <div className="flex flex-1 flex-col gap-4 sm:gap-5">
                {/* Track meta */}
                <div>
                  <p className="mb-1 text-[10px] font-bold tracking-[0.25em] text-[#555]">NOW PLAYING</p>
                  {activeTrack.label && (
                    <span className={cn("mb-2 inline-block rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest", getLabelStyle(activeTrack.label))}>
                      {activeTrack.label}
                    </span>
                  )}
                  <h2 className="font-heading text-lg font-bold text-[#f0f0f0] sm:text-xl md:text-2xl">
                    {activeTrack.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-[1.6] text-[#666]">
                    {activeTrack.description}
                  </p>
                </div>

                {/* Seek bar */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-8 shrink-0 text-right text-xs tabular-nums text-[#555]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={seek}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full"
                    style={{ background: `linear-gradient(to right, #D4AF37 ${progress}%, #222 ${progress}%)` }}
                    aria-label="Seek"
                  />
                  <span className="w-8 text-xs tabular-nums text-[#555]">
                    {audioDuration > 0 ? formatTime(audioDuration) : (activeTrack.duration || "—")}
                  </span>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between">
                  {/* Skip + Play */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <button
                      onClick={() => { shouldPlayRef.current = playing; setActiveIdx((p) => Math.max(0, p - 1)) }}
                      disabled={activeIdx === 0}
                      className="text-[#555] transition-colors hover:text-[#e0e0e0] disabled:opacity-25"
                      aria-label="Previous track"
                    >
                      <SkipBack className="h-5 w-5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      aria-label={playing ? "Pause" : "Play"}
                      className="flex items-center justify-center rounded-full bg-brand-gold p-3 shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] active:scale-95"
                    >
                      {playing
                        ? <Pause className="h-5 w-5 fill-[#050505] text-[#050505]" />
                        : <Play className="ml-0.5 h-5 w-5 fill-[#050505] text-[#050505]" />
                      }
                    </button>

                    <button
                      onClick={() => { shouldPlayRef.current = playing; setActiveIdx((p) => Math.min(tracks.length - 1, p + 1)) }}
                      disabled={activeIdx === tracks.length - 1}
                      className="text-[#555] transition-colors hover:text-[#e0e0e0] disabled:opacity-25"
                      aria-label="Next track"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Volume — mute button always visible, slider only on sm+ */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-[#555] transition-colors hover:text-[#e0e0e0]"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted || volume === 0
                        ? <VolumeX className="h-5 w-5" />
                        : <Volume2 className="h-5 w-5" />
                      }
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={changeVolume}
                      className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full sm:block sm:w-24"
                      style={{ background: `linear-gradient(to right, #D4AF37 ${volPct}%, #222 ${volPct}%)` }}
                      aria-label="Volume"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Track List ── */}
      <section className="px-4 pb-16 pt-2 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl">

          {/* Filter tabs — horizontal scroll on mobile */}
          <div className="mb-5 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:mb-6 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {labels.map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest transition-all",
                  filter === l
                    ? "bg-brand-gold text-[#050505] shadow-[0_0_16px_rgba(212,175,55,0.3)]"
                    : "border border-[#222] text-[#555] hover:border-brand-gold/40 hover:text-[#ccc]"
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {!hasCmsContent && (
            <p className="mb-4 text-center text-[10px] font-bold tracking-[0.25em] text-[#333]">
              PLACEHOLDER CONTENT — REPLACE VIA CMS
            </p>
          )}

          {/* Track rows */}
          <div className="overflow-hidden rounded-xl border border-[#1a1a1a]">
            {filteredTracks.map((track, fi) => {
              const gi = tracks.indexOf(track)
              const isActive = gi === activeIdx

              return (
                <button
                  key={`${track.title}-${fi}`}
                  onClick={() => selectTrack(gi)}
                  className={cn(
                    "group flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors sm:gap-4 sm:px-5 sm:py-4",
                    fi !== 0 && "border-t border-[#1a1a1a]",
                    isActive ? "bg-brand-gold/5" : "hover:bg-[#0f0f0f]"
                  )}
                >
                  {/* Index / waveform */}
                  <div className="flex w-5 shrink-0 items-center justify-center sm:w-6">
                    {isActive ? (
                      <WaveformBars playing={playing} />
                    ) : (
                      <>
                        <span className="text-sm tabular-nums text-[#444] group-hover:hidden">
                          {String(fi + 1).padStart(2, "0")}
                        </span>
                        <Play className="hidden h-4 w-4 text-[#e0e0e0] group-hover:block" />
                      </>
                    )}
                  </div>

                  {/* Small icon — hidden on mobile */}
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10 ring-1 ring-brand-purple/20 sm:flex sm:h-10 sm:w-10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-brand-gold/50">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>

                  {/* Track info */}
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "font-heading text-sm font-bold leading-snug",
                      isActive ? "text-brand-gold" : "text-[#e0e0e0] group-hover:text-white"
                    )}>
                      {track.title}
                    </p>
                    {/* Description hidden on xs to save space */}
                    <p className="mt-0.5 hidden truncate text-xs text-[#555] xs:block sm:block">
                      {track.description}
                    </p>
                    {/* Label badge inline on mobile (hidden on md where it shows on the right) */}
                    <span className={cn(
                      "mt-1 inline-block rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-widest md:hidden",
                      getLabelStyle(track.label)
                    )}>
                      {track.label}
                    </span>
                  </div>

                  {/* Label badge — right side on md+ */}
                  <span className={cn(
                    "hidden shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-widest md:inline-block",
                    getLabelStyle(track.label)
                  )}>
                    {track.label}
                  </span>

                  {/* Duration */}
                  <span className="shrink-0 tabular-nums text-xs text-[#444]">{track.duration}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center gap-5 px-5 py-14 text-center sm:gap-6 sm:px-6 sm:py-20">
        <div className="h-px w-16 bg-brand-gold/30" />
        <p className="text-[10px] font-bold tracking-[0.35em] text-brand-gold">FOLLOW THE STORY</p>
        <h2 className="font-heading text-2xl font-bold text-[#f0f0f0] sm:text-3xl md:text-4xl">
          Never Miss an Episode
        </h2>
        <p className="max-w-[440px] text-sm leading-[1.8] text-[#777]">
          Subscribe wherever you listen, and follow{" "}
          <Link
            href="https://instagram.com/ink2screen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold underline underline-offset-4"
          >
            @ink2screen
          </Link>{" "}
          for new episode announcements.
        </p>
        <Button
          asChild
          className="h-12 rounded-full bg-brand-gold px-8 text-[11px] font-bold tracking-widest text-[#050505] hover:bg-brand-gold/90"
        >
          <Link href="/contact">GET IN TOUCH</Link>
        </Button>
      </section>
    </div>
  )
}
