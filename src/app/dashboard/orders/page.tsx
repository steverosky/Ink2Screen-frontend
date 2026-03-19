"use client"

import Link from "next/link"
import { Package } from "lucide-react"
import { useEffect, useState } from "react"
import { sdk, getDefaultRegionId } from "@/lib/sdk"

type Order = {
  id: string
  display_id: number
  status: string
  created_at: string
  total: number
  currency_code: string
  items: { id: string; title: string; quantity: number; unit_price: number }[]
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500",
    completed: "bg-green-500/10 text-green-500",
    canceled: "bg-red-500/10 text-red-500",
    archived: "bg-[#444]/10 text-[#888]",
  }

  return (
    <span
      className={`rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${colors[status] ?? "bg-brand-purple/10 text-brand-gold"}`}
    >
      {status}
    </span>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const regionId = await getDefaultRegionId()
        const res = await sdk.store.order.list({
          limit: 50,
          order: "-created_at",
          ...(regionId ? { region_id: regionId } : {}),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOrders((res.orders ?? []) as any)
      } catch {
        // API unavailable
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0]">
          Order History
        </h2>
        <p className="mt-1 text-sm text-[#888]">
          View and track all your purchases.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[10px] border border-[#222] bg-[#121212] p-12 text-center">
          <p className="text-sm text-[#888]">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[10px] border border-[#222] bg-[#121212] p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-[#444]" />
          <p className="text-lg text-[#888]">No orders yet.</p>
          <p className="mt-1 text-sm text-[#666]">
            When you make a purchase, your orders will appear here.
          </p>
          <Link
            href="/artefacts"
            className="mt-4 inline-block text-sm font-semibold text-brand-gold hover:text-brand-gold/80"
          >
            Browse The Artifacts
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="group overflow-hidden rounded-[10px] border border-[#222] bg-[#121212] transition-colors hover:border-brand-gold/30"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222] px-6 py-4">
                <div className="flex items-center gap-4">
                  <p className="font-heading text-lg font-bold text-[#e0e0e0] group-hover:text-brand-gold">
                    Order #{order.display_id}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#888]">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="text-sm font-bold text-brand-gold">
                    {formatPrice(order.total, order.currency_code)}
                  </span>
                </div>
              </div>

              {/* Items preview */}
              {order.items && order.items.length > 0 && (
                <div className="px-6 py-3">
                  <p className="text-xs text-[#888]">
                    {order.items.map((item) => `${item.title} ×${item.quantity}`).join(", ")}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
