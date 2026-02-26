"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "./add-to-cart-button"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductDetailClient({ product }: { product: any }) {
  const [detailsOpen, setDetailsOpen] = useState(true)
  const [shippingOpen, setShippingOpen] = useState(false)

  // Build details from product metadata if available
  const metadata = product.metadata || {}
  const details = Object.entries(metadata)
    .filter(([key]) => !key.startsWith("_"))
    .map(([key, value]) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      value: String(value),
    }))

  const category = product.categories?.[0]?.name

  return (
    <div className="w-full px-6 pt-10 lg:sticky lg:top-20 lg:h-fit lg:w-[630px] lg:self-start lg:px-20 lg:pt-20">
      <div className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="font-heading text-4xl font-bold leading-[1.3] tracking-tight text-[#e0e0e0] md:text-5xl">
          {product.title?.toUpperCase()}
        </h1>

        {/* Eyebrow */}
        {category && (
          <p className="text-sm font-semibold tracking-[0.1em] text-brand-gold">
            {category.toUpperCase()}
          </p>
        )}

        {/* Description */}
        {product.description && (
          <div className="text-base font-normal leading-[1.7] text-[#e0e0e0]">
            <p>{product.description}</p>
          </div>
        )}

        {/* Add to Cart (includes price, format selector, quantity, buttons) */}
        <AddToCartButton product={product} />

        {/* Details Accordion */}
        {details.length > 0 && (
          <>
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex w-full items-center justify-between text-sm font-semibold tracking-[0.1em] text-brand-gold"
            >
              <span>DETAILS</span>
              <span>{detailsOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
            </button>
            {detailsOpen && (
              <div className="text-base leading-[1.7] text-[#e0e0e0]">
                {details.map((detail) => (
                  <p key={detail.label}>
                    <span className="font-bold">{detail.label}</span>
                    <span className="text-[#e0e0e0]">
                      {" "}
                      : {detail.value}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {/* Shipping Accordion */}
        <button
          onClick={() => setShippingOpen(!shippingOpen)}
          className="flex w-full items-center justify-between text-sm font-semibold tracking-[0.1em] text-brand-gold"
        >
          <span>SHIPPING</span>
          <span>{shippingOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
        </button>
        {shippingOpen && (
          <div className="text-base leading-[1.7] text-[#e0e0e0]">
            <p>Free shipping on orders over $50.</p>
            <p>Standard delivery: 5-7 business days.</p>
            <p>Express delivery: 2-3 business days.</p>
          </div>
        )}

        {/* Bottom spacer for sticky calculation */}
        <div className="h-8" />
      </div>
    </div>
  )
}
