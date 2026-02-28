"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    getWishlist().then((wishlist) => {
      if (!wishlist) return
      const item = wishlist.items.find((i) => i.product_id === productId)
      if (item) {
        setWishlisted(true)
        setWishlistItemId(item.id)
      }
    })
  }, [isAuthenticated, productId])

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      setLoading(true)
      try {
        if (wishlisted && wishlistItemId) {
          const success = await removeFromWishlist(wishlistItemId)
          if (success) {
            setWishlisted(false)
            setWishlistItemId(null)
          }
        } else {
          const item = await addToWishlist(productId)
          if (item) {
            setWishlisted(true)
            setWishlistItemId(item.id)
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, wishlisted, wishlistItemId, productId, router]
  )

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-[#28292a]/80 backdrop-blur-sm transition-all hover:bg-[#28292a]",
        loading && "opacity-50",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          wishlisted
            ? "fill-red-500 text-red-500"
            : "text-[#888] hover:text-[#e0e0e0]"
        )}
      />
    </button>
  )
}
