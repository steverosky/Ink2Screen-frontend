"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore, useCartStore, useRegionStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"
import { getWishlist, removeFromWishlist } from "@/lib/wishlist"
import type { WishlistItem } from "@/lib/wishlist"

type ProductInfo = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
}

type WishlistItemWithProduct = WishlistItem & {
  product?: ProductInfo
}

export default function WishlistPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { cartId, setCartId } = useCartStore()
  const { regionId } = useRegionStore()

  const [items, setItems] = useState<WishlistItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    async function fetchWishlist() {
      const wishlist = await getWishlist()
      if (!wishlist || !wishlist.items.length) {
        setItems([])
        setLoading(false)
        return
      }

      // Fetch product details for each item
      const itemsWithProducts: WishlistItemWithProduct[] = await Promise.all(
        wishlist.items.map(async (item) => {
          try {
            const { products } = await sdk.store.product.list({
              id: item.product_id,
              region_id: regionId || undefined,
            })
            const product = products[0]
            return {
              ...item,
              product: product
                ? {
                    id: product.id,
                    title: product.title,
                    handle: product.handle || "",
                    thumbnail: product.thumbnail,
                  }
                : undefined,
            }
          } catch {
            return { ...item }
          }
        })
      )

      setItems(itemsWithProducts)
      setLoading(false)
    }

    fetchWishlist()
  }, [isAuthenticated, router, regionId])

  async function handleRemove(itemId: string) {
    setRemovingId(itemId)
    const success = await removeFromWishlist(itemId)
    if (success) {
      setItems((prev) => prev.filter((i) => i.id !== itemId))
    }
    setRemovingId(null)
  }

  async function handleAddToCart(item: WishlistItemWithProduct) {
    if (!item.variant_id && !item.product_id) return

    setAddingToCartId(item.id)
    try {
      let currentCartId = cartId

      if (!currentCartId) {
        const { cart } = await sdk.store.cart.create({
          region_id: regionId || undefined,
        })
        currentCartId = cart.id
        setCartId(cart.id)
      }

      // If we have a variant_id, use it; otherwise get first variant
      let variantId: string | null = item.variant_id
      if (!variantId) {
        const { products } = await sdk.store.product.list({
          id: item.product_id,
          fields: "variants",
        })
        variantId = products[0]?.variants?.[0]?.id ?? null
      }

      if (variantId) {
        await sdk.store.cart.createLineItem(currentCartId, {
          variant_id: variantId,
          quantity: 1,
        })
      }
    } catch {
      // Add to cart failed
    } finally {
      setAddingToCartId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-medium">Your wishlist is empty</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Browse our marketplace and save products you love.
          </p>
          <Button asChild>
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              {/* Product Image */}
              <Link
                href={
                  item.product?.handle
                    ? `/marketplace/${item.product.handle}`
                    : "#"
                }
                className="block"
              >
                <div className="relative aspect-[3/4] bg-muted">
                  {item.product?.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product?.title || "Product"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="mb-3 font-medium leading-tight">
                  {item.product?.title || "Product unavailable"}
                </h3>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                    disabled={addingToCartId === item.id}
                  >
                    {addingToCartId === item.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-1 h-4 w-4" />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                  >
                    {removingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
