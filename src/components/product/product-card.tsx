"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatPrice(amount: number | undefined | null, currency: string = "usd") {
  if (amount == null) return ""
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductCard({ product }: { product: any }) {
  const firstVariant = product.variants?.[0]
  const price = firstVariant?.calculated_price?.calculated_amount
  const currency = firstVariant?.calculated_price?.currency_code || "usd"
  const category = product.categories?.[0]?.name

  return (
    <Link href={`/marketplace/${product.handle}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          {category && (
            <Badge
              variant="secondary"
              className="absolute left-2 top-2"
            >
              {category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1 font-semibold group-hover:text-primary">
            {product.title}
          </h3>
          {product.description && (
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          {price !== undefined && (
            <p className="text-lg font-bold text-primary">
              {formatPrice(price, currency)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
