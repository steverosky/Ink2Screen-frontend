"use client"

import Link from "next/link"
import { Package, Heart, User, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { sdk, getDefaultRegionId } from "@/lib/sdk"
import { useAuthStore } from "@/lib/store"
import { getWishlist } from "@/lib/wishlist"

type OrderSummary = {
  id: string
  display_id: number
  status: string
  created_at: string
  total: number
  currency_code: string
}

const quickLinks = [
  {
    label: "My Orders",
    description: "View order history and track shipments",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    label: "Wishlist",
    description: "Items you've saved for later",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    label: "Profile",
    description: "Update your name, email, and password",
    href: "/dashboard/profile",
    icon: User,
  },
]

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function DashboardOverview() {
  const { customer } = useAuthStore()
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const regionId = await getDefaultRegionId()

        // Fetch recent orders
        const ordersRes = await sdk.store.order.list({
          limit: 3,
          order: "-created_at",
          ...(regionId ? { region_id: regionId } : {}),
        })
        setRecentOrders(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (ordersRes.orders ?? []).map((o: any) => ({
            id: o.id,
            display_id: o.display_id,
            status: o.status,
            created_at: o.created_at,
            total: o.total,
            currency_code: o.currency_code,
          }))
        )

        // Fetch wishlist count
        const wishlist = await getWishlist()
        setWishlistCount(wishlist?.items?.length ?? 0)
      } catch {
        // API unavailable
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex flex-col gap-8">
      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] p-6 transition-colors hover:border-brand-gold/30"
            >
              <Icon className="h-6 w-6 text-brand-gold" />
              <div>
                <p className="font-heading text-lg font-bold tracking-tight text-[#e0e0e0] group-hover:text-brand-gold">
                  {link.label}
                </p>
                <p className="mt-1 text-sm text-[#888]">{link.description}</p>
              </div>
              <ArrowRight className="absolute right-6 top-6 h-4 w-4 text-[#444] transition-colors group-hover:text-brand-gold" />
            </Link>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[10px] border border-[#222] bg-[#121212] p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-brand-gold">
            TOTAL ORDERS
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-[#e0e0e0]">
            {loading ? "—" : recentOrders.length}
          </p>
        </div>
        <div className="rounded-[10px] border border-[#222] bg-[#121212] p-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-brand-gold">
            WISHLIST ITEMS
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-[#e0e0e0]">
            {loading ? "—" : wishlistCount}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold tracking-tight text-[#e0e0e0]">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold/80"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
            <p className="text-sm text-[#888]">Loading...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-[10px] border border-[#222] bg-[#121212] p-8 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-[#444]" />
            <p className="text-sm text-[#888]">No orders yet.</p>
            <Link
              href="/artefacts"
              className="mt-3 inline-block text-sm font-semibold text-brand-gold hover:text-brand-gold/80"
            >
              Browse The Artifacts
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#222] overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#1a1a1a]"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-[#e0e0e0]">
                    Order #{order.display_id}
                  </p>
                  <p className="text-xs text-[#888]">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-sm bg-brand-purple/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[#e0e0e0]">
                    {formatPrice(order.total, order.currency_code)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account info */}
      <div className="rounded-[10px] border border-[#222] bg-[#121212] p-6">
        <p className="text-xs font-semibold tracking-[0.1em] text-brand-gold">
          ACCOUNT
        </p>
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-sm text-[#e0e0e0]">
            {customer?.first_name} {customer?.last_name}
          </p>
          <p className="text-sm text-[#888]">{customer?.email}</p>
        </div>
        <Link
          href="/dashboard/profile"
          className="mt-3 inline-block text-sm font-semibold text-brand-gold hover:text-brand-gold/80"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  )
}
