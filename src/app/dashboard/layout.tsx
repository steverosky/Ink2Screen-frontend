"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { User, Package, Heart, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { sdk } from "@/lib/sdk"

const navItems = [
  { label: "Overview", href: "/dashboard", icon: User },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Profile", href: "/dashboard/profile", icon: User },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, customer, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await sdk.auth.logout()
    } catch {
      // Ignore logout errors
    }
    clearAuth()
    router.push("/")
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-[1280px] px-6 py-10 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.15em] text-brand-gold sm:text-sm">
            MY ACCOUNT
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#e0e0e0] sm:text-4xl">
            {customer?.first_name
              ? `Welcome, ${customer.first_name}`
              : "Your Account"}
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Sidebar */}
          <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto md:w-[220px] md:flex-col md:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-purple/10 text-brand-gold"
                      : "text-[#888] hover:bg-[#121212] hover:text-[#e0e0e0]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#888] transition-colors hover:bg-[#121212] hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
