"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"

function formatPrice(amount: number | undefined, currency: string = "usd") {
  if (amount === undefined) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export default function CartPage() {
  const { cartId, clearCart } = useCartStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!cartId) {
      setLoading(false)
      return
    }

    sdk.store.cart
      .retrieve(cartId)
      .then(({ cart }) => setCart(cart))
      .catch(() => {
        clearCart()
      })
      .finally(() => setLoading(false))
  }, [cartId, clearCart])

  async function updateQuantity(lineItemId: string, quantity: number) {
    if (!cartId || quantity < 1) return

    setUpdating(lineItemId)
    try {
      const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
        cartId,
        lineItemId,
        { quantity }
      )
      setCart(updatedCart)
    } catch (err) {
      console.error("Update error:", err)
    } finally {
      setUpdating(null)
    }
  }

  async function removeItem(lineItemId: string) {
    if (!cartId) return

    setUpdating(lineItemId)
    try {
      const { parent: updatedCart } = await sdk.store.cart.deleteLineItem(
        cartId,
        lineItemId
      )
      setCart(updatedCart)
    } catch (err) {
      console.error("Remove error:", err)
    } finally {
      setUpdating(null)
    }
  }

  const items = cart?.items || []

  return (
    <div className="relative min-h-[80vh] bg-[#121212]">
      {/* Background texture overlay — noisy grain across the entire page */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg-texture.jpg"
          alt=""
          fill
          className="object-cover opacity-20 mix-blend-soft-light"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="relative mx-auto max-w-[520px] px-4 py-10">
          <h1 className="font-heading text-xl font-bold uppercase tracking-tight text-[#e0e0e0]">
            Your Narrative
          </h1>
          <Separator className="mt-4 bg-brand-gold/30" />
          <div className="mt-8 animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded bg-[#1a1a1a]" />
            ))}
          </div>
        </div>
      )}

      {/* Empty cart state */}
      {!loading && (!cartId || items.length === 0) && (
        <div className="relative mx-auto max-w-[520px] px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-xl font-bold uppercase tracking-tight text-[#e0e0e0]">
              Your Narrative (0 Items)
            </h1>
            <Link href="/" aria-label="Close">
              <X className="h-6 w-6 text-[#e0e0e0]/70 transition-colors hover:text-[#e0e0e0]" />
            </Link>
          </div>

          <Separator className="mt-4 bg-brand-gold/30" />

          {/* Empty state message */}
          <div className="flex flex-col items-center gap-4 py-10">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[#e0e0e0]">
              Your narrative is empty.
            </h2>
            <p className="font-body text-base text-[#e0e0e0]">
              Start your collection with our latest releases.
            </p>
            <Button
              asChild
              className="mt-2 h-14 bg-brand-gold px-8 font-body text-sm font-bold uppercase tracking-widest text-[#050505] hover:bg-brand-gold/90"
            >
              <Link href="/artefacts">Return to Marketplace</Link>
            </Button>
          </div>

          <Separator className="bg-brand-gold/30" />

          {/* Recommended for you */}
          <div className="pt-10">
            <h3 className="font-heading text-xl font-bold tracking-tight text-[#e0e0e0]">
              Recommended for you
            </h3>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { name: "Raison D'etre Cap", material: "Cotton", price: "$24.99", image: "/images/product-hat.png" },
                { name: "D'etre Tank Top", material: "Cotton", price: "$24.99", image: "/images/product-tank.png" },
                { name: "Raison D'etre Cap", material: "Cotton", price: "$24.99", image: "/images/product-hat.png" },
              ].map((product, i) => (
                <Link
                  key={i}
                  href="/artefacts"
                  className="group relative flex flex-col items-center overflow-hidden bg-[#121212]"
                >
                  {/* Product card texture */}
                  <div className="absolute inset-0">
                    <Image
                      src="/images/hero-bg-texture.jpg"
                      alt=""
                      fill
                      className="object-cover opacity-10 mix-blend-multiply"
                    />
                  </div>
                  {/* Purple glow */}
                  <div className="absolute left-1/2 top-[40%] h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-purple/20 blur-[60px]" />
                  <div className="relative flex h-36 items-center justify-center p-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="relative w-full px-2 pb-3 text-center">
                    <p className="font-heading text-sm font-bold leading-tight tracking-tight text-[#e0e0e0]">
                      {product.name}
                    </p>
                    <p className="mt-0.5 font-body text-[6px] font-semibold uppercase tracking-wider text-[#888]">
                      {product.material}
                    </p>
                    <p className="mt-1 font-body text-xs font-medium text-brand-gold">
                      {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filled cart state */}
      {!loading && cartId && items.length > 0 && (
        <div className="relative mx-auto max-w-[520px] px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-xl font-bold uppercase tracking-tight text-[#e0e0e0]">
              Your Narrative ({items.length} {items.length === 1 ? "Item" : "Items"})
            </h1>
            <Link href="/" aria-label="Close">
              <X className="h-6 w-6 text-[#e0e0e0]/70 transition-colors hover:text-[#e0e0e0]" />
            </Link>
          </div>

          <Separator className="mt-4 bg-brand-gold/30" />

          {/* Cart Items */}
          <div className="mt-6 space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                {/* Item Image */}
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1a1a1a]">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.product_title || "Product"}
                      fill
                      className="object-cover"
                      sizes="80px"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#888]">
                      No img
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#e0e0e0]">
                      {item.product_title}
                    </h3>
                    <p className="text-xs text-[#888]">
                      {item.variant_title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-brand-gold/30 bg-transparent text-[#e0e0e0] hover:bg-brand-gold/10"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm text-[#e0e0e0]">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-brand-gold/30 bg-transparent text-[#e0e0e0] hover:bg-brand-gold/10"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-body text-sm font-semibold text-brand-gold">
                        {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#e0e0e0]/50 hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6 bg-brand-gold/30" />

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-body text-[#888]">Subtotal</span>
              <span className="font-body text-[#e0e0e0]">
                {formatPrice(cart.item_subtotal, cart.currency_code)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-body text-[#888]">Shipping</span>
              <span className="font-body text-[#e0e0e0]">Calculated at checkout</span>
            </div>

            <Separator className="bg-brand-gold/30" />

            <div className="flex justify-between text-lg font-bold">
              <span className="font-heading text-[#e0e0e0]">Total</span>
              <span className="font-heading text-brand-gold">
                {formatPrice(cart.total, cart.currency_code)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-14 bg-brand-gold font-body text-sm font-bold uppercase tracking-widest text-[#050505] hover:bg-brand-gold/90"
            >
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-14 border-brand-gold/30 bg-transparent font-body text-sm font-bold uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10"
            >
              <Link href="/artefacts">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
