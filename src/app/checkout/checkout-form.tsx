"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Loader2,
  ChevronDown,
  Phone,
  CheckSquare,
  Square,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCartStore, useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"
import { cn } from "@/lib/utils"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null

function formatPrice(amount: number | undefined, currency: string = "usd") {
  if (amount === undefined) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// --- Styled input matching Figma ---
function CheckoutInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-12 rounded-none border-[#333] bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand-gold focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}

// --- Stripe Payment Inner Form ---
function StripePaymentForm({
  cartId,
  clientSecret,
  onComplete,
  onError,
}: {
  cartId: string
  clientSecret: string
  onComplete: (orderId: string) => void
  onError: (msg: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const { clearCart } = useCartStore()

  async function handlePlaceOrder() {
    if (!stripe || !elements) return

    setLoading(true)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        onError(submitError.message || "Payment validation failed.")
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        onError(confirmError.message || "Payment failed. Please try again.")
        setLoading(false)
        return
      }

      const result = await sdk.store.cart.complete(cartId)
      if (result.type === "order") {
        clearCart()
        onComplete(result.order.id)
      } else {
        onError("Order could not be completed. Please try again.")
      }
    } catch {
      onError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PaymentElement />

      <Button
        onClick={handlePlaceOrder}
        disabled={!stripe || !elements || loading}
        className="h-14 w-full rounded-none bg-brand-gold font-body text-sm font-bold uppercase tracking-widest text-background hover:bg-brand-gold/90"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {loading ? "PROCESSING..." : "PAY NOW"}
      </Button>
      <p className="text-center font-body text-xs font-semibold text-muted-foreground">
        Secure, encrypted transaction.
      </p>
    </div>
  )
}

// --- Order Sidebar (Right Panel — Frame 92) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OrderSidebar({ cart }: { cart: any }) {
  const items = cart?.items || []
  const [discountCode, setDiscountCode] = useState("")

  return (
    <div className="space-y-8">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map(
          (item: {
            id: string
            thumbnail?: string
            product_title?: string
            variant_title?: string
            quantity: number
            unit_price: number
          }) => (
            <div key={item.id} className="flex items-center gap-6">
              {/* Thumbnail with quantity badge */}
              <div className="relative">
                <div className="flex h-[70px] w-[58px] items-center justify-center rounded-sm bg-white/[0.06] p-1.5 shadow-sm">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.product_title || "Product"}
                      width={46}
                      height={58}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-sm border border-foreground/20 bg-[#240046] font-body text-xs font-semibold text-white shadow-sm">
                  {item.quantity}
                </div>
              </div>

              {/* Item details */}
              <div className="flex flex-1 items-center gap-2">
                <div className="flex-1">
                  <p className="font-body text-base font-semibold leading-snug text-foreground">
                    {item.product_title}
                  </p>
                  {item.variant_title && (
                    <p className="font-body text-sm text-foreground/80">
                      {item.variant_title}
                    </p>
                  )}
                </div>
                <p className="font-body text-sm font-bold tracking-wider text-foreground">
                  {formatPrice(
                    item.unit_price * item.quantity,
                    cart.currency_code
                  )}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Discount Code */}
      <div className="flex gap-4">
        <div className="flex-1">
          <CheckoutInput
            placeholder="Gift card or discount code"
            value={discountCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDiscountCode(e.target.value)
            }
          />
        </div>
        <Button className="h-12 rounded-none bg-brand-gold px-8 font-body text-sm font-bold uppercase tracking-widest text-background hover:bg-brand-gold/90">
          APPLY
        </Button>
      </div>

      {/* Totals */}
      <div className="space-y-6">
        <div className="space-y-4 font-body text-sm font-semibold tracking-wider text-foreground">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(cart.item_subtotal, cart.currency_code)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>
              {cart.shipping_total > 0
                ? formatPrice(cart.shipping_total, cart.currency_code)
                : "Calculated at next step"}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-2">
          <span className="font-body text-2xl font-semibold text-brand-gold">
            Total
          </span>
          <div className="flex items-center gap-2">
            <span className="font-body text-sm font-semibold tracking-wider text-muted-foreground">
              {cart.currency_code?.toUpperCase()}
            </span>
            <span className="font-body text-2xl font-semibold text-brand-gold">
              {formatPrice(cart.total, cart.currency_code)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// === MAIN CHECKOUT FORM ===
export function CheckoutForm() {
  const router = useRouter()
  const { cartId, clearCart } = useCartStore()
  const { customer, isAuthenticated } = useAuthStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Phase controls which sections are active
  const [phase, setPhase] = useState<"info" | "shipping" | "payment">("info")

  // Contact
  const [email, setEmail] = useState("")
  const [emailOffers, setEmailOffers] = useState(true)

  // Delivery
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address1, setAddress1] = useState("")
  const [apartment, setApartment] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [countryCode, setCountryCode] = useState("us")
  const [phone, setPhone] = useState("")
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Shipping
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")

  // Payment
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Load cart on mount
  const loadCart = useCallback(async () => {
    if (!cartId) {
      setLoading(false)
      return
    }
    try {
      const { cart: fetchedCart } = await sdk.store.cart.retrieve(cartId)
      setCart(fetchedCart)

      if (isAuthenticated && customer?.email) {
        setEmail(customer.email)
      } else if (fetchedCart.email) {
        setEmail(fetchedCart.email)
      }

      if (fetchedCart.shipping_address) {
        const addr = fetchedCart.shipping_address
        if (addr.first_name) setFirstName(addr.first_name)
        if (addr.last_name) setLastName(addr.last_name)
        if (addr.address_1) setAddress1(addr.address_1)
        if (addr.city) setCity(addr.city)
        if (addr.postal_code) setPostalCode(addr.postal_code)
        if (addr.country_code) setCountryCode(addr.country_code)
        if (addr.phone) setPhone(addr.phone)
      }
    } catch {
      clearCart()
    } finally {
      setLoading(false)
    }
  }, [cartId, clearCart, isAuthenticated, customer])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Save email + address, load shipping options
  async function handleSaveInfo() {
    if (!cartId || !email || !firstName || !lastName || !address1 || !city)
      return

    setSubmitting(true)
    setError(null)
    try {
      const shippingAddress = {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        city,
        postal_code: postalCode,
        country_code: countryCode,
        phone,
      }

      const { cart: updatedCart } = await sdk.store.cart.update(cartId, {
        email,
        shipping_address: shippingAddress,
        billing_address: sameAsBilling ? shippingAddress : undefined,
      })
      setCart(updatedCart)

      const { shipping_options } =
        await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
      setShippingOptions(shipping_options || [])

      setPhase("shipping")
    } catch {
      setError("Failed to save information. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Select shipping and initialize payment
  async function handleSelectShipping(optionId: string) {
    if (!cartId) return

    setSelectedShipping(optionId)
    setSubmitting(true)
    setError(null)
    try {
      const { cart: updatedCart } = await sdk.store.cart.addShippingMethod(
        cartId,
        { option_id: optionId }
      )
      setCart(updatedCart)

      // Initialize Stripe payment session
      const { payment_collection } =
        await sdk.store.payment.initiatePaymentSession(updatedCart, {
          provider_id: "pp_stripe_stripe",
        })

      const secret =
        payment_collection?.payment_sessions?.[0]?.data
          ?.client_secret as string
      if (secret) setClientSecret(secret)

      // Re-fetch cart with payment info
      const { cart: refreshedCart } = await sdk.store.cart.retrieve(cartId)
      setCart(refreshedCart)

      setPhase("payment")
    } catch {
      setError("Failed to set up shipping/payment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleOrderComplete(orderId: string) {
    router.push(`/checkout/confirmation?orderId=${orderId}`)
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    )
  }

  // --- Empty Cart ---
  if (!cartId || !cart || !cart.items?.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
          Your cart is empty
        </h2>
        <p className="mb-8 font-body text-muted-foreground">
          Add some items before checking out.
        </p>
        <Button
          asChild
          className="h-14 rounded-none bg-brand-gold px-8 font-body text-sm font-bold uppercase tracking-widest text-background hover:bg-brand-gold/90"
        >
          <Link href="/artefacts">Browse The Artifacts</Link>
        </Button>
      </div>
    )
  }

  // --- Main Checkout Layout ---
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ====== LEFT — Scrollable Form (Frame 67) ====== */}
      <div className="flex-1 px-6 pb-20 pt-10 lg:px-20 xl:pl-40 xl:pr-20">
        {/* Logo */}
        <div className="flex justify-center pb-8 pt-3">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Ink2Screen"
              width={100}
              height={91}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="mx-auto max-w-[520px] space-y-8">
          {/* --- Express Checkout --- */}
          <div className="space-y-6">
            <p className="text-center font-body text-xs font-medium text-foreground">
              Express checkout
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center rounded-sm bg-[#ffc439] transition-opacity hover:opacity-90"
              >
                {/* PayPal full wordmark logo */}
                <svg
                  role="img"
                  aria-label="PayPal"
                  viewBox="0 0 101 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto"
                >
                  <path
                    d="M12.237 4.001H4.718a1.12 1.12 0 0 0-1.104.946L.954 25.564a.67.67 0 0 0 .662.775h3.593a1.12 1.12 0 0 0 1.104-.946l.72-4.568a1.12 1.12 0 0 1 1.104-.946h2.542c5.296 0 8.355-2.564 9.153-7.646.36-2.223.014-3.968-.984-5.19C17.725 5.693 15.375 4.001 12.237 4.001zm.929 7.528c-.44 2.892-2.647 2.892-4.782 2.892H7.181l.851-5.392a.672.672 0 0 1 .663-.567h.549c1.454 0 2.826 0 3.534.828.423.496.552 1.23.388 2.239z"
                    fill="#003087"
                  />
                  <path
                    d="M35.968 11.432h-3.607a.672.672 0 0 0-.663.567l-.159 1.009-.252-.365c-.782-1.134-2.524-1.514-4.263-1.514-3.988 0-7.393 3.022-8.056 7.261-.345 2.114.145 4.135 1.343 5.546 1.1 1.296 2.672 1.836 4.54 1.836 3.21 0 4.992-2.064 4.992-2.064l-.161 1.001a.67.67 0 0 0 .662.775h3.247a1.12 1.12 0 0 0 1.105-.946l1.947-12.331a.67.67 0 0 0-.675-.775zm-5.03 7.024c-.348 2.06-1.985 3.442-4.076 3.442-1.05 0-1.89-.337-2.43-.975-.535-.633-.737-1.534-.568-2.536.324-2.043 1.989-3.47 4.047-3.47 1.026 0 1.862.34 2.413.984.554.65.773 1.556.614 2.555z"
                    fill="#003087"
                  />
                  <path
                    d="M55.634 11.432h-3.624a1.12 1.12 0 0 0-.926.49l-5.35 7.876-2.267-7.57a1.12 1.12 0 0 0-1.073-.796h-3.561a.672.672 0 0 0-.636.895l4.273 12.54-4.02 5.672a.67.67 0 0 0 .548 1.058h3.622a1.12 1.12 0 0 0 .92-.48l12.9-18.626a.67.67 0 0 0-.806-1.06z"
                    fill="#003087"
                  />
                  <path
                    d="M67.737 4.001h-7.519a1.12 1.12 0 0 0-1.104.946l-2.66 16.617a.67.67 0 0 0 .662.775h3.85a.783.783 0 0 0 .773-.662l.755-4.852a1.12 1.12 0 0 1 1.104-.946h2.542c5.296 0 8.355-2.564 9.153-7.646.36-2.223.014-3.968-.984-5.19C73.225 5.693 70.875 4.001 67.737 4.001zm.929 7.528c-.44 2.892-2.647 2.892-4.782 2.892h-1.203l.851-5.392a.672.672 0 0 1 .663-.567h.549c1.454 0 2.826 0 3.534.828.424.496.552 1.23.388 2.239z"
                    fill="#0070BA"
                  />
                  <path
                    d="M91.468 11.432h-3.607a.672.672 0 0 0-.663.567l-.159 1.009-.252-.365c-.782-1.134-2.524-1.514-4.263-1.514-3.988 0-7.393 3.022-8.056 7.261-.345 2.114.145 4.135 1.343 5.546 1.1 1.296 2.672 1.836 4.54 1.836 3.21 0 4.992-2.064 4.992-2.064l-.161 1.001a.67.67 0 0 0 .662.775h3.247a1.12 1.12 0 0 0 1.105-.946l1.947-12.331a.672.672 0 0 0-.675-.775zm-5.03 7.024c-.348 2.06-1.985 3.442-4.076 3.442-1.05 0-1.89-.337-2.43-.975-.535-.633-.737-1.534-.568-2.536.324-2.043 1.989-3.47 4.047-3.47 1.026 0 1.862.34 2.413.984.554.65.773 1.556.614 2.555z"
                    fill="#0070BA"
                  />
                  <path
                    d="M95.074 4.535 92.368 25.564a.67.67 0 0 0 .662.775h3.103a1.12 1.12 0 0 0 1.104-.946l2.664-16.617a.67.67 0 0 0-.662-.775h-3.502a.674.674 0 0 0-.663.534z"
                    fill="#0070BA"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center rounded-sm bg-white transition-opacity hover:opacity-90"
              >
                {/* Google Pay full wordmark logo */}
                <svg
                  role="img"
                  aria-label="Google Pay"
                  viewBox="0 0 120 28"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-auto"
                >
                  {/* Google "G" */}
                  <path
                    d="M17.337 13.986h-7.31v2.07h5.24c-.26 3.06-2.82 4.37-5.23 4.37a5.77 5.77 0 0 1-5.79-5.87 5.72 5.72 0 0 1 5.79-5.82c2.49 0 4.02 1.59 4.02 1.59l1.45-1.51s-2.09-2.17-5.55-2.17A7.88 7.88 0 0 0 2.05 14.6a7.82 7.82 0 0 0 7.89 7.97c4.15 0 7.56-2.82 7.56-7.72a7.6 7.6 0 0 0-.16-.81z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.59 10.45c-3.42 0-5.87 2.68-5.87 5.87 0 3.3 2.38 5.95 5.92 5.95 3.2 0 5.81-2.45 5.81-5.88 0-3.9-3.04-5.94-5.86-5.94zm.05 2.32c1.69 0 3.56 1.36 3.56 3.63 0 2.2-1.87 3.62-3.58 3.62-2.03 0-3.62-1.63-3.62-3.63 0-1.96 1.57-3.62 3.64-3.62z"
                    fill="#EA4335"
                  />
                  <path
                    d="M40.01 10.45c-3.42 0-5.87 2.68-5.87 5.87 0 3.3 2.38 5.95 5.92 5.95 3.2 0 5.81-2.45 5.81-5.88 0-3.9-3.04-5.94-5.86-5.94zm.05 2.32c1.69 0 3.56 1.36 3.56 3.63 0 2.2-1.87 3.62-3.58 3.62-2.03 0-3.62-1.63-3.62-3.63 0-1.96 1.57-3.62 3.64-3.62z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M55.18 10.45c-3.15 0-5.67 2.76-5.67 5.9 0 3.57 2.89 5.92 5.62 5.92 1.68 0 2.58-.67 3.24-1.44v1.17c0 2.05-1.24 3.27-3.1 3.27-1.81 0-2.73-1.35-3.04-2.12l-2.03.84c.74 1.57 2.24 3.37 5.09 3.37 3.03 0 5.27-1.91 5.27-5.93V10.78h-2.21v1.03c-.77-.85-1.82-1.36-3.17-1.36zm.23 2.32c1.55 0 3.24 1.33 3.24 3.64 0 2.35-1.68 3.62-3.27 3.62-1.74 0-3.37-1.41-3.37-3.6 0-2.28 1.69-3.66 3.4-3.66z"
                    fill="#4285F4"
                  />
                  <path
                    d="M72.56 10.45c-3.08 0-5.65 2.45-5.65 5.88 0 3.52 2.72 5.94 5.95 5.94 2.57 0 4.14-1.41 5.08-2.68l-2.09-1.39c-.54.83-1.44 1.74-2.99 1.74-1.72 0-2.5-.94-2.99-1.85l8.23-3.42-.43-1.01c-.8-2.03-2.65-3.21-5.11-3.21zm.1 2.27c1.12 0 1.93.59 2.26 1.31l-5.5 2.3c-.25-1.87 1.46-3.61 3.24-3.61z"
                    fill="#EA4335"
                  />
                  <path
                    d="M62.88 22h2.31V6.87h-2.31V22z"
                    fill="#34A853"
                  />
                  {/* "Pay" text */}
                  <path
                    d="M86.16 6.87h-5.98v15.11h2.32v-5.71h3.67a5.49 5.49 0 0 0 5.47-4.7 5.49 5.49 0 0 0-5.48-4.7zm.08 7.33h-3.74V9.01h3.74a2.86 2.86 0 0 1 2.83 2.6 2.86 2.86 0 0 1-2.83 2.59z"
                    fill="#3C4043"
                  />
                  <path
                    d="M99.84 10.44c-2.1 0-3.84.95-4.65 2.58l2.06.86c.5-1 1.44-1.34 2.43-1.34a2.5 2.5 0 0 1 2.72 2.12v.17a5.75 5.75 0 0 0-2.72-.68c-2.5 0-5.04 1.37-5.04 3.93a4.03 4.03 0 0 0 4.33 3.84c1.75 0 2.72-.78 3.32-1.7h.09v1.34h2.23v-6.7c0-3.1-2.32-4.42-4.77-4.42zm-.28 9.58c-.86 0-2.06-.43-2.06-1.49 0-1.35 1.49-1.87 2.78-1.87a4.7 4.7 0 0 1 2.38.59 3.17 3.17 0 0 1-3.1 2.77z"
                    fill="#3C4043"
                  />
                  <path
                    d="M112.13 10.78l-2.65 6.71h-.09l-2.74-6.71h-2.49l4.13 9.39-2.35 5.23h2.42l6.37-14.62h-2.6z"
                    fill="#3C4043"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* --- OR Divider --- */}
          <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-[#333]" />
            <span className="font-body text-base font-semibold text-foreground">
              OR
            </span>
            <Separator className="flex-1 bg-[#333]" />
          </div>

          {/* --- Use Your Fan Account --- */}
          {!isAuthenticated && (
            <>
              <div className="space-y-6">
                <h2 className="font-body text-2xl font-semibold leading-relaxed text-foreground">
                  Use Your Fan Account
                </h2>
                <div className="flex gap-4">
                  <Button
                    asChild
                    className="h-14 flex-1 rounded-none bg-brand-gold font-body text-sm font-bold uppercase tracking-widest text-background hover:bg-brand-gold/90"
                  >
                    <Link href="/login?redirect=/checkout">SIGN IN</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-14 flex-1 rounded-none border-brand-gold font-body text-sm font-bold uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10"
                  >
                    <Link href="/register?redirect=/checkout">REGISTER</Link>
                  </Button>
                </div>
              </div>

              <h2 className="font-body text-2xl font-semibold leading-relaxed text-foreground">
                Checkout as Guest
              </h2>
            </>
          )}

          {/* --- CONTACT --- */}
          <div className="space-y-4">
            <h3 className="font-body text-xl font-semibold text-foreground">
              Contact
            </h3>
            <div className="space-y-2">
              <CheckoutInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <button
                type="button"
                className="flex items-center gap-1.5"
                onClick={() => setEmailOffers(!emailOffers)}
              >
                {emailOffers ? (
                  <CheckSquare className="h-5 w-5 text-brand-gold" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-body text-xs font-semibold text-foreground">
                  Email me with news and offers
                </span>
              </button>
            </div>
          </div>

          {/* --- DELIVERY --- */}
          <div className="space-y-4">
            <h3 className="font-body text-xl font-semibold text-foreground">
              Delivery
            </h3>

            {/* Country select */}
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-12 w-full appearance-none border border-[#333] bg-transparent pb-1.5 pl-3 pr-10 pt-5 font-body text-sm text-foreground [&>option]:bg-[#121212] [&>option]:text-foreground focus:outline-none focus:ring-1 focus:ring-brand-gold"
              >
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="gb">United Kingdom</option>
                <option value="gh">Ghana</option>
              </select>
              <span className="pointer-events-none absolute left-3 top-1.5 font-body text-[10px] text-muted-foreground">
                Country/Region
              </span>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <CheckoutInput
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
              <CheckoutInput
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>

            {/* Address */}
            <CheckoutInput
              placeholder="Address"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              autoComplete="address-line1"
              required
            />

            {/* Apartment */}
            <CheckoutInput
              placeholder="Apartment, suite, etc. (optional)"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              autoComplete="address-line2"
            />

            {/* City + Postal */}
            <div className="grid grid-cols-2 gap-4">
              <CheckoutInput
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                required
              />
              <CheckoutInput
                placeholder="Postal code (optional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                autoComplete="postal-code"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <CheckoutInput
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="pl-10"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2"
                onClick={() => setSameAsBilling(!sameAsBilling)}
              >
                {sameAsBilling ? (
                  <CheckSquare className="h-5 w-5 text-brand-gold" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-body text-xs font-semibold text-muted-foreground">
                  Use shipping address as billing address
                </span>
              </button>
            </div>
          </div>

          {/* --- Continue to Shipping (info phase) --- */}
          {phase === "info" && (
            <Button
              onClick={handleSaveInfo}
              disabled={
                submitting ||
                !email ||
                !firstName ||
                !lastName ||
                !address1 ||
                !city
              }
              className="h-14 w-full rounded-none bg-brand-gold font-body text-sm font-bold uppercase tracking-widest text-background hover:bg-brand-gold/90"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              CONTINUE TO SHIPPING
            </Button>
          )}

          {/* --- SHIPPING METHOD --- */}
          {(phase === "shipping" || phase === "payment") && (
            <div className="space-y-2">
              <h3 className="font-body text-xl font-semibold text-foreground">
                Shipping method
              </h3>
              {shippingOptions.length > 0 ? (
                <div className="space-y-0">
                  {shippingOptions.map(
                    (option: {
                      id: string
                      name: string
                      amount: number
                    }) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          if (phase === "shipping")
                            handleSelectShipping(option.id)
                        }}
                        disabled={submitting && phase === "shipping"}
                        className={cn(
                          "flex h-12 w-full items-center justify-between border border-[#333] px-3 text-left font-body text-xs text-foreground transition-colors",
                          selectedShipping === option.id
                            ? "border-foreground bg-[#28292a]"
                            : "hover:border-foreground/50"
                        )}
                      >
                        <span className="flex-1 pr-4 leading-snug">
                          {option.name}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatPrice(option.amount, cart.currency_code)}
                        </span>
                      </button>
                    )
                  )}
                </div>
              ) : (
                <div className="flex h-12 items-center border border-[#333] bg-[#28292a] px-3">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="font-body text-xs text-muted-foreground">
                    Loading shipping options...
                  </span>
                </div>
              )}
              {submitting && phase === "shipping" && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-gold" />
                </div>
              )}
            </div>
          )}

          {/* --- PAYMENT --- */}
          {phase === "payment" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-body text-xl font-semibold text-foreground">
                  Payment
                </h3>
                <p className="font-body text-xs font-medium text-muted-foreground">
                  All transactions are secure and encrypted.
                </p>
              </div>

              {clientSecret && stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#D4AF37",
                        colorBackground: "#121212",
                        colorText: "#E0E0E0",
                        colorDanger: "#ef4444",
                        fontFamily: "Montserrat, sans-serif",
                        borderRadius: "0px",
                      },
                      rules: {
                        ".Input": {
                          border: "1px solid #333",
                          backgroundColor: "transparent",
                        },
                        ".Input:focus": {
                          border: "1px solid #D4AF37",
                          boxShadow: "none",
                        },
                      },
                    },
                  }}
                >
                  <StripePaymentForm
                    cartId={cartId}
                    clientSecret={clientSecret}
                    onComplete={handleOrderComplete}
                    onError={(msg) => setError(msg)}
                  />
                </Elements>
              ) : (
                <div className="space-y-4">
                  <p className="font-body text-sm text-muted-foreground">
                    Payment is not configured yet. Please add your Stripe keys
                    to enable payment processing.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error display */}
          {error && (
            <p className="text-center font-body text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ====== RIGHT — Sticky Order Summary (Frame 92) ====== */}
      <div className="border-t border-[#888]/20 bg-card px-6 py-10 lg:sticky lg:top-0 lg:h-screen lg:w-[47%] lg:max-w-[680px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-[400px]">
          <OrderSidebar cart={cart} />
        </div>
      </div>
    </div>
  )
}
