"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, Search, User, LogOut, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCartStore, useAuthStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { sdk } from "@/lib/sdk"

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Artifacts", href: "/artefacts" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const router = useRouter()
  const { cartId } = useCartStore()
  const { customer, isAuthenticated, setCustomer, clearAuth } = useAuthStore()
  const [cartCount, setCartCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Fetch cart count
  useEffect(() => {
    if (!cartId) {
      setCartCount(0)
      return
    }

    sdk.store.cart
      .retrieve(cartId)
      .then(({ cart }) => {
        const count =
          cart.items?.reduce(
            (acc: number, item: { quantity: number }) => acc + item.quantity,
            0
          ) ?? 0
        setCartCount(count)
      })
      .catch(() => setCartCount(0))
  }, [cartId])

  // Validate auth session on mount
  useEffect(() => {
    sdk.store.customer
      .retrieve()
      .then(({ customer }) => {
        setCustomer({
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
        })
      })
      .catch(() => {
        clearAuth()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogout() {
    try {
      await sdk.auth.logout()
    } catch {
      // Ignore logout errors — clear local state regardless
    }
    clearAuth()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-[10px] bg-[#050505]/85">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-20">
        {/* Logo */}
        <Link href="/" className="relative shrink-0">
          <Image
            src="/images/logo.png"
            alt="Ink2Screen"
            width={34}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-2.5 text-sm font-semibold tracking-wide text-[#e0e0e0] transition-colors hover:text-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Gold CTA Button — Desktop */}
          <Button
            asChild
            className="hidden h-11 bg-brand-gold px-6 font-bold text-sm tracking-widest text-[#050505] hover:bg-brand-gold-dark lg:flex"
          >
            <Link href="/marketplace">START PROJECT</Link>
          </Button>

          {/* Search Bar — Desktop */}
          <div className="hidden lg:flex">
            <div className="flex h-10 w-[296px] items-center gap-2 rounded-full border border-brand-gold bg-[#121212] px-3">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#888] outline-none"
              />
              <Search className="h-5 w-5 text-[#888]" />
            </div>
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#e0e0e0] hover:text-brand-gold lg:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Auth-aware user button — Desktop */}
          {isAuthenticated && customer ? (
            <div className="hidden items-center gap-1 lg:flex">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#e0e0e0] hover:text-brand-gold"
              >
                <Link href="/dashboard" className="gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate text-sm">
                    {customer.first_name || "Account"}
                  </span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                title="Wishlist"
                className="text-[#e0e0e0] hover:text-brand-gold"
              >
                <Link href="/dashboard/wishlist">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sign out"
                className="text-[#e0e0e0] hover:text-brand-gold"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden text-[#e0e0e0] hover:text-brand-gold lg:flex"
            >
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Link>
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-[#e0e0e0] hover:text-brand-gold"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold p-0 text-xs text-[#050505]"
                  aria-live="polite"
                >
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">
                Shopping cart{cartCount > 0 ? `, ${cartCount} items` : ""}
              </span>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#e0e0e0] hover:text-brand-gold"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-l border-brand-gold/20 bg-[#050505]"
            >
              <nav className="flex flex-col gap-4 pt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-semibold text-[#e0e0e0] transition-colors hover:text-brand-gold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 border-t border-brand-gold/20" />
                <Button
                  asChild
                  className="h-11 w-full bg-brand-gold font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
                >
                  <Link
                    href="/marketplace"
                    onClick={() => setMobileOpen(false)}
                  >
                    START PROJECT
                  </Link>
                </Button>
                <div className="my-2 border-t border-brand-gold/20" />
                {isAuthenticated && customer ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium text-[#e0e0e0] transition-colors hover:text-brand-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/dashboard/wishlist"
                      className="text-lg font-medium text-[#e0e0e0] transition-colors hover:text-brand-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        handleLogout()
                      }}
                      className="text-left text-lg font-medium text-destructive transition-colors hover:text-destructive/80"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-lg font-medium text-[#e0e0e0] transition-colors hover:text-brand-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-lg font-medium text-[#e0e0e0] transition-colors hover:text-brand-gold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="border-t border-brand-gold/20 px-6 py-3 lg:hidden">
          <div className="flex h-10 items-center gap-2 rounded-full border border-brand-gold bg-[#121212] px-3">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#888] outline-none"
              autoFocus
            />
            <Search className="h-5 w-5 text-[#888]" />
          </div>
        </div>
      )}
    </header>
  )
}
