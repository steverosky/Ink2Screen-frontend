"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Truck,
  CreditCard,
  ShoppingCart,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCartStore, useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"

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

const STEPS = [
  { id: 1, label: "Email", icon: Mail },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Shipping", icon: Truck },
  { id: 4, label: "Payment", icon: CreditCard },
]

// --- Step Indicator ---
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        const isActive = step.id === currentStep
        const isComplete = step.id < currentStep

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isComplete
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Order Summary Sidebar ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OrderSummary({ cart }: { cart: any }) {
  const items = cart?.items || []

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item: { id: string; thumbnail?: string; product_title?: string; variant_title?: string; quantity: number; unit_price: number }) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.product_title || "Product"}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No img
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.product_title}</p>
              <p className="text-xs text-muted-foreground">
                {item.variant_title} x{item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
            </p>
          </div>
        ))}

        <Separator />

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(cart.item_subtotal, cart.currency_code)}</span>
          </div>
          {cart.shipping_total > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {formatPrice(cart.shipping_total, cart.currency_code)}
              </span>
            </div>
          )}
          {cart.tax_total > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(cart.tax_total, cart.currency_code)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">
            {formatPrice(cart.total, cart.currency_code)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secure checkout</span>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Stripe Payment Form (inner component) ---
function StripePaymentForm({
  cartId,
  clientSecret,
  onComplete,
}: {
  cartId: string
  clientSecret: string
  onComplete: (orderId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCartStore()

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    try {
      // Validate the payment element
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment validation failed.")
        setLoading(false)
        return
      }

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
        redirect: "if_required",
      })

      if (confirmError) {
        setError(
          confirmError.message || "Payment failed. Please try again."
        )
        setLoading(false)
        return
      }

      // Payment confirmed — complete the cart in Medusa
      const result = await sdk.store.cart.complete(cartId)

      if (result.type === "order") {
        clearCart()
        onComplete(result.order.id)
      } else {
        setError("Order could not be completed. Please try again.")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePlaceOrder} className="space-y-4">
      <PaymentElement />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Place Order
          </>
        )}
      </Button>
    </form>
  )
}

// --- Main Checkout Form ---
export function CheckoutForm() {
  const router = useRouter()
  const { cartId, clearCart } = useCartStore()
  const { customer, isAuthenticated } = useAuthStore()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Email
  const [email, setEmail] = useState("")

  // Step 2: Address
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address1, setAddress1] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [countryCode, setCountryCode] = useState("us")
  const [phone, setPhone] = useState("")
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Step 3: Shipping
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")

  // Step 4: Payment
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

      // Pre-fill email if authenticated
      if (isAuthenticated && customer?.email) {
        setEmail(customer.email)
      } else if (fetchedCart.email) {
        setEmail(fetchedCart.email)
      }

      // Pre-fill address if cart already has one
      if (fetchedCart.shipping_address) {
        const addr = fetchedCart.shipping_address
        if (addr.first_name) setFirstName(addr.first_name)
        if (addr.last_name) setLastName(addr.last_name)
        if (addr.address_1) setAddress1(addr.address_1)
        if (addr.city) setCity(addr.city)
        if (addr.province) setProvince(addr.province)
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

  // --- Step Handlers ---

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cartId || !email) return

    setSubmitting(true)
    setError(null)
    try {
      const { cart: updatedCart } = await sdk.store.cart.update(cartId, {
        email,
      })
      setCart(updatedCart)
      setStep(2)
    } catch {
      setError("Failed to save email. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cartId) return

    setSubmitting(true)
    setError(null)
    try {
      const shippingAddress = {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        city,
        province,
        postal_code: postalCode,
        country_code: countryCode,
        phone,
      }

      const { cart: updatedCart } = await sdk.store.cart.update(cartId, {
        shipping_address: shippingAddress,
        billing_address: sameAsBilling ? shippingAddress : undefined,
      })
      setCart(updatedCart)

      // Fetch shipping options
      const { shipping_options } =
        await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
      setShippingOptions(shipping_options || [])

      setStep(3)
    } catch {
      setError("Failed to save address. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cartId || !selectedShipping) return

    setSubmitting(true)
    setError(null)
    try {
      const { cart: updatedCart } = await sdk.store.cart.addShippingMethod(
        cartId,
        { option_id: selectedShipping }
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

      if (secret) {
        setClientSecret(secret)
      }

      // Re-fetch cart with payment info
      const { cart: refreshedCart } = await sdk.store.cart.retrieve(cartId)
      setCart(refreshedCart)

      setStep(4)
    } catch {
      setError("Failed to set up shipping/payment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleOrderComplete(orderId: string) {
    router.push(`/checkout/confirmation?orderId=${orderId}`)
  }

  // --- Render ---

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!cartId || !cart || !cart.items?.length) {
    return (
      <div className="py-16 text-center">
        <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-8 text-muted-foreground">
          Add some items before checking out.
        </p>
        <Button asChild>
          <Link href="/artefacts">Browse The Artifacts</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
      <StepIndicator currentStep={step} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          {/* Step 1: Email */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login?redirect=checkout"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in for faster checkout
                    </Link>
                  </p>
                )}
                {isAuthenticated && customer && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-medium">
                      {customer.first_name || customer.email}
                    </span>
                  </p>
                )}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      We&apos;ll send your order confirmation here
                    </p>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button type="submit" disabled={submitting || !email}>
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Continue to Address
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping Address */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address1">Address</Label>
                    <Input
                      id="address1"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      required
                      autoComplete="address-line1"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="province">State / Province</Label>
                      <Input
                        id="province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">ZIP / Postal code</Label>
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="countryCode">Country</Label>
                      <Input
                        id="countryCode"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        required
                        autoComplete="country"
                        placeholder="us"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="sameAsBilling" className="font-normal">
                      Billing address same as shipping
                    </Label>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        !firstName ||
                        !lastName ||
                        !address1 ||
                        !city ||
                        !postalCode
                      }
                    >
                      {submitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Continue to Shipping
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Shipping Method */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  {shippingOptions.length > 0 ? (
                    <RadioGroup
                      value={selectedShipping}
                      onValueChange={setSelectedShipping}
                    >
                      {shippingOptions.map(
                        (option: {
                          id: string
                          name: string
                          amount: number
                        }) => (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                              selectedShipping === option.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-muted-foreground/30"
                            }`}
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={option.id}
                            />
                            <Label
                              htmlFor={option.id}
                              className="flex flex-1 cursor-pointer items-center justify-between font-normal"
                            >
                              <span>{option.name}</span>
                              <span className="font-semibold">
                                {formatPrice(
                                  option.amount,
                                  cart.currency_code
                                )}
                              </span>
                            </Label>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  ) : (
                    <p className="text-muted-foreground">
                      No shipping options available for your address.
                    </p>
                  )}

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || !selectedShipping}
                    >
                      {submitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Continue to Payment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientSecret && stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#8B5CF6",
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      cartId={cartId}
                      clientSecret={clientSecret}
                      onComplete={handleOrderComplete}
                    />
                  </Elements>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Payment is not configured yet. Please add your Stripe
                      keys to enable payment processing.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStep(3)}
                    >
                      Back
                    </Button>
                  </div>
                )}

                {clientSecret && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setStep(3)}
                  >
                    Back
                  </Button>
                )}

                {error && (
                  <p className="mt-4 text-sm text-destructive">{error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-first lg:order-last">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </>
  )
}
