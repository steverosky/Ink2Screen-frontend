"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Menu, Search, User, LogOut, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCartStore, useAuthStore } from "@/lib/store"
import { useState, useEffect, useRef, useCallback } from "react"
import { sdk, getDefaultRegionId } from "@/lib/sdk"

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Artifacts", href: "/artefacts" },
  { label: "Events", href: "/events" },
  { label: "Podcast", href: "/podcast" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const router = useRouter()
  const { cartId } = useCartStore()
  const { customer, isAuthenticated, setCustomer, clearAuth } = useAuthStore()
  const [cartCount, setCartCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    try {
      const regionId = await getDefaultRegionId()
      const { products } = await sdk.store.product.list({
        q,
        limit: 6,
        fields: "+variants.calculated_price",
        region_id: regionId,
      })
      setSearchResults(products)
    } catch {
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runSearch(searchQuery)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, runSearch])

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([])
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function clearSearch() {
    setSearchQuery("")
    setSearchResults([])
  }

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
            className="h-10"
            style={{ width: "auto" }}
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
            <Link href="/artefacts">START PROJECT</Link>
          </Button>

          {/* Search Bar — Desktop */}
          <div className="relative hidden lg:flex" ref={searchRef}>
            <div className="flex h-10 w-[296px] items-center gap-2 rounded-full border border-brand-gold bg-[#121212] px-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#888] outline-none"
              />
              {searchQuery ? (
                <button onClick={clearSearch} className="text-[#888] hover:text-[#e0e0e0]">
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-5 w-5 text-[#888]" />
              )}
            </div>
            {/* Search Dropdown */}
            {(searchResults.length > 0 || searchLoading) && searchQuery && (
              <div className="absolute left-0 top-12 z-50 w-[340px] overflow-hidden rounded-lg border border-brand-gold/20 bg-[#121212] shadow-xl">
                {searchLoading ? (
                  <div className="px-4 py-3 text-sm text-[#888]">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#888]">No results found.</div>
                ) : (
                  <ul>
                    {searchResults.map((product) => {
                      const price = product.variants?.[0]?.calculated_price?.calculated_amount
                      return (
                        <li key={product.id}>
                          <Link
                            href={`/artefacts/${product.handle}`}
                            onClick={clearSearch}
                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                          >
                            {product.thumbnail && (
                              <Image
                                src={product.thumbnail}
                                alt={product.title}
                                width={36}
                                height={36}
                                className="h-9 w-9 shrink-0 rounded object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#e0e0e0]">{product.title}</p>
                              {price != null && (
                                <p className="text-xs text-brand-gold">
                                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "usd" }).format(price)}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
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
                    href="/artefacts"
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder:text-[#888] outline-none"
              autoFocus
            />
            {searchQuery ? (
              <button onClick={clearSearch} className="text-[#888]">
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="h-5 w-5 text-[#888]" />
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 overflow-hidden rounded-lg border border-brand-gold/20 bg-[#121212]">
              {searchLoading ? (
                <div className="px-4 py-3 text-sm text-[#888]">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#888]">No results found.</div>
              ) : (
                <ul>
                  {searchResults.map((product) => {
                    const price = product.variants?.[0]?.calculated_price?.calculated_amount
                    return (
                      <li key={product.id}>
                        <Link
                          href={`/artefacts/${product.handle}`}
                          onClick={() => { clearSearch(); setSearchOpen(false) }}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                        >
                          {product.thumbnail && (
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              width={36}
                              height={36}
                              className="h-9 w-9 shrink-0 rounded object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#e0e0e0]">{product.title}</p>
                            {price != null && (
                              <p className="text-xs text-brand-gold">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "usd" }).format(price)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
