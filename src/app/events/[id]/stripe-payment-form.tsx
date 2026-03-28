"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sdk } from "@/lib/sdk"
import { formatEventPrice } from "@/lib/events-api"

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null

export type EventRegistrationPayload = {
  event_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  ticket_quantity: number
  waiver_accepted: boolean
  media_release_accepted: boolean
}

type InnerFormProps = {
  paymentIntentId: string
  registrationData: EventRegistrationPayload
  totalPrice: number
  onSuccess: (registrationId: string) => void
  onError: (msg: string) => void
}

function StripeInnerForm({
  paymentIntentId,
  registrationData,
  totalPrice,
  onSuccess,
  onError,
}: InnerFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    if (!stripe || !elements) return
    setLoading(true)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        onError(submitError.message || "Payment failed")
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (confirmError) {
        onError(confirmError.message || "Payment failed")
        setLoading(false)
        return
      }

      // Payment confirmed — now register via Medusa (verifies server-side before recording)
      const result = await sdk.client.fetch<{ id: string }>(
        "/store/event-registrations",
        {
          method: "POST",
          body: {
            ...registrationData,
            payment_intent_id: paymentIntentId,
          },
        }
      )
      onSuccess(result.id)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Registration failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button
        onClick={handlePay}
        disabled={!stripe || !elements || loading}
        className="h-14 w-full rounded-none bg-brand-gold text-sm font-bold uppercase tracking-widest text-[#050505] hover:bg-brand-gold-dark disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            PROCESSING PAYMENT...
          </>
        ) : (
          `PAY NOW — ${formatEventPrice(totalPrice)}`
        )}
      </Button>
    </div>
  )
}

type Props = {
  clientSecret: string
  paymentIntentId: string
  registrationData: EventRegistrationPayload
  totalPrice: number
  onSuccess: (registrationId: string) => void
  onError: (msg: string) => void
}

export function EventStripePayment({
  clientSecret,
  paymentIntentId,
  registrationData,
  totalPrice,
  onSuccess,
  onError,
}: Props) {
  if (!stripePromise) {
    return (
      <p className="text-center text-sm text-red-400">
        Payment is not configured. Please contact support.
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#D4AF37",
            colorBackground: "#121212",
            colorText: "#e0e0e0",
            colorDanger: "#ef4444",
            borderRadius: "0px",
            fontFamily: "Montserrat, sans-serif",
          },
        },
      }}
    >
      <StripeInnerForm
        paymentIntentId={paymentIntentId}
        registrationData={registrationData}
        totalPrice={totalPrice}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
