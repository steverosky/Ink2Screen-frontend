"use client"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Review {
  quote: string
  author: string
  image: string
}

const reviews: Review[] = [
  {
    quote:
      "Sterling\u2019s writing doesn\u2019t just tell a story \u2014 it architects an experience. Raison D\u2019\u00eatre challenged me to rethink everything I thought I knew about psychological fiction. A masterclass in narrative engineering.",
    author: "Marcus T. Webb",
    image:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=600&h=800&fit=crop&crop=face",
  },
  {
    quote:
      "From the very first chapter, I was pulled into a world that felt both deeply personal and universally resonant. Ink2Screen is redefining what it means to own your story. This is literature with intention.",
    author: "Ayana J. Clarke",
    image:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=800&fit=crop&crop=face",
  },
  {
    quote:
      "I\u2019ve read hundreds of debut novels, and very few carry the structural precision and emotional weight that Raison D\u2019\u00eatre delivers. Sterling R. Smith is an author to watch \u2014 and Ink2Screen is the platform making it happen.",
    author: "David R. Okonkwo",
    image:
      "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?w=600&h=800&fit=crop&crop=face",
  },
]

function QuoteIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 50 C10 38, 18 28, 30 24 L30 30 C24 32, 20 37, 20 42 L30 42 L30 56 L10 56 Z"
        fill="#D4AF37"
      />
      <path
        d="M40 50 C40 38, 48 28, 60 24 L60 30 C54 32, 50 37, 50 42 L60 42 L60 56 L40 56 Z"
        fill="#D4AF37"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Photo */}
      <div className="relative h-[300px] w-full shrink-0 sm:h-[400px] md:h-auto md:w-[466px]">
        <Image
          src={review.image}
          alt={review.author}
          fill
          sizes="(max-width: 768px) 100vw, 466px"
          className="object-cover"
        />
      </div>

      {/* Quote */}
      <div className="flex flex-1 flex-col gap-4 bg-[#28292a] p-6 pb-20 sm:gap-6 sm:pb-24">
        <QuoteIcon />
        <p className="text-lg font-light leading-relaxed text-[#f0f0f0] sm:text-xl md:text-2xl md:leading-[1.6]">
          &ldquo;{review.quote}&rdquo;
        </p>
        <p className="text-right text-lg font-medium leading-relaxed text-[#f0f0f0] sm:text-xl md:text-2xl">
          {review.author}
        </p>
      </div>
    </div>
  )
}

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(0)
  const [flipState, setFlipState] = useState<"idle" | "flipping" | "resetting">(
    "idle"
  )
  const flipRef = useRef<HTMLDivElement>(null)

  const goToNext = useCallback(() => {
    if (flipState !== "idle") return
    const nextIndex = (current + 1) % reviews.length
    setNext(nextIndex)
    setFlipState("flipping")
  }, [flipState, current])

  const handleTransitionEnd = useCallback(() => {
    if (flipState === "flipping") {
      // Flip finished — instantly snap back without transition
      setFlipState("resetting")
      setCurrent(next)

      // Use rAF to ensure the browser has painted with transition:none
      // before re-enabling transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipState("idle")
        })
      })
    }
  }, [flipState, next])

  const getFlipStyle = (): React.CSSProperties => {
    if (flipState === "flipping") {
      return {
        transform: "rotateY(-180deg)",
        transition: "transform 1000ms ease-in-out",
      }
    }
    if (flipState === "resetting") {
      return {
        transform: "rotateY(0deg)",
        transition: "none",
      }
    }
    return {
      transform: "rotateY(0deg)",
      transition: "transform 1000ms ease-in-out",
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-gold/20 to-[#aa8324]/20 py-12 sm:py-16 md:h-[760px] md:py-0">
      {/* Texture overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-5 mix-blend-soft-light"
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1240px] items-center px-4 sm:px-6">
        {/* 3D flip container */}
        <div className="relative w-full" style={{ perspective: "2000px" }}>
          {/* Next card (sits behind, revealed as front flips away) */}
          <div className="w-full overflow-hidden rounded-lg">
            <ReviewCard review={reviews[next]} />
          </div>

          {/* Current card (flips right-to-left like a book page) */}
          <div
            ref={flipRef}
            className="absolute inset-0 w-full overflow-hidden rounded-lg"
            style={{
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              ...getFlipStyle(),
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <ReviewCard review={reviews[current]} />

            {/* Page shadow effect during flip */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent transition-opacity duration-500",
                flipState === "flipping" ? "opacity-100" : "opacity-0"
              )}
            />
          </div>

          {/* Shadow cast on the revealed card */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-black/40 to-transparent transition-opacity duration-700",
              flipState === "flipping" ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Next button — responsive positioning */}
          <div className="absolute bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
            <Button
              onClick={goToNext}
              className="h-12 w-12 bg-brand-gold p-0 shadow-lg hover:bg-brand-gold-dark sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-5 w-5 text-[#050505] sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
