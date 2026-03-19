"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { sdk, getDefaultRegionId } from "@/lib/sdk"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrderDetail = any

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDetail>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrder() {
      try {
        const regionId = await getDefaultRegionId()
        const res = await sdk.store.order.retrieve(id, {
          fields: "+items,+items.variant,+items.variant.product,+shipping_address",
          ...(regionId ? { region_id: regionId } : {}),
        })
        setOrder(res.order)
      } catch {
        // Order not found
      } finally {
        setLoading(false)
      }
    }
    if (id) loadOrder()
  }, [id])

  if (loading) {
    return (
      <div className="rounded-[10px] border border-[#222] bg-[#121212] p-12 text-center">
        <p className="text-sm text-[#888]">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-[10px] border border-[#222] bg-[#121212] p-12 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-[#444]" />
        <p className="text-lg text-[#888]">Order not found.</p>
        <Link
          href="/dashboard/orders"
          className="mt-4 inline-block text-sm font-semibold text-brand-gold"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const currency = order.currency_code ?? "usd"

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/dashboard/orders"
        className="flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-brand-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0]">
            Order #{order.display_id}
          </h2>
          <p className="mt-1 text-sm text-[#888]">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <span className="rounded-sm bg-brand-purple/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold">
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
        <div className="border-b border-[#222] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#e0e0e0]">Items</h3>
        </div>
        <div className="divide-y divide-[#222]">
          {order.items?.map((item: OrderDetail) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-[#1a1a1a]">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-6 w-6 text-[#444]" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#e0e0e0]">
                  {item.title}
                </p>
                {item.variant_title && (
                  <p className="text-xs text-[#888]">{item.variant_title}</p>
                )}
                <p className="text-xs text-[#888]">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-[#e0e0e0]">
                {formatPrice(item.unit_price * item.quantity, currency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
        <div className="border-b border-[#222] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#e0e0e0]">
            Order Summary
          </h3>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4">
          {order.subtotal != null && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Subtotal</span>
              <span className="text-[#e0e0e0]">
                {formatPrice(order.subtotal, currency)}
              </span>
            </div>
          )}
          {order.shipping_total != null && order.shipping_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Shipping</span>
              <span className="text-[#e0e0e0]">
                {formatPrice(order.shipping_total, currency)}
              </span>
            </div>
          )}
          {order.tax_total != null && order.tax_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Tax</span>
              <span className="text-[#e0e0e0]">
                {formatPrice(order.tax_total, currency)}
              </span>
            </div>
          )}
          {order.discount_total != null && order.discount_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#888]">Discount</span>
              <span className="text-green-400">
                -{formatPrice(order.discount_total, currency)}
              </span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-[#222] pt-3">
            <span className="text-sm font-bold text-[#e0e0e0]">Total</span>
            <span className="text-lg font-bold text-brand-gold">
              {formatPrice(order.total, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shipping_address && (
        <div className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
          <div className="border-b border-[#222] px-6 py-4">
            <h3 className="text-sm font-semibold text-[#e0e0e0]">
              Shipping Address
            </h3>
          </div>
          <div className="px-6 py-4 text-sm text-[#888]">
            <p className="text-[#e0e0e0]">
              {order.shipping_address.first_name}{" "}
              {order.shipping_address.last_name}
            </p>
            <p>{order.shipping_address.address_1}</p>
            {order.shipping_address.address_2 && (
              <p>{order.shipping_address.address_2}</p>
            )}
            <p>
              {order.shipping_address.city}, {order.shipping_address.province}{" "}
              {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country_code?.toUpperCase()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
