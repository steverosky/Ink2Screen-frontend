"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, useRegionStore, useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/wishlist"
import { cn } from "@/lib/utils"

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
  const [selectedQty, setSelectedQty] = useState(1)
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
  const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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
        quantity: selectedQty,
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
    <div className="flex flex-col gap-6">
      {/* Price Display */}
      {price !== undefined && (
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <p className="text-[32px] font-bold leading-[1.4] tracking-tight text-[#e0e0e0]">
            {formatPrice(price, currency)}
          </p>
        </div>
      )}

      {/* Format / Variant Selection */}
      {variants.length > 1 && (
        <>
          <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
            SELECT FORMAT
          </p>
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {variants.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
                className={cn(
                  "flex h-14 items-center justify-center border px-8 text-sm font-bold tracking-widest transition-colors",
                  selectedVariantId === variant.id
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-brand-gold/50 text-brand-gold/70 hover:border-brand-gold hover:text-brand-gold"
                )}
              >
                {variant.title?.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Quantity */}
      <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
        Quantity:
      </p>
      <div className="flex flex-wrap gap-2">
        {quantities.map((qty) => (
          <button
            key={qty}
            onClick={() => setSelectedQty(qty)}
            className={cn(
              "flex h-14 w-14 items-center justify-center border text-sm font-bold tracking-widest transition-colors",
              selectedQty === qty
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-brand-gold/50 text-brand-gold/70 hover:border-brand-gold hover:text-brand-gold"
            )}
          >
            {qty}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <Button
          className="h-14 flex-1 bg-brand-gold text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || adding}
        >
          {added ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              ADDED TO CART
            </>
          ) : adding ? (
            "ADDING..."
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              ADD TO CART
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="h-14 flex-1 border-brand-gold text-sm font-bold tracking-widest text-brand-gold hover:bg-brand-gold/10"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
        >
          <Heart
            className={cn(
              "mr-2 h-5 w-5",
              wishlisted && "fill-red-500 text-red-500"
            )}
          />
          {wishlisted ? "WISHLISTED" : "Add to Wishlist"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
