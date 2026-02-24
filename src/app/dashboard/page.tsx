import { Metadata } from "next"
import { UserCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>
      <Card>
        <CardContent className="py-16 text-center">
          <UserCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Account dashboard coming soon. You&apos;ll be able to view orders,
            manage your profile, and track purchases.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
