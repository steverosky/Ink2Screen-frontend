"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  const items = cart?.items || []

  if (!cartId || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button size="lg" asChild>
          <Link href="/artefacts">
            Browse The Artifacts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4">
                {/* Item Image */}
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded bg-muted">
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
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{item.product_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.variant_title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.item_subtotal, cart.currency_code)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(cart.total, cart.currency_code)}
              </span>
            </div>

            <Button size="lg" className="mt-6 w-full" asChild>
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="mt-2 w-full"
              asChild
            >
              <Link href="/artefacts">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
