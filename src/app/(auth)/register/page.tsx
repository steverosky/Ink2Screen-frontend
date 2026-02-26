import { Suspense } from "react"
import { Metadata } from "next"
import { RegisterForm } from "./register-form"

export const metadata: Metadata = {
  title: "Create Account",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
