"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AudioTrack {
  title: string
  description?: string
  src: string
  duration?: string
  thumbnail?: string
  label?: string
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function AudioPlayer({ track, className }: { track: AudioTrack; className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = Number(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border border-brand-gold/20 bg-[#121212] p-5", className)}>
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <div className="flex items-start gap-4">
        {/* Thumbnail / Album art */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-brand-purple/20">
          {track.thumbnail ? (
            <Image src={track.thumbnail} alt={track.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-brand-gold/60">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          {track.label && (
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand-gold/60">
              {track.label}
            </p>
          )}
          <p className="truncate font-heading text-base font-bold text-[#e0e0e0]">{track.title}</p>
          {track.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-[#888]">{track.description}</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-[#888]">
          {formatTime(currentTime)}
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="relative z-10 h-1 w-full cursor-pointer appearance-none rounded-full bg-transparent accent-brand-gold"
            style={{
              background: `linear-gradient(to right, #D4AF37 ${progress}%, #333 ${progress}%)`,
            }}
          />
        </div>
        <span className="w-10 shrink-0 text-xs tabular-nums text-[#888]">
          {duration > 0 ? formatTime(duration) : (track.duration ?? "—")}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold transition-opacity hover:opacity-90 active:scale-95"
        >
          {playing ? (
            <Pause className="h-5 w-5 fill-[#050505] text-[#050505]" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-[#050505] text-[#050505]" />
          )}
        </button>

        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="text-[#888] transition-colors hover:text-[#e0e0e0]"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
