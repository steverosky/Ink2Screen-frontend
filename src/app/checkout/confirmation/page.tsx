"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, useAuthStore } from "@/lib/store"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Safety net: clear cart on confirmation page load
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-4 text-3xl font-bold">Thank You for Your Order!</h1>

      {orderId && (
        <p className="mb-2 font-mono text-sm text-muted-foreground">
          Order ID: {orderId}
        </p>
      )}

      <p className="mb-8 text-muted-foreground">
        We&apos;ve received your order and will begin processing it shortly.
        You&apos;ll receive a confirmation email with your order details.
      </p>

      {/* Guest: prompt to create account */}
      {!isAuthenticated && (
        <div className="mx-auto mb-8 max-w-md rounded-lg border bg-muted/50 p-6">
          <p className="mb-3 font-medium">
            Create an account to track this order
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Save your info for faster checkout next time and view your order
            history.
          </p>
          <Button asChild variant="outline">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
        {isAuthenticated && (
          <Button variant="outline" asChild>
            <Link href="/dashboard">View Your Orders</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
