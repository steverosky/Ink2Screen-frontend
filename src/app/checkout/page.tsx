import { Metadata } from "next"
import { CheckoutForm } from "./checkout-form"

export const metadata: Metadata = {
  title: "Secure Checkout | Ink2Screen",
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
