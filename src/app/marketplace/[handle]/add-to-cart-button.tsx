"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore, useRegionStore, useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/wishlist"

function formatPrice(amount: number | undefined, currency: string = "usd") {
  if (amount === undefined) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AddToCartButton({ product }: { product: any }) {
  const router = useRouter()
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { cartId, setCartId } = useCartStore()
  const { regionId } = useRegionStore()
  const { isAuthenticated } = useAuthStore()

  // Wishlist state
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (!isAuthenticated) return

    getWishlist().then((wishlist) => {
      if (!wishlist) return
      const item = wishlist.items.find(
        (i) => i.product_id === product.id
      )
      if (item) {
        setWishlisted(true)
        setWishlistItemId(item.id)
      }
    })
  }, [isAuthenticated, product.id])

  const variants = useMemo(() => product.variants || [], [product.variants])

  // Auto-select if only one variant
  useEffect(() => {
    if (variants.length === 1 && !selectedVariantId) {
      setSelectedVariantId(variants[0].id)
    }
  }, [variants, selectedVariantId])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId)
  const price = selectedVariant?.calculated_price?.calculated_amount
  const currency = selectedVariant?.calculated_price?.currency_code || "usd"

  async function handleAddToCart() {
    if (!selectedVariantId) return

    setAdding(true)
    setError(null)

    try {
      let currentCartId = cartId

      // Create cart if none exists
      if (!currentCartId) {
        const { cart } = await sdk.store.cart.create({
          region_id: regionId || undefined,
        })
        currentCartId = cart.id
        setCartId(cart.id)
      }

      // Add item to cart
      await sdk.store.cart.createLineItem(currentCartId, {
        variant_id: selectedVariantId,
        quantity: 1,
      })

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      setError("Failed to add to cart. Please try again.")
      console.error("Add to cart error:", err)
    } finally {
      setAdding(false)
    }
  }

  async function handleWishlistToggle() {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setWishlistLoading(true)
    try {
      if (wishlisted && wishlistItemId) {
        const success = await removeFromWishlist(wishlistItemId)
        if (success) {
          setWishlisted(false)
          setWishlistItemId(null)
        }
      } else {
        const item = await addToWishlist(product.id)
        if (item) {
          setWishlisted(true)
          setWishlistItemId(item.id)
        }
      }
    } catch {
      // Wishlist toggle failed silently
    } finally {
      setWishlistLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      {variants.length > 1 && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Select Format
          </label>
          <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {variants.map((variant: any) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.title}
                  {variant.calculated_price?.calculated_amount !== undefined &&
                    ` - ${formatPrice(variant.calculated_price.calculated_amount, variant.calculated_price?.currency_code)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Auto-select handled via default state */}

      {/* Price Display */}
      {price !== undefined && (
        <p className="text-2xl font-bold text-primary">
          {formatPrice(price, currency)}
        </p>
      )}

      {/* Add to Cart + Wishlist */}
      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || adding}
        >
          {added ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : adding ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${
              wishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
