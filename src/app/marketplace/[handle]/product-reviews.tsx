"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sdk } from "@/lib/sdk"

type StoreProductReview = {
  id: string
  title: string | null
  content: string
  rating: number
  first_name: string
  last_name: string
  created_at: string
}

type ReviewsResponse = {
  reviews: StoreProductReview[]
  average_rating: number
  count: number
  limit: number
  offset: number
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<StoreProductReview[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const limit = 10

  async function fetchReviews(currentOffset: number, append = false) {
    try {
      const data = await sdk.client.fetch<ReviewsResponse>(
        `/store/products/${productId}/reviews`,
        {
          query: {
            limit,
            offset: currentOffset,
            order: "-created_at",
          },
        }
      )

      if (append) {
        setReviews((prev) => [...prev, ...data.reviews])
      } else {
        setReviews(data.reviews)
      }
      setAverageRating(data.average_rating)
      setCount(data.count)
    } catch {
      // Reviews fetch failed — show empty state
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchReviews(0).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  function handleLoadMore() {
    const newOffset = offset + limit
    setOffset(newOffset)
    setLoadingMore(true)
    fetchReviews(newOffset, true).finally(() => setLoadingMore(false))
  }

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="mb-4 text-xl font-semibold">Customer Reviews</h2>
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Customer Reviews</h2>

      {/* Summary */}
      {count > 0 ? (
        <div className="mb-6 flex items-center gap-3">
          <StarRating rating={Math.round(averageRating)} size="lg" />
          <span className="text-lg font-medium">{averageRating}</span>
          <span className="text-sm text-muted-foreground">
            ({count} {count === 1 ? "review" : "reviews"})
          </span>
        </div>
      ) : (
        <p className="mb-6 text-muted-foreground">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="mb-2 flex items-center gap-3">
              <StarRating rating={review.rating} />
              {review.title && (
                <span className="font-medium">{review.title}</span>
              )}
            </div>
            <p className="mb-2 text-sm">{review.content}</p>
            <p className="text-xs text-muted-foreground">
              By {review.first_name} {review.last_name} &mdash;{" "}
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {reviews.length < count && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={handleLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "Load More Reviews"}
        </Button>
      )}
    </div>
  )
}
