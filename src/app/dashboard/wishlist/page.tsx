"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore, useCartStore, useRegionStore } from "@/lib/store"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { getWishlist, removeFromWishlist } from "@/lib/wishlist"
import type { WishlistItem } from "@/lib/wishlist"

type ProductInfo = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  category?: string
  price?: number
  currency?: string
}

type WishlistItemWithProduct = WishlistItem & {
  product?: ProductInfo
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative flex h-[300px] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-soft-light"
          priority
        />
      </div>

      <div className="relative mx-auto flex max-w-[1088px] flex-col items-center gap-4 px-6 text-center">
        <Heart className="h-10 w-10 text-brand-gold" />
        <h1 className="font-heading text-5xl font-bold leading-[1.2] tracking-tight text-[#e0e0e0] md:text-[64px]">
          MY WISHLIST
        </h1>
        <p className="max-w-[800px] text-xl font-light leading-relaxed text-brand-gold md:text-2xl md:leading-[1.6]">
          Your saved artifacts and curated picks.
        </p>
      </div>
    </section>
  )
}

/* ─── Product Card (matches artefacts page style) ─── */
function WishlistCard({
  item,
  onRemove,
  onAddToCart,
  removingId,
  addingToCartId,
}: {
  item: WishlistItemWithProduct
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItemWithProduct) => void
  removingId: string | null
  addingToCartId: string | null
}) {
  return (
    <div className="group relative flex h-[560px] w-full flex-col overflow-hidden bg-[#121212]">
      {/* Background texture */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-multiply"
        />
      </div>

      {/* Remove from wishlist button (top-right) */}
      <button
        onClick={() => onRemove(item.id)}
        disabled={removingId === item.id}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#28292a]/80 backdrop-blur-sm transition-all hover:bg-red-500/20"
        aria-label="Remove from wishlist"
      >
        {removingId === item.id ? (
          <Loader2 className="h-5 w-5 animate-spin text-[#888]" />
        ) : (
          <Trash2 className="h-5 w-5 text-[#888] transition-colors hover:text-red-500" />
        )}
      </button>

      {/* Purple glow behind product (CSS only) */}
      <div className="absolute left-1/2 top-[35%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[120px]" />

      {/* Product image */}
      <Link
        href={
          item.product?.handle ? `/artefacts/${item.product.handle}` : "#"
        }
        className="relative flex flex-1 items-center justify-center p-6"
      >
        {item.product?.thumbnail ? (
          <div className="relative h-[260px] w-[240px]">
            <Image
              src={item.product.thumbnail}
              alt={item.product?.title || "Product"}
              fill
              className="object-contain transition-transform group-hover:scale-[1.02]"
              sizes="240px"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-[#888]">
            No image
          </div>
        )}
      </Link>

      {/* Product info — pinned to bottom */}
      <div className="relative flex h-[200px] flex-col items-center justify-center gap-2 px-4 text-center">
        <Link
          href={
            item.product?.handle ? `/artefacts/${item.product.handle}` : "#"
          }
        >
          <h2 className="line-clamp-2 max-w-full font-heading text-xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] transition-colors hover:text-brand-gold md:text-2xl">
            {item.product?.title || "Product unavailable"}
          </h2>
        </Link>
        {item.product?.category && (
          <p className="text-[11px] font-bold tracking-[0.05em] text-[#888]">
            {item.product.category}
          </p>
        )}
        {item.product?.price != null && (
          <p className="text-base font-normal leading-[1.7] text-brand-gold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: item.product.currency || "usd",
            }).format(item.product.price)}
          </p>
        )}

        {/* Add to Cart button */}
        <Button
          className="mt-2 h-10 bg-brand-gold px-6 text-xs font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
          onClick={() => onAddToCart(item)}
          disabled={addingToCartId === item.id}
        >
          {addingToCartId === item.id ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          ADD TO CART
        </Button>
      </div>
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <section className="bg-[#050505] px-6 py-24">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-6 text-center">
        <Heart className="h-16 w-16 text-[#333]" />
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0] md:text-3xl">
          Your wishlist is empty
        </h2>
        <p className="text-lg font-light leading-relaxed text-[#888]">
          Browse our collection and save the artifacts you love.
        </p>
        <Button
          asChild
          className="h-14 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
        >
          <Link href="/artefacts">BROWSE THE ARTIFACTS</Link>
        </Button>
      </div>
    </section>
  )
}

/* ─── Loading State ─── */
function LoadingState() {
  return (
    <section className="bg-[#050505] px-6 py-24">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-gold" />
        <p className="text-lg font-light text-[#888]">
          Loading your wishlist...
        </p>
      </div>
    </section>
  )
}

/* ─── Wishlist Page ─── */
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

      const itemsWithProducts: WishlistItemWithProduct[] = await Promise.all(
        wishlist.items.map(async (item) => {
          try {
            const { products } = await sdk.store.product.list({
              id: item.product_id,
              fields: "+variants.calculated_price",
              region_id: regionId || undefined,
            })
            const product = products[0]
            const firstVariant = product?.variants?.[0]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const calcPrice = (firstVariant as any)?.calculated_price
            return {
              ...item,
              product: product
                ? {
                    id: product.id,
                    title: product.title,
                    handle: product.handle || "",
                    thumbnail: product.thumbnail,
                    category: product.categories?.[0]?.name,
                    price: calcPrice?.calculated_amount,
                    currency: calcPrice?.currency_code || "usd",
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
    if (!item.product_id) return

    setAddingToCartId(item.id)
    try {
      // Ensure we have a region
      const activeRegionId = regionId || (await getDefaultRegionId())

      // Ensure we have a cart
      let currentCartId = cartId
      if (!currentCartId) {
        const { cart } = await sdk.store.cart.create({
          region_id: activeRegionId,
        })
        currentCartId = cart.id
        setCartId(cart.id)
      }

      // Get a variant ID — fetch from product if not stored on wishlist item
      let variantId: string | null = item.variant_id
      if (!variantId) {
        const { products } = await sdk.store.product.list({
          id: item.product_id,
          fields: "*variants",
        })
        variantId = products[0]?.variants?.[0]?.id ?? null
      }

      if (variantId && currentCartId) {
        await sdk.store.cart.createLineItem(currentCartId, {
          variant_id: variantId,
          quantity: 1,
        })
      }
    } catch (err) {
      console.error("Add to cart from wishlist failed:", err)
    } finally {
      setAddingToCartId(null)
    }
  }

  return (
    <div className="bg-[#050505]">
      <HeroSection />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="bg-[#050505] px-6 py-0">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
                removingId={removingId}
                addingToCartId={addingToCartId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Spacer before footer */}
      <div className="h-24" />
    </div>
  )
}
