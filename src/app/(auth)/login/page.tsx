import { Suspense } from "react"
import { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
