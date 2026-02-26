"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"

export function ReviewForm({
  productId,
  onReviewSubmitted,
}: {
  productId: string
  onReviewSubmitted?: () => void
}) {
  const { customer, isAuthenticated } = useAuthStore()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated || !customer) {
    return (
      <div className="rounded-lg border border-[#333] bg-[#121212] p-6">
        <p className="text-sm text-[#888]">
          <Link href="/login" className="font-medium text-brand-gold hover:underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-800/50 bg-green-950/20 p-6">
        <p className="text-sm font-medium text-green-200">
          Thank you! Your review has been submitted and is pending approval.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating.")
      return
    }

    if (!content.trim()) {
      setError("Please write a review.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await sdk.client.fetch("/store/reviews", {
        method: "POST",
        body: {
          product_id: productId,
          rating,
          title: title.trim() || undefined,
          content: content.trim(),
          first_name: customer!.first_name || "Anonymous",
          last_name: customer!.last_name || "",
        },
      })

      setSuccess(true)
      onReviewSubmitted?.()
    } catch {
      setError("Failed to submit review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-[#333] bg-[#121212] p-6">
      <h3 className="mb-4 text-lg font-semibold text-[#e0e0e0]">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div>
          <Label className="text-[#e0e0e0]">Rating</Label>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-[#888]">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="review-title" className="text-[#e0e0e0]">Title (optional)</Label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summary of your review"
            maxLength={200}
            className="border-[#333] bg-[#1a1a1a] text-[#e0e0e0]"
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="review-content" className="text-[#e0e0e0]">Your Review</Label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this product..."
            required
            rows={4}
            className="mt-1 w-full rounded-md border border-[#333] bg-[#1a1a1a] px-3 py-2 text-sm text-[#e0e0e0] placeholder:text-[#666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading || rating === 0 || !content.trim()}
          className="bg-brand-gold text-[#050505] hover:bg-brand-gold-dark"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Review
        </Button>
      </form>
    </div>
  )
}
